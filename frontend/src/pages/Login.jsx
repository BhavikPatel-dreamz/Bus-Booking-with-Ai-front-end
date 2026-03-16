import { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useToast } from "../components/toast/ToastContext";


const Login = () => {
  const navigate = useNavigate();

  const { setUser, setRole, loading, setLoading } = useContext(UserContext);
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

     const { showToast } = useToast();
  
      const showSuccessMsg = (msg) => {
        showToast({ type: "success", message: msg });
      };
  
      const showErrorMsg = (msg) => {
        showToast({ type: "error", message: msg });
      };
  

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true },
      );

      if (res.data.success === true) {
        setUser(res.data.user);
        setRole(res.data.user.role || "user");
        if (res.data.user.role === "admin") {
          localStorage.setItem("admin", JSON.stringify(res.data.user));
          localStorage.setItem("token",JSON.stringify(res.data.token))
          localStorage.setItem("role", "admin");
          navigate("/admin");
        } else if (location.state?.date) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token",JSON.stringify(res.data.token))
          localStorage.setItem("role", "user");
          navigate("/seat-selection", { state: location.state });
        } else{
          localStorage.setItem("user", JSON.stringify(res.data.user))
          localStorage.setItem("token",JSON.stringify(res.data.token))
          localStorage.setItem("role", "user");
          navigate("/");
          showSuccessMsg("Login successful 🎉")
        }
      } else {
        showErrorMsg("Invalid email or password")
      }
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      showErrorMsg(`${backendMessage}`)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-auth p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500">Sign in to your QuickBus account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } bg-gray-50 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-primary hover:text-blue-700"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full blue-button-properties text-white py-3 rounded-xl font-semibold disabled:opacity-70"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#1B4498] font-medium hover:text-[#3157A2] transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
