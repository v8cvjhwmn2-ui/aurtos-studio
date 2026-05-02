export default function TestPay() {

  const pay = async () => {
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

    const txnToken = data.body.txnToken;
    const orderId = data.body.orderId;
    const mid = "YOUR_MID"; // apna MID daal

    // 🔥 FORM CREATE
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://secure.paytmpayments.com/theia/api/v1/showPaymentPage";

    const fields = {
      mid: mid,
      orderId: orderId,
      txnToken: txnToken
    };

    Object.keys(fields).forEach(key => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div style={{padding:50}}>
      <h1>Test Payment</h1>
      <button onClick={pay}>Pay ₹1</button>
    </div>
  );
}