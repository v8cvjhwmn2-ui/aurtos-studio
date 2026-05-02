"use client";

export default function TestPay() {

  const pay = async () => {
    try {
      const res = await fetch('/api/paytm/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: "1.00",
          orderId: "TEST" + Date.now(),
          customerId: "CUST1"
        })
      });

      const data = await res.json();

      console.log("PAYTM RESPONSE:", data);

      const txnToken = data?.body?.txnToken;
      const orderId = data?.body?.orderId;

      if (!txnToken) {
        alert("TxnToken nahi mila ❌");
        return;
      }

      const mid = "OvjOmF58282544949622";

      // ✅ ONLY ONE fields block
      const fields: Record<string, string> = {
        mid,
        orderId,
        txnToken
      };

      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://secure.paytmpayments.com/theia/api/v1/showPaymentPage";

      Object.entries(fields).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

    } catch (err) {
      console.error(err);
      alert("Error aa gaya ❌");
    }
  };

  return (
    <div style={{ padding: 50 }}>
      <h1>Test Payment</h1>
      <button onClick={pay}>Pay ₹1</button>
    </div>
  );
}