export default async function handler(req, res) {
  const data = req.body;

  console.log("PAYMENT RESPONSE:", data);

  // Woo site ko notify karo
  await fetch("https://auraaccessoriessolutions.fun/wp-json/aurtos/v1/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  res.status(200).send("OK");
}