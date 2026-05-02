import https from "https";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { amount, orderId, customerId } = req.body;

  const mid = process.env.PAYTM_MID;
  const key = process.env.PAYTM_KEY;

  const paytmParams = {
    body: {
      requestType: "Payment",
      mid: mid,
      websiteName: "DEFAULT",
      orderId: orderId,
      callbackUrl: "https://aurtostechnologies.in/api/paytm/webhook",
      txnAmount: {
        value: amount,
        currency: "INR",
      },
      userInfo: {
        custId: customerId || "CUST_" + orderId,
      },
    },
  };

  const checksum = crypto
    .createHmac("sha256", key)
    .update(JSON.stringify(paytmParams.body))
    .digest("hex");

  paytmParams.head = { signature: checksum };

  const post_data = JSON.stringify(paytmParams);

  const options = {
    hostname: "secure.paytmpayments.com",
    port: 443,
    path: `/theia/api/v1/initiateTransaction?mid=${mid}&orderId=${orderId}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": post_data.length,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";
    response.on("data", (chunk) => (data += chunk));
    response.on("end", () => {
      const result = JSON.parse(data);
      res.status(200).json(result);
    });
  });

  request.write(post_data);
  request.end();
}