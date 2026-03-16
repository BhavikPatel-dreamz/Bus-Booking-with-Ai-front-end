import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  ArrowRight,
  Bus,
  Shield,
  Clock,
  Headphones,
} from "lucide-react";
import axios from "axios";
import CityAutocomplete from "../components/CityAutocomplete";

import StyledDatePicker from "../components/StyledDatePicker";

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    travelDate: "",
  });
  const [errors, setErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [popularCities, setpopularCities] = useState([]);

  useEffect(() => {
    fetchTIcket();
  }, []);

  const fetchTIcket = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/admin/route/stops`,
        { withCredentials: true },
      );
      if (response.data.success === true) {
        setpopularCities(response.data.allstops);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.source.trim()) {
      newErrors.source = "Please enter a source city";
    }
    if (!formData.destination.trim()) {
      newErrors.destination = "Please enter a destination city";
    }
    if (!formData.travelDate) {
      newErrors.travelDate = "Please select a travel date";
    }
    if (
      formData.source.trim() &&
      formData.destination.trim() &&
      formData.source.trim().toLowerCase() ===
        formData.destination.trim().toLowerCase()
    ) {
      newErrors.destination = "Destination must be different from source";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSearching(true);

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSearching(false);

    const searchParams = new URLSearchParams({
      source: formData.source,
      destination: formData.destination,
      date: formData.travelDate,
    });
    navigate(`/buses?${searchParams.toString()}`);
  };
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#f9fafb] from-primary  py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-black mb-4">
              Book Your Bus Journey
            </h1>
            <p className="text-lg md:text-xl text-black max-w-2xl mx-auto">
              Travel comfortably with thousands of routes across the country.
              Fast, reliable, and affordable.
            </p>
          </div>

          {/* Search Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-search p-6 md:p-8">
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Source */}
                  <div className="space-y-2">
                    <label
                      htmlFor="source"
                      className="block text-sm font-medium text-gray-800"
                    >
                      From
                    </label>
                    <CityAutocomplete
                      id="source"
                      name="source"
                      value={formData.source}
                      onChange={handleInputChange}
                      placeholder="Enter source city"
                      cities={popularCities}
                      hasError={!!errors.source}
                    />
                    {errors.source && (
                      <p className="text-sm text-red-500">{errors.source}</p>
                    )}
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <label
                      htmlFor="destination"
                      className="block text-sm font-medium text-gray-800"
                    >
                      To
                    </label>
                    <CityAutocomplete
                      id="destination"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      placeholder="Enter destination city"
                      cities={popularCities}
                      hasError={!!errors.destination}
                    />
                    {errors.destination && (
                      <p className="text-sm text-red-500">
                        {errors.destination}
                      </p>
                    )}
                  </div>

                  {/* Travel Date */}
                  <div className="space-y-2">
                    <label
                      htmlFor="travelDate"
                      className="block text-sm font-medium text-gray-800"
                    >
                      Travel Date
                    </label>
                    <StyledDatePicker
                      id="modify-date"
                      name="travelDate"
                      value={formData.travelDate}
                      onChange={handleInputChange}
                      placeholder="Select date"
                      hasError={!!errors.travelDate}
                    />
                    {errors.travelDate && (
                      <p className="text-sm text-red-500">
                        {errors.travelDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-accent orange-button-properties text-white px-8 py-3.5 rounded-xl font-semibold text-lg shadow-button transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <div className="h-5 w-5 border-2  border-white/30 border-t-white rounded-full animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        Search Buses
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose QuickBus?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bus className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Wide Network
              </h3>
              <p className="text-gray-500 text-sm">
                Access thousands of routes connecting major cities nationwide.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Safe & Secure
              </h3>
              <p className="text-gray-500 text-sm">
                Verified operators and secure payment options for peace of mind.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                Instant Booking
              </h3>
              <p className="text-gray-500 text-sm">
                Book your tickets in minutes with instant confirmation.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                24/7 Support
              </h3>
              <p className="text-gray-500 text-sm">
                Round-the-clock customer support for all your travel needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
