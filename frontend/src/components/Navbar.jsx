import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  Bus,
  Menu,
  X,
  User,
  ChevronDown,
  LayoutDashboard,
  Ticket,
  Phone,
} from "lucide-react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { AuthAdminContext } from "../context/AuthAdminContext";

const Navbar = ({ onAdminMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { user, setUser, setRole } = useContext(UserContext);
  const { admin, setAdmin } = useContext(AuthAdminContext);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();
const isAdminRoute = location.pathname.startsWith("/admin");


  const handleLogout = async () => {
    await axios
      .post(
        `${import.meta.env.VITE_BASE_URI}/api/logout`,
        {},
        { withCredentials: true }
      )
      .finally(()=>{
        setUser(null);
        setRole(null);
        setAdmin(null);
        localStorage.clear();
        localStorage.clear();
        localStorage.clear()
        localStorage.clear()
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
        navigate("/");
      })
  };
  const userInitial = admin?.name
    ? admin.name.charAt(0).toUpperCase()
    : user?.name
      ? user.name.charAt(0).toUpperCase()
      : "U";


  return (
    <nav className="bg-[#1b4498] shadow-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side: Admin hamburger + Logo */}
<div className="flex items-center gap-2">

  {/* Admin Hamburger Menu - Only on admin routes and mobile/tablet */}
  {isAdminRoute && role === "admin" && (
    <button
                onClick={onAdminMenuClick}
                className="lg:hidden p-2 rounded-lg text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
                aria-label="Open admin menu"
              >
                <Menu className="h-6 w-6" />
              </button>
  )}

  {/* Logo */}
  {role === "admin" ? (
    <div className="flex items-center gap-2 cursor-default">
      <Bus className="h-8 w-8 text-white" />
      <span className="text-xl font-bold tracking-tight text-white select-none">
        QuickBus
      </span>
    </div>
  ) : (
    <Link to="/" className="flex items-center gap-2">
      <Bus className="h-8 w-8 text-white" />
      <span className="text-xl font-bold tracking-tight text-white select-none">
        QuickBus
      </span>
    </Link>
  )}

</div>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {role !== "admin" && (
              <Link
                to="/contact"
                className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Contact Us
              </Link>
            )}
            {role ? (
              <>
                {role === "admin" ? (
                  <Link
                    to="/admin"
                    className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-bookings"
                    className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium flex items-center gap-2"
                  >
                    <Ticket className="h-4 w-4" />
                    My Bookings
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 text-primary-foreground/90 hover:text-primary-foreground transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                      <span className="text-blue-800 font-bold text-lg select-none">
                        {userInitial}
                      </span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${profileDropdownOpen ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-dropdown py-2 border border-border">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block px-4 py-2 text-foreground hover:bg-muted transition-colors"
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-foreground hover:bg-muted transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-sm orange-button-properties"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  className="md:hidden text-white p-2"
>
  {role ? (
    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
      <span className="text-blue-800 font-bold text-lg select-none">
        {userInitial}
      </span>
    </div>
  ) : (
    mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />
  )}
</button>

        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-200">
            {role !== "admin" && (
              <Link
                to="/contact"
                className="text-primary-foreground/90 hover:text-primary-foreground transition-colors font-medium flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Contact Us
              </Link>
            )}
            {role ? (
              <div className="space-y-3">
                {role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-slate-300 hover:text-white py-2"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-bookings"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-slate-300 hover:text-white py-2"
                  >
                    My Bookings
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-slate-300 hover:text-white py-2"
                >
                  My Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-slate-300 hover:text-white py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold text-center"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
