import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Bus,
  Clock,
  MapPin,
  Star,
  Users,
  Wifi,
  Wind,
  Zap,
  Calendar,
  Search,
  X,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "../components/toast/ToastContext";
import axios from "axios";
import CityAutocomplete from "../components/CityAutocomplete";
import StyledDatePicker from "../components/StyledDatePicker";
import { BusResultsSkeleton } from "../components/skeletons";
import { waitForLoader } from "../helpers/loaderDelay";

const BusList = () => {
  const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // hardcoded for now (later replace with backend field)
  const formatOperatingDays = (days) => {
    if (!days || days.length === 0) return "Not specified";
    if (days.length === 7) return "Daily";
    return days
      .sort((a, b) => a - b)
      .map((d) => DAYS_SHORT[d])
      .join(", ");
  };

  const { showToast } = useToast();

  const showErrorMsg = (msg) => {
    showToast({ type: "error", message: msg });
  };

  const capitalizeFirstLetter = (string) => {
    // Return the first character in uppercase, concatenated with the rest of the string
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [bus, setbus] = useState([]);
  const [popularCities, setpopularCities] = useState([]);

  const source = searchParams.get("source") || "";
  const destination = searchParams.get("destination") || "";
  const date = searchParams.get("date") || "";

  const [showModifySearch, setShowModifySearch] = useState(false);
  const [modifyForm, setModifyForm] = useState({
    source: source,
    destination: destination,
    travelDate: date,
  });
  const [modifyErrors, setModifyErrors] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
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

  useEffect(() => {
    if (!source || !destination || !date) return;
    getBus();
  }, [source, destination, date]);

  const getBus = async () => {
    try {
      setIsLoading(true); // starting loader

      // fake delay for testing the implementattion
      await waitForLoader();

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/user/search`,
        { from: source, to: destination, traveldate: date },
      );
      setbus(res.data.buses);
    } catch (err) {
      setbus([]);
      showErrorMsg(err.response?.data?.message || "Failed to fetch bus data");
    } finally {
      setIsLoading(false); //stopping loader
    }
  };

  const handleSeatNavigation = (busId, bus) => {
    if (role == "user") {
      navigate(`/seat-selection/`, {
        state: { busId, source, destination, date, bus },
      });
    } else {
      navigate("/login", { state: { busId, source, destination, date, bus } });
    }
  };

  const handleModifyInputChange = (e) => {
    const { name, value } = e.target;
    setModifyForm((prev) => ({ ...prev, [name]: value }));
    if (modifyErrors[name]) {
      setModifyErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateModifyForm = () => {
    const newErrors = {};
    if (!modifyForm.source.trim()) {
      newErrors.source = "Please enter a source city";
    }
    if (!modifyForm.destination.trim()) {
      newErrors.destination = "Please enter a destination city";
    }
    if (!modifyForm.travelDate) {
      newErrors.travelDate = "Please select a travel date";
    }
    if (
      modifyForm.source.trim() &&
      modifyForm.destination.trim() &&
      modifyForm.source.trim().toLowerCase() ===
        modifyForm.destination.trim().toLowerCase()
    ) {
      newErrors.destination = "Destination must be different from source";
    }
    setModifyErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModifySearch = async (e) => {
    e.preventDefault();
    if (!validateModifyForm()) return;

    setIsSearching(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSearching(false);

    const newParams = new URLSearchParams({
      source: modifyForm.source,
      destination: modifyForm.destination,
      date: modifyForm.travelDate,
    });
    setSearchParams(newParams);
    setShowModifySearch(false);
  };

  const handleCancelModify = () => {
    setModifyForm({
      source: source,
      destination: destination,
      travelDate: date,
    });
    setModifyErrors({});
    setShowModifySearch(false);
  };

  const openModifySearch = () => {
    setModifyForm({
      source: source,
      destination: destination,
      travelDate: date,
    });
    setModifyErrors({});
    setShowModifySearch(true);
  };

  if (!source || !destination || !date) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Bus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            No Search Parameters
          </h2>
          <p className="text-muted-foreground mb-6">
            Please search for buses from the home page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      wifi: <Wifi className="h-4 w-4" />,
      ac: <Wind className="h-4 w-4" />,
      charging: <Zap className="h-4 w-4" />,
    };

    // Convert to lowercase to match keys and return icon or a default
    return iconMap[amenity.toLowerCase()] || <Zap className="h-4 w-4" />;
  };

  return (
    <div className="bg-secondary/30 min-h-screen bg-[#f7f8f9]">
      {/* Search Summary */}
      <div className="bg-[#1b4498] py-6 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{source}</span>
            </div>
            <span className="text-primary-foreground/60">→</span>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{destination}</span>
            </div>
            <span className="text-primary-foreground/60">|</span>
            <span>
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Modify Search Form */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          showModifySearch
            ? "max-h-[500px] opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl shadow-search p-6">
              <form onSubmit={handleModifySearch}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Source */}
                  <div className="space-y-2">
                    <label
                      htmlFor="modify-source"
                      className="block text-sm font-medium text-foreground"
                    >
                      From
                    </label>
                    <CityAutocomplete
                      id="modify-source"
                      name="source"
                      value={modifyForm.source}
                      onChange={handleModifyInputChange}
                      placeholder="Enter source city"
                      cities={popularCities}
                      hasError={!!modifyErrors.source}
                    />
                    {modifyErrors.source && (
                      <p className="text-sm text-destructive">
                        {modifyErrors.source}
                      </p>
                    )}
                  </div>

                  {/* Destination */}
                  <div className="space-y-2">
                    <label
                      htmlFor="modify-destination"
                      className="block text-sm font-medium text-foreground"
                    >
                      To
                    </label>
                    <CityAutocomplete
                      id="modify-destination"
                      name="destination"
                      value={modifyForm.destination}
                      onChange={handleModifyInputChange}
                      placeholder="Enter destination city"
                      cities={popularCities}
                      hasError={!!modifyErrors.destination}
                    />
                    {modifyErrors.destination && (
                      <p className="text-sm text-destructive">
                        {modifyErrors.destination}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label
                      htmlFor="modify-date"
                      className="block text-sm font-medium text-foreground"
                    >
                      Travel Date
                    </label>
                    <StyledDatePicker
                      id="modify-date"
                      name="travelDate"
                      value={modifyForm.travelDate}
                      onChange={handleModifyInputChange}
                      placeholder="Select date"
                      hasError={!!modifyErrors.travelDate}
                    />
                    {modifyErrors.travelDate && (
                      <p className="text-sm text-destructive">
                        {modifyErrors.travelDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleCancelModify}
                    className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground px-6 py-3 rounded-xl font-medium transition-all"
                  >
                    <X className="h-5 w-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="inline-flex items-center justify-center gap-2 bg-accent orange-button-properties text-white px-8 py-3 rounded-xl font-semibold shadow-button transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <>
                        <div className="h-5 w-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
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
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">
            {isLoading ? "Searching buses..." : `${bus.length} Buses Found`}
          </h1>
          {!showModifySearch && (
            <button
              onClick={openModifySearch}
              className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
            >
              Modify Search
            </button>
          )}
        </div>

        {/* Bus Cards */}
        {isLoading ? (
          <BusResultsSkeleton count={5} />
        ) : (
          <div className="space-y-4">
            {bus.map((bus) => {
              return (
                <div
                  key={bus.busId}
                  className="bg-card rounded-xl shadow-card overflow-hidden bg-[#ffffff]"
                >
                  <div className="p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Operator Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between lg:justify-start gap-4">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {bus.busname}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {capitalizeFirstLetter(bus.type)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 bg-[#dcfce7] text-green-700 px-2 py-1 rounded-md text-sm font-medium">
                            <Star className="h-4 w-4 fill-current" />4
                          </div>
                        </div>
                      </div>

                      {/* Time Info */}
                      <div className="flex items-center gap-6 lg:gap-8">
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">
                            {bus.fromtime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {capitalizeFirstLetter(source)}
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 text-muted-foreground text-xs">
                            <Clock className="h-3 w-3" />
                            {bus.totaltime.hour}h {bus.totaltime.minute}m
                          </div>
                          <div className="w-20 mt-1.5 h-px bg-border relative bg-black">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full bg-blue-600" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-foreground">
                            {bus.totime}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {capitalizeFirstLetter(destination)}
                          </p>
                        </div>
                      </div>

                      {/* Price & Book */}
                      <div className="flex items-center justify-between lg:flex-col lg:items-end gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">
                            ₹{bus.price}
                          </p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {bus.availableseat} seats left
                          </div>
                        </div>
                        <button
                          onClick={() => handleSeatNavigation(bus.busId, bus)}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2.5 bg-[#f59f0a] text-white rounded-lg font-semibold transition-colors shadow-sm"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            Operating Days:
                          </span>
                          <span className="text-xs font-medium text-foreground">
                            {formatOperatingDays(bus.days)}
                          </span>
                        </div>
                        {bus.amenties && bus.amenties.length > 0 && (
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              Amenities:
                            </span>
                            <div className="flex items-center gap-3">
                              {bus.amenties.map((amenity) => (
                                <div
                                  key={amenity}
                                  className="flex items-center gap-1 text-muted-foreground text-xs capitalize"
                                >
                                  {getAmenityIcon(amenity)}
                                  {amenity}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {!isLoading && bus.length === 0 && (
        <div className="text-center py-12  rounded-xl border border-slate-100">
          <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            <span className="font-semibold text-slate-700">
              No buses available for this route on your selected date.
            </span>
            <br />
            Try changing the travel date or explore nearby routes we’ll help you
            find the best option!
          </p>
        </div>
      )}
    </div>
  );
};

export default BusList;
