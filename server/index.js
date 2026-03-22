require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const bodyParser = require("body-parser"); // realtime
const { createServer } = require("http");
const { Server: SocketIO } = require("socket.io");
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

if (!KEY_ID || !KEY_SECRET) {
  console.warn(
    "Razorpay keys not set. Please copy .env.example to .env and add credentials. Server will still run but order creation will fail.",
  );
}

const razorpay = new Razorpay({
  key_id: KEY_ID || "",
  key_secret: KEY_SECRET || "",
});
// --- realtime bus simulation setup ---

// sample route coords (lat,lng) between two cities
const busRoutes = [
  { from: [19.076, 72.8777], to: [18.5204, 73.8567] }, // Mumbai → Pune
  { from: [28.7041, 77.1025], to: [27.1767, 78.0081] }, // Delhi → Agra
];

// initialize buses with positions on route
const buses = [
  {
    id: "bus1",
    name: "Mumbai Express",
    route: 0,
    position: [...busRoutes[0].from],
    progress: 0,
  },
  {
    id: "bus2",
    name: "Agra Link",
    route: 1,
    position: [...busRoutes[1].from],
    progress: 0,
  },
];

// move buses along route each interval
function updateBusPositions() {
  buses.forEach((bus) => {
    const route = busRoutes[bus.route];
    if (!route) return;
    bus.progress += 0.002; // increment progress
    if (bus.progress > 1) bus.progress = 0; // loop
    bus.position[0] =
      route.from[0] + (route.to[0] - route.from[0]) * bus.progress;
    bus.position[1] =
      route.from[1] + (route.to[1] - route.from[1]) * bus.progress;
  });
  if (io) io.emit("busUpdates", buses);
}

setInterval(updateBusPositions, 3000);

// create HTTP server and socket.io
const httpServer = createServer(app);
const io = new SocketIO(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("client connected");
  socket.emit("busUpdates", buses);
});

// start listening with httpServer instead of app
httpServer.listen(PORT, () => {
  console.log(`Payments & realtime server running on http://localhost:${PORT}`);
});

// export app for testing if needed
module.exports = { app, io };
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount || amount <= 0)
      return res.status(400).json({ error: "Invalid amount" });
    if (!KEY_ID || !KEY_SECRET)
      return res
        .status(500)
        .json({ error: "Server missing Razorpay credentials" });

    const options = {
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return res.json({ orderId: order.id, raw: order });
  } catch (err) {
    console.error("Create order error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Order creation failed" });
  }
});
