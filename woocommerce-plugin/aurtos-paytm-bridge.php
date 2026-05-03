<?php
/**
 * Plugin Name: Aurtos Paytm Bridge
 * Plugin URI:  https://aurtostechnologies.in
 * Description: Routes WooCommerce checkout through aurtostechnologies.in for Paytm payment, then receives the result via webhook.
 * Version:     1.0.0
 * Author:      Aurtos Technologies LLP
 * Author URI:  https://aurtostechnologies.in
 * License:     GPL v2 or later
 * Text Domain: aurtos-paytm-bridge
 *
 * Install instructions:
 *   1. Upload this file to wp-content/plugins/aurtos-paytm-bridge/aurtos-paytm-bridge.php
 *   2. Activate it from WP Admin → Plugins.
 *   3. Go to WooCommerce → Settings → Payments → "Aurtos Paytm Bridge" and configure:
 *        - Aurtos initiate URL: https://aurtostechnologies.in/api/payment/initiate
 *        - Site ID:             auraaccessories
 *        - Shared secret:       same value as PAYMENT_INTEGRATION_SECRET on Aurtos
 *
 * Flow:
 *   Customer → Place order on this site
 *     → On payment, plugin POSTs order details (HMAC-signed) to Aurtos /api/payment/initiate
 *     → Aurtos returns a paymentUrl
 *     → Plugin redirects customer to that URL
 *     → Paytm payment happens, Aurtos posts back the result to our webhook
 *     → Webhook updates the WC order status
 *     → Customer is redirected back to our /order-received/ page
 */

if (!defined('ABSPATH')) exit;

add_action('plugins_loaded', 'aurtos_paytm_bridge_init', 11);

