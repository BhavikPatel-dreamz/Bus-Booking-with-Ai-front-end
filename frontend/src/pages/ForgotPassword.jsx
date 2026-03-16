import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import axios from "axios";
import { useToast } from "../components/toast/ToastContext";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const role = localStorage.getItem("role");

    const { showToast } = useToast();
  
      const showSuccessMsg = (msg) => {
        showToast({ type: "success", message: msg });
      };
  
      const showErrorMsg = (msg) => {
        showToast({ type: "error", message: msg });
      }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) return setError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email))
      return setError("Please enter a valid email");
    if (!password.trim()) return setError("Password is required");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    setLoading(true);
    setError("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URI}/api/forgetPassword`,
        { email, password },
        { withCredentials: true },
      );

      if (res.data.success) {
        showSuccessMsg("Password updated successfully")
        setSubmitted(true);
      } else {
       showErrorMsg("Something went wrong");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Server error, try again later"
      showErrorMsg(`${errorMessage}`)
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-auth p-8 text-center border border-blue-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Now Login</h1>
          <p className="text-slate-500 mb-6">
            Password Update SuceesFully <strong>{email}</strong>
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-auth p-8 border border-blue-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Forgot Password?
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-800"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  error ? "border-red-500" : "border-blue-200"
                } bg-sky-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-800"
            >
              Password
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setpassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter New Password"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  error ? "border-red-500" : "border-blue-200"
                } bg-sky-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-800"
            >
              ConfirmPassword
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="password"
                id="confirmpassword"
                value={confirmPassword}
                onChange={(e) => {
                  setconfirmPassword(e.target.value);
                  setError("");
                }}
                placeholder="Enter Confirm Password"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  error ? "border-red-500" : "border-blue-200"
                } bg-sky-50 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full blue-button-properties text-white py-3 rounded-xl font-semibold shadow-button transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            Update Password
          </button>
        </form>

        <div className="mt-6 text-center">
          {role ? (
            <Link
              to="/update-profile"
              className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Update Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
