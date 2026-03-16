import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../components/toast/ToastContext";
import {
  ArrowLeft,
  Bus,
  MapPin,
  Calendar,
  Clock,
  User,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
   const { showToast } = useToast();
  
      const showSuccessMsg = (msg) => {
        showToast({ type: "success", message: msg });
      };
  
      const showErrorMsg = (msg) => {
        showToast({ type: "error", message: msg });
      };

  useBeforeUnload(true);

  const bookingData = location.state?.bookingData || {
    bus: {
      busNumber: "QB-1234",
      type: "Seating",
      from: "Mumbai",
      to: "Pune",
      departure: "06:00 AM",
      arrival: "10:00 AM",
      date: new Date().toLocaleDateString(),
      price: 450,
    },
    selectedSeats: [1, 2],
    passengers: [
      { name: "John Doe", age: 28, gender: "Male", seatNumber: 1 },
      { name: "Jane Doe", age: 26, gender: "Female", seatNumber: 2 },
    ],
    totalAmount: 900,
  };

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null); // 'success' | 'failure' | null
  const [updatedTicket, setupdatedTicket] = useState([]);
  const expiryTimerRef = useRef(null);
  const isPaymentCompletedRef = useRef(false);

  const baseFare = bookingData.totalAmount;
  const taxes = Math.round(baseFare * 0.05);
  const convenienceFee = 25;
  const totalPayable = baseFare + taxes + convenienceFee;

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      icon: Smartphone,
      description: "Google Pay, PhonePe, Paytm",
    },
    {
      id: "debit",
      name: "Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, RuPay",
    },
    {
      id: "credit",
      name: "Credit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, Amex",
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: Building2,
      description: "All major banks supported",
    },
  ];

  const handlePaymentClick = () => {
    if (!selectedPaymentMethod) return;
    setShowConfirmModal(true);
  };

  useEffect(() => {
    if (!bookingData?.ticket?._id) return;

    expiryTimerRef.current = setTimeout(
      async () => {
        if (isPaymentCompletedRef.current) return;

        try {
          await axios.delete(
            `${import.meta.env.VITE_BASE_URI}/api/ticket/delete/${bookingData.ticket._id}`,
            { withCredentials: true },
          );
          showSuccessMsg("Payment time expired. Ticket cancelled.")

          navigate("/", { replace: true });
        } catch (error) {
          const errorMessage = error.response.data.message || "Auto delete failed"
          showErrorMsg(`${errorMessage}`)
        }
      },
      2 * 60 * 1000,
    ); // 2 minutes

    return () => clearTimeout(expiryTimerRef.current);
  }, []);

  const handleConfirmPayment = async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URI}/api/ticket/update/payment/${bookingData.ticket._id}`,
        { price: totalPayable },
        { withCredentials: true },
      );
      if (res.data.success === true) {
        isPaymentCompletedRef.current = true;
        clearTimeout(expiryTimerRef.current);

        setupdatedTicket(res.data.updatedTicket);
        setPaymentResult("success");
      } else {
        setPaymentResult("failure");
      }
    } catch (error) {
      const errorMessage = error.response.data.message || "Payment failed"
      showErrorMsg(`${errorMessage}`)
      setPaymentResult("failure");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessRedirect = () => {
    navigate("/booking-confirmation", {
      state: { booking: bookingData.ticket._id },
    });
  };

  const handleRetryPayment = () => {
    setPaymentResult(null);
    setSelectedPaymentMethod("");
  };

  const handleBackToSeats = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={handleBackToSeats}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Seat Selection</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Complete Payment
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Section - Trip & Passenger Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Summary */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bus className="h-5 w-5 text-primary" />
                Trip Summary
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Bus className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Bus Number
                      </p>
                      <p className="font-medium text-foreground">
                        {bookingData.bus.busNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Wallet className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bus Type</p>
                      <p className="font-medium text-foreground">
                        {bookingData.bus.type}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Route</p>
                      <p className="font-medium text-foreground">
                        {bookingData.bus.from} → {bookingData.bus.to}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Travel Date
                      </p>
                      <p className="font-medium text-foreground">
                        {bookingData.bus.date}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Departure:{" "}
                  <span className="font-medium">
                    {bookingData.bus.departure}
                  </span>
                </span>
              </div>
            </div>

            {/* Seat & Passenger Summary */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Seat & Passenger Details
              </h2>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground">Selected Seats</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {bookingData.selectedSeats.map((seat) => (
                    <span
                      key={seat}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      Seat {seat}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {bookingData.passengers.map((passenger, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {passenger.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {passenger.age} yrs • {passenger.gender}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Seat {passenger.seatNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Options */}
            <div className="bg-card rounded-xl shadow-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Options
              </h2>

              <div className="grid sm:grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedPaymentMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {method.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Section - Amount Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl shadow-card p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Amount Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Base Fare ({bookingData.selectedSeats.length} seats)
                  </span>
                  <span className="text-foreground">₹{baseFare}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Taxes & GST (5%)
                  </span>
                  <span className="text-foreground">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Convenience Fee</span>
                  <span className="text-foreground">₹{convenienceFee}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-foreground font-semibold">
                    Total Payable
                  </span>
                  <span className="text-xl font-bold text-primary">
                    ₹{totalPayable}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePaymentClick}
                disabled={!selectedPaymentMethod || isProcessing}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed text-primary-foreground py-3 rounded-xl font-semibold transition-colors shadow-button flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  `Pay ₹${totalPayable}`
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                By proceeding, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Confirm Payment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please verify before proceeding
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <p className="text-center text-foreground">
                Proceed to pay{" "}
                <span className="text-xl font-bold text-primary">
                  ₹{totalPayable}
                </span>
                ?
              </p>
              <p className="text-center text-sm text-muted-foreground mt-2">
                via{" "}
                {
                  paymentMethods.find((m) => m.id === selectedPaymentMethod)
                    ?.name
                }
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Result Modal */}
      {paymentResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 text-center">
            {paymentResult === "success" ? (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Payment Successful!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your booking has been confirmed. You will receive a
                  confirmation shortly.
                </p>
                <button
                  onClick={handleSuccessRedirect}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold"
                >
                  View Booking Details
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Payment Failed
                </h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't process your payment. Please try again or use a
                  different payment method.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleBackToSeats}
                    className="flex-1 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted transition-colors"
                  >
                    Go Back
                  </button>
                  <button
                    onClick={handleRetryPayment}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                  >
                    Retry Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
