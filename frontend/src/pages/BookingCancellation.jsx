import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import axios from "axios";
import { useToast } from "../components/toast/ToastContext";

const BookingCancellation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState({});
  const [passengers, setPassengers] = useState([]);
   const { showToast } = useToast();
  
      const showSuccessMsg = (msg) => {
        showToast({ type: "success", message: msg });
      };

      const showErrorMsg = (msg) => {
        showToast({ type: "error", message: msg });
      };

  useEffect(() => {
    fetchTIcket();
  }, []);

  const fetchTIcket = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/ticket/user/${location.state?.booking}`,
        { withCredentials: true },
      );
      setBooking(response.data.ticket);
      setPassengers(response.data.ticket.passengersInfo);
    } catch (error) {
      console.error(error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  useBeforeUnload(true);
 
  const handleConfirmCancellation = async () => {
    const bookingId = location.state?.booking;
    if (!bookingId) {
      showErrorMsg("Invalid booking. Please try again.")
      return;
    }
    setIsProcessing(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASE_URI}/api/ticket/${bookingId}`,
        {},
        { withCredentials: true },
      );

      if (response.data.success === true) {
        showSuccessMsg("Booking cancelled successfully")
        navigate("/booking-confirmation", {
          state: { booking: bookingId },
          replace: true,
        });
      } else {
        showErrorMsg(response.data?.message || "Cancellation failed")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Server error. Try again later."
      showErrorMsg(`${errorMessage}`)
    } finally {
      setIsProcessing(false);
      setShowModal(false);
    }
  };

  const refundAmount = booking.totalamount;
 
  function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Warning Header */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-8 w-8 text-amber-500 flex-shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-amber-700 mb-1">
                Cancel Booking
              </h1>
              <p className="text-amber-600 text-sm">
                Please review the booking details carefully before cancelling.
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            Booking Details
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">PNR Number</p>
              <p className="font-semibold text-primary">{booking.pnr}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booking Status</p>
              <p className="font-medium text-green-600">
                {capitalizeFirstLetter(booking.status)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bus Number</p>
              <p className="font-medium text-foreground">{booking.busnumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Route</p>
              <p className="font-medium text-foreground">
                {booking.from} → {booking.to}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Travel Date</p>
              <p className="font-medium text-foreground">
                {booking.traveldate}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Timing</p>
              <p className="font-medium text-foreground">
                {booking.departuretime} - {booking.arrivaltime}
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Selection */}
        <div className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Passenger Details
          </h2>
          <div className="space-y-3">
            {passengers.map((passenger, index) => (
              <div
                key={index}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{passenger.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium">{passenger.age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium">{passenger.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seat No</p>
                    <p className="font-semibold text-primary">
                      {passenger.seatno}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Summary */}
          <div className="bg-card rounded-xl shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Refund Summary
            </h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground mt-1">
                  Refund will be processed within 5-7 business days
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Refund Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{refundAmount}
                </p>
              </div>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/my-bookings")}
            className="bg-card hover:bg-muted border border-border text-foreground py-3 rounded-xl font-medium transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3 rounded-xl font-medium transition-colors"
          >
            Cancel Entire Booking
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-foreground text-center mb-2">
              Confirm Cancellation
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Are you sure you want to cancel ticket?
              This action cannot be undone. A refund of ₹{refundAmount} will be
              initiated.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowModal(false)}
                disabled={isProcessing}
                className="bg-muted hover:bg-muted/80 text-foreground py-3 rounded-xl font-medium transition-colors"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleConfirmCancellation}
                disabled={isProcessing}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  "Yes, Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCancellation;
