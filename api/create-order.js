import Razorpay from "razorpay";

// Vercel serverless function for creating Razorpay orders
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const KEY_ID = process.env.RAZORPAY_KEY_ID;
  const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

  if (!KEY_ID || !KEY_SECRET) {
    res.status(500).json({ error: "Missing Razorpay credentials" });
    return;
  }

  const razorpay = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

  try {
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Invalid amount" });
      return;
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id, raw: order });
  } catch (err) {
    console.error("Create order error", err);
    res.status(500).json({ error: err.message || "Order creation failed" });
  }
}
