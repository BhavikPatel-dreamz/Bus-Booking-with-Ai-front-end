import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, AlertCircle, Armchair, BedDouble, Loader2 } from "lucide-react";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import axios from "axios";
import AppDropdown from "../components/AppDropdown";
import { useToast } from "../components/toast/ToastContext";

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const { state } = useLocation();
  const date = location.state.date;
  const [seatData, setSeatData] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const { showToast } = useToast();

  const showErrorMsg = (msg) => {
    showToast({ type: "error", message: msg });
  };
  const showWarningMsg = (msg) => {
    showToast({ type: "warning", message: msg });
  };

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URI}/api/ticket/seat/get`,
          {
            tripId: state.bus.tripId,
            from: state.bus.from,
            to: state.bus.to,
            traveldate: date,
          },
          { withCredentials: true },
        );
        setSeatData(res.data.bookedseat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [state.busId]);
  useBeforeUnload(true);

  const busData = {
    id: state.bus.busId,
    operator: state.bus.busname,
    busNumber: state.bus.busnumber,
    type: state.bus.type, // 'Seating' or 'Sleeper'
    departure: state.bus.fromtime,
    arrival: state.bus.totime,
    date: date,
    price: state.bus.price,
    from: state.bus.from,
    to: state.bus.to,
    totalseats: state.bus.totalseats,
  };

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [errors, setErrors] = useState({});
  useEffect(() => {
    setPassengers((prev) => {
      const updated = [...prev];

      while (updated.length < selectedSeats.length) {
        updated.push({ name: "", age: "", gender: "" });
      }

      return updated.slice(0, selectedSeats.length);
    });
  }, [selectedSeats]);

  const MAX_SEATS = 5;
  const handleSeatClick = (seatNo) => {
    if (seatData.includes(seatNo)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatNo)) {
        return prev.filter((s) => s !== seatNo);
      }

      if (prev.length >= MAX_SEATS) {
        showWarningMsg("You can select a maximum of 5 seats only");
        return prev;
      }
      return [...prev, seatNo];
    });
  };

  const handlePassengerChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);

    const seat = selectedSeats[index];
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[`${seat}-${field}`];
      return newErrors;
    });
  };

  const validatePassengers = () => {
    const newErrors = {};

    if (selectedSeats.length === 0) {
      newErrors.general = "Please select at least one seat";
      setErrors(newErrors);
      return false;
    }

    selectedSeats.forEach((seat, index) => {
      const passenger = passengers[index];

      if (!passenger?.name?.trim()) {
        newErrors[`${seat}-name`] = "Name is required";
      }

      const age = Number(passenger?.age);

      if (!Number.isInteger(age) || age < 1 || age > 120) {
        newErrors[`${seat}-age`] = "Age must be a number between 1 and 120";
      }

      if (!passenger?.gender) {
        newErrors[`${seat}-gender`] = "Gender is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!role) {
      navigate("/login");
      return;
    }

    if (!validatePassengers()) return;

    const payload = {
      tripId: state.bus.tripId,
      from: state.bus.from,
      to: state.bus.to,
      price: state.bus.price * selectedSeats.length,
      seats: selectedSeats,
      passengers,
      ticketdate: date,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/ticket/`,
        payload,
        { withCredentials: true },
      );

      if (res.data.success === true) {
        const bookingData = {
          bus: busData,
          ticket: res.data.ticket,
          selectedSeats: [...selectedSeats].sort((a, b) => a - b),
          passengers: passengers.map((p, inx) => ({
            ...p,
            seatNumber: selectedSeats[inx],
          })),
          totalAmount: selectedSeats.length * busData.price,
        };
        setPassengers([]);
        setSelectedSeats([]);
        navigate("/payment", { state: { bookingData } });
      } else {
        showErrorMsg(res?.data?.message || "Registration failed");
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Server error. Please try again.";
      showErrorMsg(`${message}`);
    }
  };
  const getSeatStatus = (seatNo) => {
    if (seatData.includes(seatNo)) return "booked";
    if (selectedSeats.includes(seatNo)) return "selected";

    return "available";
  };

  const totalAmount = selectedSeats.length * busData.price;

  const renderSeatIcon = (seatNo, type) => {
    const status = getSeatStatus(seatNo);
    const isDisabled = status === "booked";
    const isSelected = status === "selected";

    const base =
      "relative flex flex-col items-center justify-center rounded-lg transition-all";

    const size =
      type === "sleeper"
        ? "w-14 h-8 sm:w-16 sm:h-10"
        : "w-10 h-10 sm:w-12 sm:h-12";

    const color =
      status === "booked"
        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
        : status === "hold"
          ? "bg-primary text-white cursor-not-allowed"
          : isSelected
            ? "bg-primary text-primary-foreground shadow-button"
            : "bg-card border-2 border-border hover:border-primary cursor-pointer";

    const Icon = type === "sleeper" ? BedDouble : Armchair;
    return (
      <button
        key={seatNo}
        disabled={isDisabled}
        onClick={() => handleSeatClick(seatNo)}
        className={`${base} ${size} ${color} `}
        title={`Seat ${seatNo} - ${status}`}
      >
        <>
          <Icon className="h-5 w-5" />
          <span className="text-[10px] font-medium">{seatNo}</span>
        </>
      </button>
    );
  };

  const renderSeatingLayout = () => {
    const seatsPerRow = 5;
    const totalRows = Math.ceil(busData.totalseats / seatsPerRow);

    return (
      <div className="space-y-2">
        {Array.from({ length: totalRows }, (_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-2 items-center justify-center"
          >
            {/* Left side - 2 seats */}
            {[0, 1].map((col) => {
              const seatNo = rowIndex * seatsPerRow + col + 1;
              if (seatNo > busData.totalseats)
                return <div key={col} className="w-10 h-10 sm:w-12 sm:h-12" />;
              return renderSeatIcon(seatNo, "seating");
            })}

            {/* Aisle */}
            <div className="w-6 sm:w-10 flex items-center justify-center">
              <div className="w-px h-8 bg-border"></div>
            </div>

            {/* Right side - 3 seats */}
            {[2, 3, 4].map((col) => {
              const seatNo = rowIndex * seatsPerRow + col + 1;
              if (seatNo > busData.totalseats)
                return <div key={col} className="w-10 h-10 sm:w-12 sm:h-12" />;
              return renderSeatIcon(seatNo, "seating");
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderSleeperLayout = () => {
    const seatsPerRow = 6;
    const totalRows = Math.ceil(busData.totalseats / seatsPerRow);

    return (
      <div className="space-y-6">
        {/* Upper Deck */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
            Upper Deck
          </p>
          <div className="space-y-2">
            {Array.from({ length: totalRows }, (_, rowIndex) => {
              const upperLeftStart = rowIndex * seatsPerRow;
              const upperSeats = [
                upperLeftStart + 1,
                upperLeftStart + 4,
                upperLeftStart + 5,
              ];

              return (
                <div
                  key={`upper-${rowIndex}`}
                  className="flex gap-2 items-center justify-center"
                >
                  {/* Left upper - 1 seat */}
                  {upperSeats[0] <= busData.totalseats ? (
                    renderSeatIcon(upperSeats[0], "sleeper")
                  ) : (
                    <div className="w-14 h-8 sm:w-16 sm:h-10" />
                  )}

                  {/* Aisle */}
                  <div className="w-6 sm:w-10 flex items-center justify-center">
                    <div className="w-px h-6 bg-border"></div>
                  </div>

                  {/* Right upper - 2 seats */}
                  {upperSeats
                    .slice(1)
                    .map((seatNo, idx) =>
                      seatNo <= busData.totalseats ? (
                        renderSeatIcon(seatNo, "sleeper")
                      ) : (
                        <div key={idx} className="w-14 h-8 sm:w-16 sm:h-10" />
                      ),
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Deck Separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted-foreground">Deck Separator</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Lower Deck */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
            Lower Deck
          </p>
          <div className="space-y-2">
            {Array.from({ length: totalRows }, (_, rowIndex) => {
              const lowerLeftStart = rowIndex * seatsPerRow;
              const lowerSeats = [
                lowerLeftStart + 2,
                lowerLeftStart + 3,
                lowerLeftStart + 6,
              ];

              return (
                <div
                  key={`lower-${rowIndex}`}
                  className="flex gap-2 items-center justify-center"
                >
                  {/* Left lower - 1 seat */}
                  {lowerSeats[0] <= busData.totalseats ? (
                    renderSeatIcon(lowerSeats[0], "sleeper")
                  ) : (
                    <div className="w-14 h-8 sm:w-16 sm:h-10" />
                  )}

                  {/* Aisle */}
                  <div className="w-6 sm:w-10 flex items-center justify-center">
                    <div className="w-px h-6 bg-border"></div>
                  </div>

                  {/* Right lower - 2 seats */}
                  {lowerSeats
                    .slice(1)
                    .map((seatNo, idx) =>
                      seatNo <= busData.totalseats ? (
                        renderSeatIcon(seatNo, "sleeper")
                      ) : (
                        <div key={idx} className="w-14 h-8 sm:w-16 sm:h-10" />
                      ),
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (loadingSeats) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading seats...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-2">Select Seats</h1>
      <p className="text-muted-foreground mb-6">
        {busData.operator} • {busData.from} → {busData.to} • {date}
      </p>

      {errors.general && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{errors.general}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Seat Layout Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl shadow-card p-6">
            {/* Bus Type Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {busData.type === "sleeper" ? (
                  <BedDouble className="h-4 w-4" />
                ) : (
                  <Armchair className="h-4 w-4" />
                )}
                {busData.type} Bus
              </span>
              <span className="text-sm text-muted-foreground">
                {busData.totalseats} seats
              </span>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-card border-2 border-border flex items-center justify-center">
                  {busData.type === "sleeper" ? (
                    <BedDouble className="h-3 w-3" />
                  ) : (
                    <Armchair className="h-3 w-3" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary text-primary-foreground flex items-center justify-center">
                  {busData.type === "sleeper" ? (
                    <BedDouble className="h-3 w-3" />
                  ) : (
                    <Armchair className="h-3 w-3" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-muted opacity-50 flex items-center justify-center">
                  {busData.type === "sleeper" ? (
                    <BedDouble className="h-3 w-3" />
                  ) : (
                    <Armchair className="h-3 w-3" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">Booked</span>
              </div>
            </div>

            {/* Driver Section */}
            <div className="flex justify-end mb-4 pr-2">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">🚌</span>
              </div>
            </div>

            {/* Seat Layout */}
            <div className="flex justify-center overflow-x-auto pb-4">
              <div className="inline-block min-w-max">
                {busData.type === "sleeper"
                  ? renderSleeperLayout()
                  : renderSeatingLayout()}
              </div>
            </div>
          </div>

          {/* Passenger Details */}
          {selectedSeats.length > 0 && (
            <div className="bg-card rounded-xl shadow-card p-6 mt-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Passenger Details
              </h2>

              <div className="space-y-6">
                {selectedSeats
                  .sort((a, b) => a - b)
                  .map((seat, index) => (
                    <div key={seat} className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm font-medium text-primary mb-3">
                        Seat {seat}
                      </p>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={passengers[index]?.name || ""}
                            onChange={(e) =>
                              handlePassengerChange(
                                index,
                                "name",
                                e.target.value,
                              )
                            }
                            className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              errors[`${seat}-name`]
                                ? "border-destructive"
                                : "border-border"
                            }`}
                            placeholder="Full Name"
                          />
                          {errors[`${seat}-name`] && (
                            <p className="text-xs text-destructive mt-1">
                              {errors[`${seat}-name`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">
                            Age
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="120"
                            onKeyDown={(e) => {
                              if (
                                e.key === "-" ||
                                e.key === "." ||
                                e.key === "e"
                              ) {
                                e.preventDefault();
                              }
                            }}
                            value={passengers[index]?.age || ""}
                            onChange={(e) =>
                              handlePassengerChange(
                                index,
                                "age",
                                e.target.value,
                              )
                            }
                            className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                              errors[`${seat}-age`]
                                ? "border-destructive"
                                : "border-border"
                            }`}
                            placeholder="Age"
                          />
                          {errors[`${seat}-age`] && (
                            <p className="text-xs text-destructive mt-1">
                              {errors[`${seat}-age`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-1">
                            Gender
                          </label>
                          <AppDropdown
                            options={[
                              { value: "male", label: "Male" },
                              { value: "female", label: "Female" },
                              { value: "other", label: "Other" },
                            ]}
                            value={passengers[index]?.gender || ""}
                            onChange={(val) =>
                              handlePassengerChange(index, "gender", val)
                            }
                            placeholder="Select"
                            hasError={!!errors[`${seat}-gender`]}
                            size="sm"
                          />

                          {errors[`${seat}-gender`] && (
                            <p className="text-xs text-destructive mt-1">
                              {errors[`${seat}-gender`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Booking Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bus</span>
                <span className="text-foreground font-medium">
                  {busData.busNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground">{busData.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Route</span>
                <span className="text-foreground">
                  {busData.from} → {busData.to}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{date}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="text-foreground">
                  {busData.departure} - {busData.arrival}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Selected Seats</span>
                <span className="text-foreground font-medium">
                  {selectedSeats.length > 0
                    ? [...selectedSeats].sort((a, b) => a - b).join(", ")
                    : "None"}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Price per seat</span>
                <span className="text-foreground">₹{busData.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seats</span>
                <span className="text-foreground">{selectedSeats.length}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-foreground font-semibold">
                  Total Amount
                </span>
                <span className="text-xl font-bold text-primary">
                  ₹{totalAmount}
                </span>
              </div>
            </div>

            <button
              onClick={handleProceedToPayment}
              disabled={selectedSeats.length === 0}
              className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-3 rounded-xl font-semibold transition-colors shadow-button flex items-center justify-center gap-2"
            >
              Proceed to Payment
            </button>

            {!role && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                You'll need to login to complete the booking
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
