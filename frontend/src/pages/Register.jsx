import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import { useToast } from "../components/toast/ToastContext";

const Register = () => {
  const navigate = useNavigate();

  const { loading, setLoading } = useContext(UserContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { showToast } = useToast();
  
      const showSuccessMsg = (msg) => {
        showToast({ type: "success", message: msg });
      };
  
      const showErrorMsg = (msg) => {
        showToast({ type: "error", message: msg });
      };

  useBeforeUnload(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
        `${import.meta.env.VITE_BASE_URI}/api/user/register`,
        formData,
        { withCredentials: true }
      );

      if (res.data.success === true) {
        showSuccessMsg("Registration successful 🎉")
        navigate("/login");
      } else {
        showErrorMsg(res?.data?.message || "Registration failed")
      }
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Server error. Please try again.";
      showErrorMsg(message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-auth p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-gray-500 text-center mb-6">
          Join QuickBus and start booking
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.name ? "border-red-500" : "border-gray-200"
                } bg-gray-50 focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.email ? "border-red-500" : "border-gray-200"
                } bg-gray-50 focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* PHONE */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="1234567890"
                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                  errors.phone ? "border-red-500" : "border-gray-200"
                } bg-gray-50 focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } bg-gray-50`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-800">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="******"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border ${
                  errors.password ? "border-red-500" : "border-gray-200"
                } bg-gray-50`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full blue-button-properties text-white py-3 rounded-xl font-semibold disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#1B4498] font-medium hover:text-[#3157A2]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