function aurtos_paytm_bridge_init() {
    if (!class_exists('WC_Payment_Gateway')) return;

    class WC_Gateway_Aurtos_Paytm extends WC_Payment_Gateway {

        public function __construct() {
            $this->id                 = 'aurtos_paytm';
            $this->method_title       = 'Aurtos Paytm Bridge';
            $this->method_description = 'Pay securely via Paytm — processed through Aurtos Technologies.';
            $this->has_fields         = false;
            $this->supports           = array('products');

            $this->init_form_fields();
            $this->init_settings();

            $this->title         = $this->get_option('title', 'Pay via Paytm');
            $this->description   = $this->get_option('description', 'You will be redirected to a secure Paytm page.');
            $this->initiate_url  = $this->get_option('initiate_url', 'https://aurtostechnologies.in/api/payment/initiate');
            $this->site_id       = $this->get_option('site_id', 'auraaccessories');
            $this->shared_secret = $this->get_option('shared_secret', '');

            add_action('woocommerce_update_options_payment_gateways_' . $this->id, array($this, 'process_admin_options'));
            add_action('woocommerce_api_aurtos_paytm_webhook', array($this, 'handle_webhook'));
            add_action('woocommerce_api_aurtos_paytm_return', array($this, 'handle_return'));
        }

        public function init_form_fields() {
            $this->form_fields = array(
                'enabled' => array(
                    'title'   => 'Enable / Disable',
                    'type'    => 'checkbox',
                    'label'   => 'Enable Aurtos Paytm Bridge',
                    'default' => 'no',
                ),
                'title' => array(
                    'title'       => 'Title',
                    'type'        => 'text',
                    'description' => 'Title shown to customer at checkout.',
                    'default'     => 'Pay via Paytm',
                    'desc_tip'    => true,
                ),
                'description' => array(
                    'title'       => 'Description',
                    'type'        => 'textarea',
                    'default'     => 'You will be redirected to a secure Paytm page hosted by Aurtos.',
                ),
                'initiate_url' => array(
                    'title'       => 'Aurtos initiate URL',
                    'type'        => 'text',
                    'default'     => 'https://aurtostechnologies.in/api/payment/initiate',
                    'description' => 'Endpoint that creates the Paytm transaction.',
                    'desc_tip'    => true,
                ),
                'site_id' => array(
                    'title'       => 'Site ID',
                    'type'        => 'text',
                    'default'     => 'auraaccessories',
                    'description' => 'Identifier sent to Aurtos to namespace orders.',
                    'desc_tip'    => true,
                ),
                'shared_secret' => array(
                    'title'       => 'Shared secret',
                    'type'        => 'password',
                    'description' => 'Same value as PAYMENT_INTEGRATION_SECRET on the Aurtos server. Used to sign requests and verify the result webhook.',
                    'desc_tip'    => true,
                ),
            );
        }

        public function process_payment($order_id) {
            $order = wc_get_order($order_id);
            if (!$order) return array('result' => 'failure');

            $payload = array(
                'siteId'          => $this->site_id,
                'externalOrderId' => (string) $order_id,
                'amount'          => number_format((float) $order->get_total(), 2, '.', ''),
                'currency'        => $order->get_currency() ?: 'INR',
                'customerId'      => 'WC_' . $order->get_customer_id() . '_' . $order_id,
                'customerEmail'   => $order->get_billing_email(),
                'customerMobile'  => preg_replace('/\D/', '', (string) $order->get_billing_phone()),
                'webhookUrl'      => add_query_arg('wc-api', 'aurtos_paytm_webhook', home_url('/')),
                'returnUrl'       => add_query_arg('wc-api', 'aurtos_paytm_return', home_url('/')),
                'timestamp'       => time(),
            );

            $body = wp_json_encode($payload);
            $signature = hash_hmac('sha256', $body, $this->shared_secret);

            $response = wp_remote_post($this->initiate_url, array(
                'headers' => array(
                    'Content-Type'      => 'application/json',
                    'x-aurtos-signature' => $signature,
                ),
                'body'    => $body,
                'timeout' => 30,
            ));

            if (is_wp_error($response)) {
                wc_add_notice('Payment initiation failed: ' . $response->get_error_message(), 'error');
                return array('result' => 'failure');
            }

            $code = wp_remote_retrieve_response_code($response);
            $data = json_decode(wp_remote_retrieve_body($response), true);

            if ($code !== 200 || empty($data['paymentUrl'])) {
                $msg = isset($data['error']) ? $data['error'] : 'Unable to start payment. Please try again.';
                wc_add_notice('Payment error: ' . $msg, 'error');
                return array('result' => 'failure');
            }

            // Stash Aurtos's orderId so we can match the webhook later
            $order->update_meta_data('_aurtos_paytm_order_id', sanitize_text_field($data['orderId']));
            $order->update_status('pending', 'Awaiting Paytm payment via Aurtos.');
            $order->save();

            return array(
                'result'   => 'success',
                'redirect' => esc_url_raw($data['paymentUrl']),
            );
        }

        /** Server-to-server webhook from Aurtos with the final transaction status. */
        public function handle_webhook() {
            $raw = file_get_contents('php://input');
            $sig = isset($_SERVER['HTTP_X_AURTOS_SIGNATURE']) ? $_SERVER['HTTP_X_AURTOS_SIGNATURE'] : '';
            $expected = hash_hmac('sha256', $raw, $this->shared_secret);

            if (!hash_equals($expected, $sig)) {
                status_header(401);
                echo 'Invalid signature';
                exit;
            }

            $data = json_decode($raw, true);
            if (!$data || empty($data['externalOrderId'])) {
                status_header(400);
                echo 'Bad request';
                exit;
            }

            $order = wc_get_order((int) $data['externalOrderId']);
            if (!$order) {
                status_header(404);
                echo 'Order not found';
                exit;
            }

            $status = isset($data['status']) ? $data['status'] : '';

            if ($status === 'TXN_SUCCESS') {
                $order->payment_complete(isset($data['paytmTxnId']) ? $data['paytmTxnId'] : '');
                $order->add_order_note(sprintf(
                    'Paytm payment succeeded. TxnID: %s, BankTxnID: %s, Mode: %s',
                    isset($data['paytmTxnId']) ? $data['paytmTxnId'] : '-',
                    isset($data['bankTxnId']) ? $data['bankTxnId'] : '-',
                    isset($data['paymentMode']) ? $data['paymentMode'] : '-'
                ));
            } elseif ($status === 'TXN_FAILURE') {
                $order->update_status('failed', sprintf(
                    'Paytm payment failed: %s (%s)',
                    isset($data['respMsg']) ? $data['respMsg'] : '-',
                    isset($data['respCode']) ? $data['respCode'] : '-'
                ));
            } elseif ($status === 'PENDING') {
                $order->update_status('on-hold', 'Paytm payment pending — awaiting bank confirmation.');
            } else {
                $order->add_order_note('Unknown Paytm status: ' . $status);
            }

            status_header(200);
            echo 'OK';
            exit;
        }

        /** Customer redirect back from Aurtos — send them to the standard WC thank-you page. */
        public function handle_return() {
            $external = isset($_GET['externalOrderId']) ? (int) $_GET['externalOrderId'] : 0;
            if (!$external) {
                wp_safe_redirect(wc_get_cart_url());
                exit;
            }
            $order = wc_get_order($external);
            if (!$order) {
                wp_safe_redirect(wc_get_cart_url());
                exit;
            }
            wp_safe_redirect($order->get_checkout_order_received_url());
            exit;
        }
    }

    add_filter('woocommerce_payment_gateways', function ($gateways) {
        $gateways[] = 'WC_Gateway_Aurtos_Paytm';
        return $gateways;
    });
}
