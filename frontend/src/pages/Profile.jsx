import { User, Mail, Phone, Calendar, Edit2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate()
  const userData = localStorage.getItem("user");
  const adminData = localStorage.getItem("admin");

  // Decide who is logged in
  const profile = userData
    ? JSON.parse(userData)
    : adminData
    ? JSON.parse(adminData)
    : null;

  const role = userData ? "User" : adminData ? "Admin" : "Guest";
 
  if (!Profile) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground text-sm">Loading Profile...</p>
    </div>
  );
}
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#1B4498] p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {profile?.name || "Guest User"}
                </h2>
                <p className="text-white/80">{role} Account</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Personal Information
              </h3>
              <button onClick={()=>{navigate("/update-profile")}} className="text-primary hover:text-[#3157A2] transition-colors flex items-center gap-1 text-sm font-medium">
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-500 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <p className="text-gray-800 font-medium">
                  {profile?.name || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <p className="text-gray-800 font-medium">
                  {profile?.email || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </label>
                <p className="text-gray-800 font-medium">
                  {profile?.phone || "Not provided"}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <p className="text-gray-800 font-medium">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toDateString()
                    : "January 2025"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
