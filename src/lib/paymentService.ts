// Payment Service using Razorpay
// For testing, use Razorpay Test Mode (no real charges)
// Test Key: rzp_test_1DP5mmOlF5G5ag (valid test key)

// Use the same Razorpay test Key ID as the backend to avoid preferences 400 error.
// Replace with your test key: rzp_test_SM1XYnIs87t6S3
export const RAZORPAY_KEY_ID = "rzp_test_SM1XYnIs87t6S3"; // Razorpay Test Key (match server)

// Load Razorpay script dynamically
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      console.log("Razorpay already loaded");
      resolve(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );
    if (existingScript) {
      console.log("Razorpay script already in DOM, waiting for load...");
      // Wait for global Razorpay to become available
      let attempts = 0;
      const checkRazorpay = setInterval(() => {
        if ((window as any).Razorpay) {
          clearInterval(checkRazorpay);
          resolve(true);
        }
        attempts++;
        if (attempts > 50) {
          clearInterval(checkRazorpay);
          resolve(false);
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.type = "text/javascript";
    script.async = true;

    script.onload = () => {
      console.log("Razorpay script loaded successfully");
      resolve(true);
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

// Intercept fetch calls to Razorpay to capture failing responses for debugging
const interceptRazorpayFetch = () => {
  if (typeof window === "undefined") return;
  const anyWin: any = window;
  if (anyWin.__razorpayFetchPatched) return;
  anyWin.__razorpayFetchPatched = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: any, init?: any) => {
    try {
      const response = await originalFetch(input, init);
      try {
        const url = typeof input === "string" ? input : (input as Request).url;
        if (url.includes("api.razorpay.com")) {
          const clone = response.clone();
          const text = await clone.text();
          console.warn(
            "[razorpay-intercept] url:",
            url,
            "status:",
            response.status,
            "body:",
            text,
          );
        }
      } catch (e) {
        console.warn("[razorpay-intercept] failed to read response body", e);
      }
      return response;
    } catch (err) {
      console.error("[razorpay-intercept] fetch error", err);
      throw err;
    }
  };
};

interface RazorpayPaymentOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: any) => void;
  modal?: {
    ondismiss: () => void;
  };
  method?: {
    card?: boolean;
    wallet?: boolean;
    upi?: boolean;
    netbanking?: boolean;
    emandate?: boolean;
    paylater?: boolean;
  };
  order_id?: string;
  notes?: { [key: string]: any };
}

// Create payment order by calling local backend if available, otherwise fallback to mock
const API_BASE = import.meta.env.VITE_API_URL || "";

const createPaymentOrder = async (
  amount: number,
  bookingId: string,
): Promise<string | null> => {
  try {
    // Build target URL; when running locally with Express server you can set
    // VITE_API_URL=http://localhost:4000. Leaving it blank uses relative path
    // which works when the backend is deployed as a serverless function at
    // `/api/create-order` (e.g. on Vercel).
    const base = API_BASE ? API_BASE.replace(/\/+$/, "") : "";
    const url = base ? `${base}/api/create-order` : "/api/create-order";
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, receipt: bookingId }),
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log("Created order from backend:", data);
      return data.orderId || data.order_id || data.id || null;
    }

    console.warn(
      "Backend order creation failed, response:",
      resp.status,
      await resp.text(),
    );
    return null;
  } catch (err: any) {
    console.warn("Cannot reach backend order endpoint:", err.message);
    return null;
  }
};

// Initiate Razorpay payment (Demo mode without backend order creation)
export const initiatePayment = async (
  amount: number,
  passengerName: string,
  passengerEmail: string,
  passengerPhone: string,
  bookingId: string,
  onSuccess: (paymentId: string, orderId: string) => void,
  onFailure: (error: string) => void,
) => {
  try {
    // Validate inputs
    if (!amount || amount <= 0) {
      onFailure("Invalid amount");
      return;
    }

    // Install fetch interceptor (will log api.razorpay.com responses)
    try {
      interceptRazorpayFetch();
    } catch (e) {
      console.warn("Failed to install Razorpay fetch interceptor", e);
    }

    // Load Razorpay script
    console.log("Loading Razorpay script...");
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      console.error("Razorpay script failed to load");
      onFailure(
        "Failed to load payment gateway. Please refresh and try again.",
      );
      return;
    }

    // Check if Razorpay is available
    if (!(window as any).Razorpay) {
      console.error("Razorpay not available after loading script");
      onFailure("Payment gateway unavailable. Please refresh and try again.");
      return;
    }

    console.log("Preparing payment options...");

    // Generate IDs for this transaction
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Try to create server-side order (preferred)
    const createdOrderId = await createPaymentOrder(amount, bookingId);
    if (createdOrderId)
      console.log("Using server-created order:", createdOrderId);

    // Options for Razorpay (without order_id to avoid backend dependency in demo)
    const options: RazorpayPaymentOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Smart Bus Booking",
      description: `Bus Ticket Booking - ${bookingId}`,
      ...(createdOrderId ? { order_id: createdOrderId } : {}),
      prefill: {
        name: passengerName,
        email: passengerEmail,
        contact: passengerPhone,
      },
      notes: { bookingId },
      method: {
        card: true, // Enable debit/credit cards
        wallet: true, // Enable wallets
        upi: true, // Enable UPI
        netbanking: true, // Enable net banking
      },
      handler: (response: any) => {
        // Payment successful
        console.log("Payment Response:", response);

        // In test mode, Razorpay returns transaction ID in the response
        const paymentId = response.razorpay_payment_id || transactionId;
        const orderId = `order_${Date.now()}`;

        if (paymentId) {
          console.log("Payment successful! ID:", paymentId);
          onSuccess(paymentId, orderId);
        } else {
          console.warn("Payment response missing payment ID:", response);
          onFailure("Payment failed - incomplete response from gateway");
        }
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal dismissed by user");
          onFailure("Payment cancelled. Please try again.");
        },
      },
    };

    console.log("Opening Razorpay payment modal...", {
      amount: amount * 100,
      name: passengerName,
      email: passengerEmail,
    });

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error: any) {
    console.error("Payment Error:", error);
    onFailure(error.message || "Payment processing failed. Please try again.");
  }
};

// Store payment record
export const recordPayment = (
  paymentId: string,
  orderId: string,
  amount: number,
  bookingId: string,
  status: "success" | "failed",
) => {
  const payments = JSON.parse(localStorage.getItem("payments") || "[]");
  payments.push({
    id: paymentId,
    orderId,
    amount,
    bookingId,
    status,
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem("payments", JSON.stringify(payments));
};

// Get payment status
export const getPaymentStatus = (paymentId: string) => {
  const payments = JSON.parse(localStorage.getItem("payments") || "[]");
  return payments.find((p: any) => p.id === paymentId);
};
