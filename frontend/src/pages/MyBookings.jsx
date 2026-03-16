import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, Calendar, MapPin, Ticket, ArrowRight, Eye, XCircle } from 'lucide-react';
import axios from 'axios'

import { UserBookingDataSkeleton } from "../components/skeletons";

import { waitForLoader } from "../helpers/loaderDelay";


const MyBookings = () => {
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setIsLoading(true);        // start skeleton

      await waitForLoader();    // fake artificial delay

      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/ticket/user/get`, { withCredentials: true })
      setBookings(response.data.allticket)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false);      // stop skeleton always
    }

  }
  const handleViewDetails = (booking) => {
    navigate('/booking-confirmation', { state: { booking } });
  };

  const handleCancelTicket = (booking) => {
    navigate('/booking-cancellation', { state: { booking } });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Bookings</h1>

      {isLoading ? (
        <UserBookingDataSkeleton count={3} />
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isBooked = booking.status === 'booked';
              const isProcessing = processingId === booking.ticketid;

              return (
                <div
                  key={booking.ticketid}
                  className={`bg-card rounded-xl shadow-card overflow-hidden border-l-4 ${isBooked ? 'border-l-green-500' : 'border-l-red-400'
                    }`}
                >
                  {/* Header */}
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">PNR Number</p>
                        <p className="text-lg font-bold text-primary">{booking.pnr}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${isBooked
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    {/* Bus Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Bus className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{booking.busnumber}</p>
                        <p className="text-sm text-muted-foreground">{booking.bustype}</p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{booking.from}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{booking.to}</span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground">Travel Date</p>
                        <p className="font-medium text-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {booking.traveldate}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Seats</p>
                        <p className="font-medium text-foreground">
                          {booking.seat}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Passengers</p>
                        <p className="font-medium text-foreground">{booking.passengers}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-primary">₹{booking.amount}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleViewDetails(booking.ticketid)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      {isBooked && (
                        <button
                          onClick={() => handleCancelTicket(booking.ticketid)}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? (
                            <>
                              <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Cancel Ticket
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>



          {!isLoading && bookings.length === 0 && (<div className="container mx-auto px-4 py-16 bg">
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Ticket className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">No Bookings Yet</h2>
              <p className="text-muted-foreground mb-8">
                You haven't made any bus bookings yet. Search for buses and book your first trip!
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold transition-colors shadow-button"
              >
                Book Your First Trip
              </button>
            </div>
          </div>)}
        </>
      )}



    </div>
  );
};

export default MyBookings;
