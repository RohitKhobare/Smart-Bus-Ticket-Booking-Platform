# Smart Bus Booking Platform

A modern bus reservation app built with **React**, **Vite**, and **TypeScript**, featuring a secure payment workflow via Razorpay and optional Supabase integration.

## 🚀 Project Overview

Users can browse routes, select buses and seats, provide passenger details, and pay using Razorpay's sandbox. After a successful booking the app redirects the customer to a live tracking page for that bus; a manual "Track Your Bus" button is also offered on the confirmation screen. Bookings are stored locally (and via Supabase if configured). An Express backend handles order creation securely using your Razorpay secret key.

## 👤 Author

**Your Name**

Email: your.email@example.com

## ⚙️ Prerequisites

- Node.js 16+ / npm
- A Razorpay test account (key ID + secret)
- (Optional) Supabase project for persistent storage
- (Optional) no extra cloud services; real‑time tracking is simulated
- `VITE_API_URL` may be set to override the backend/socket URL (defaults to same origin or localhost:4000)

## 🛠️ Setup Instructions

1. **Clone repository**

   ```bash
   git clone <your-repo-url>
   cd Smart-Bus-Booking-Platform
   ```

2. **Install dependencies**

   ```bash
   npm install          # frontend (includes new libs: socket.io-client, leaflet, react-leaflet)
   # you may want to add dev types for leaflet:
   #   npm install -D @types/leaflet
   cd server
   npm install          # backend
   cd ..
   ```

3. **Configure environment variables**
   - **Frontend** (optional): create `.env` in root:

     ```env
     VITE_RAZORPAY_KEY_ID=rzp_test_SM1XYnIs87t6S3
     # (optional Supabase)
     VITE_SUPABASE_URL=your_url
     VITE_SUPABASE_ANON_KEY=your_anon_key
     ```

   - **Backend**: copy example and fill in your Razorpay test credentials:
     ```bash
     cd server
     cp .env.example .env
     # edit .env with the provided values
     ```
     ```env
     RAZORPAY_KEY_ID=rzp_test_SM1XYnIs87t6S3
     RAZORPAY_KEY_SECRET=bcAVS5Olmuqucgfcn1zVJvMc
     PORT=4000
     ```

4. **Start the backend server**

   ```bash
   cd server
   node index.js
   ```

   > If you want the frontend to call this local server instead of the
   > serverless function set `VITE_API_URL` in the root `.env` file (see
   > previous step). E.g.:
   >
   > ```bash
   > echo "VITE_API_URL=http://localhost:4000" >> ../.env
   > ```

   Visit `http://localhost:4000/health` to confirm (`{"ok":true}`).

5. **Start the frontend**

   ```bash
   cd ..
   npm run dev
   ```

   Open the URL printed by Vite (e.g. `http://localhost:5185`).

6. **Test booking & payment**
   - Select a bus, choose seats, fill passenger info.
   - Click **Pay ₹... & Confirm Booking**.
   - Use Razorpay test card: `4111 1111 1111 1111` (expiry any future, CVV any 3 digits).
   - After payment succeeds, you'll see a confirmation screen with booking details and a **Track Your Bus** button.
   - Click the button (or visit `/track?bus={busId}` manually) to see the live location of your bus on the map.
   - The bus position updates every ~3 seconds as it moves along its simulated route.

## 📦 Build & Preview

```bash
npm run build       # compile for production
npm run preview     # serve the dist locally
```

## 🚀 Deployment

You can deploy the entire project on Vercel (frontend + serverless backend) or split the frontend and backend.

### Vercel (recommended)

1. Push your repository to GitHub.
2. Go to https://vercel.com and import the repo.
3. During setup, add the following Environment Variables under "Project Settings" \> "Environment Variables":
   - `RAZORPAY_KEY_ID` (test key or live key)
   - `RAZORPAY_KEY_SECRET`
   - optionally `VITE_RAZORPAY_KEY_ID` (for client-usage) and any Supabase vars.
4. Vercel will automatically detect the React project and build it.
5. The `/api/create-order` serverless function is included in the `api/` folder and will be deployed automatically; it uses the same Razorpay credentials.
6. After deployment, the site URL (e.g. `https://your-app.vercel.app`) will serve the frontend, and the serverless endpoint will be available at `https://your-app.vercel.app/api/create-order`.

The frontend already uses a relative path to the API, so no additional configuration is required.

### Other hosting options

- **Frontend**: build with `npm run build` and host output on Netlify, GitHub Pages, S3, etc.
- **Backend**: run the Express server (`server/index.js`) on Heroku, Render, AWS, etc. Set env vars accordingly.

Configure the frontend to point to the backend location in `createPaymentOrder` if you host separately.

## 📚 Additional Notes

### Real-Time Bus Tracking System

The app now features an integrated GPS tracking system:

1. **Booking Confirmation** – After successful payment, customers see a confirmation dialog with booking details.
2. **Automatic Redirect** – The UI automatically redirects to `/track?bus={busId}` after 3 seconds.
3. **Manual Navigation** – Customers can also click "Track Your Bus" on the confirmation screen.
4. **Live Map** – The tracking page displays an interactive Leaflet map centered on the selected bus.
5. **Real-Time Updates** – Bus position updates arrive every ~3 seconds via socket.io.
6. **All Buses on Home** – The homepage shows routes and booking options; no map is displayed before booking.

**How It Works:**

- The backend (`server/index.js`) simulates bus routes between two cities and broadcasts their positions over socket.io.
- The frontend loads `BusMap` component which accepts an optional `busId` prop.
- When `busId` is provided (as in `/track?bus=bus1`), only that bus is shown and the map center follows it.
- Without a `busId` (homepage and search page), all buses are displayed.

## ✅ License

MIT License
