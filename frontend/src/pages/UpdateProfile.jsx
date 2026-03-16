import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Save, X, KeyRound } from "lucide-react";
import { AuthAdminContext } from "../context/AuthAdminContext";
import axios from "axios";
import { useToast } from "../components/toast/ToastContext";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const storedAdmin = localStorage.getItem("admin");
  const storedUser = localStorage.getItem("user");
  const { showToast } = useToast();

  const showSuccessMsg = (msg) => {
    showToast({ type: "success", message: msg });
  };

  const showErrorMsg = (msg) => {
    showToast({ type: "error", message: msg });
  };

  const profileData = storedAdmin
    ? { role: "admin", data: JSON.parse(storedAdmin) }
    : storedUser
      ? { role: "user", data: JSON.parse(storedUser) }
      : null;

  const { admin } = useContext(AuthAdminContext);

  const initialProfile = {
    name: profileData?.data?.name || "",
    email: profileData?.data?.email || "",
    phone: profileData?.data?.phone || "",
  };

  const [formData, setFormData] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialProfile);
  }, [admin]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCancel = () => {
    setFormData(initialProfile);
    setErrors({});
    navigate(-1);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URI}/api/user/`,
        formData,
        { withCredentials: true },
      );

      if (res.data.success === true) {
        const updatedProfile = {
          ...profileData.data,
          ...formData,
        };
        localStorage.setItem(
          profileData.role,
          JSON.stringify(updatedProfile),
        );
        setIsSaving(false);
        showSuccessMsg("Profile Update Successfully");
        if (profileData.role == "admin") {
          navigate("/profile");
        } else {
          navigate("/profile");
        }
      } else {
        showErrorMsg(`${res.data.message}`);
      }
    } catch (error) {
      const errorMessage =
        error.response.data.message || "Shomething went Wrong";
      showErrorMsg(`${errorMessage}`);
    }
  };

  const getInitial = () => {
    return formData.name?.charAt(0)?.toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Success Message */}
        <div className="bg-card rounded-xl shadow-card overflow-hidden">
          {/* Header with Avatar */}
          <div className="bg-gradient-hero p-6 text-center">
            <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl font-bold text-primary-foreground">
                {getInitial()}
              </span>
            </div>
            <h1 className="text-xl font-bold text-primary-foreground">
              Update Profile
            </h1>
            <p className="text-white text-sm mt-1">
              Edit your personal information
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  errors.name ? "border-destructive" : "border-border"
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  errors.phone ? "border-destructive" : "border-border"
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-destructive text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Change Password Link */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
