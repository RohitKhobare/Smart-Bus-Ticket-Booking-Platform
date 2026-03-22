import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SUPABASE_CONFIGURED } from "../lib/supabase";
import Button from "../components/Button";
import Input from "../components/Input";

export default function Login() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // Get the location to redirect back to after login
  const fromLocation = (location.state as any)?.from || "/";

  // redirect authenticated users to home, but do it in an effect to avoid
  // calling navigate during render (which can cause infinite loops / white
  // screen).
  useEffect(() => {
    if (user) {
      navigate(fromLocation, { state: { ...(location.state || {}) } });
    }
  }, [user, navigate, fromLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          setMessage("Passwords do not match.");
          return;
        }
        const result: any = await signUp(email, password);
        if (result.error && result.error.message) {
          // Show rate limit message if applicable
          if (
            result.error.message.includes("rate limit") ||
            result.error.message.includes("local")
          ) {
            setMessage(
              result.error.message ||
                "Registration successful! You are now logged in.",
            );
          } else {
            throw result.error;
          }
        }
        // registration completed, redirect back to where they came from
        const successMsg =
          SUPABASE_CONFIGURED && !result.error?.message?.includes("local")
            ? "Registration successful! Check your email to confirm your account."
            : "Registration successful! You are now logged in.";
        setTimeout(() => {
          navigate(fromLocation, {
            state: { message: successMsg, ...(location.state || {}) },
          });
        }, 500);
        return; // avoid further state updates
      } else {
        const result: any = await signIn(email, password);
        if (result.error && result.error.message) {
          throw result.error;
        }
        navigate(fromLocation, { state: { ...(location.state || {}) } });
      }
    } catch (err: any) {
      setMessage(err.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">
          {isRegister ? "Register" : "Login"}
        </h2>
        {message && <p className="mb-4 text-sm text-red-600">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {isRegister && (
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <Button type="submit" className="w-full">
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            className="text-[#FF6B00] hover:underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setConfirmPassword("");
            }}
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
