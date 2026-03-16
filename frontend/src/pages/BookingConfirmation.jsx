import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Download, Home, Ticket } from 'lucide-react';
import jsPDF from 'jspdf';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking,setBooking] = useState({})
  const [passengers,setPassengers] = useState([])

  useEffect(()=>{
    fetchTIcket()
  },[])

  const fetchTIcket = async()=>{
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URI}/api/ticket/user/${location.state?.booking}`,{withCredentials:true})
      setBooking(response.data.ticket)
      setPassengers(response.data.ticket.passengersInfo)
    } catch (error) {
      console.error(error)
    }
  }

  const isBooked = booking.status === 'booked';

  const downloadTicketPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(15, 76, 129); // Primary color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('QuickBus', 20, 25);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('E-Ticket', pageWidth - 20, 25, { align: 'right' });

    // Status Badge
    const statusY = 55;
    if (isBooked) {
      doc.setFillColor(34, 197, 94);
    } else {
      doc.setFillColor(239, 68, 68);
    }
    doc.roundedRect(20, statusY - 7, 50, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(booking.status.toUpperCase(), 45, statusY, { align: 'center' });

    // PNR
    doc.setTextColor(15, 76, 129);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`PNR: ${booking.pnr}`, pageWidth - 20, statusY, { align: 'right' });

    // Booking Information Section
    let yPos = 80;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Booking Information', 20, yPos);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPos + 3, pageWidth - 20, yPos + 3);

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const bookingInfo = [
      ['Booking Date', booking.bookedtime],
      ['Bus Number', booking.busnumber],
      ['Bus Type', booking.bustype],
      ['From', booking.from],
      ['To', booking.to],
      ['Travel Date', booking.traveldate],
      ['Departure', booking.departuretime],
      ['Arrival', booking.arrivaltime]
    ];

    bookingInfo.forEach(([label, value]) => {
      doc.setTextColor(100, 100, 100);
      doc.text(label + ':', 20, yPos);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'bold');
      doc.text(value, 80, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 8;
    });

    // Passenger Information Section
    yPos += 10;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Passenger Information', 20, yPos);
    
    doc.line(20, yPos + 3, pageWidth - 20, yPos + 3);

    yPos += 15;
    
    // Table header
    doc.setFillColor(245, 245, 245);
    doc.rect(20, yPos - 5, pageWidth - 40, 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text('Name', 25, yPos);
    doc.text('Age', 90, yPos);
    doc.text('Gender', 115, yPos);
    doc.text('Seat No.', 155, yPos);
    
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    
    passengers.forEach((passenger) => {
      doc.text(passenger.name, 25, yPos);
      doc.text(passenger.age.toString(), 90, yPos);
      doc.text(passenger.gender, 115, yPos);
      doc.text(passenger.seatno.toString(), 155, yPos);
      yPos += 8;
    });

    // Payment Information Section
    yPos += 10;
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Information', 20, yPos);
    
    doc.line(20, yPos + 3, pageWidth - 20, yPos + 3);

    yPos += 15;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    doc.setTextColor(100, 100, 100);
    doc.text('Total Amount:', 20, yPos);
    doc.setTextColor(15, 76, 129);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`${booking.totalamount} INR`, 80, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Payment Status:', 20, yPos);
    doc.setTextColor(34, 197, 94);
    doc.setFont('helvetica', 'bold');
    doc.text(booking.paymentstatus, 80, yPos);

    // Footer
    yPos = doc.internal.pageSize.getHeight() - 20;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for choosing QuickBus. Have a safe journey!', pageWidth / 2, yPos, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPos + 5, { align: 'center' });

    doc.save(`QuickBus_Ticket_${booking.pnr}.pdf`);
  };

  function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}


  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Status Header */}
        <div className={`rounded-xl p-6 mb-6 text-center ${isBooked ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex justify-center mb-3">
            {isBooked ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isBooked ? 'text-green-700' : 'text-red-700'}`}>
            {isBooked ? 'Booking Confirmed!' : `Booking ${booking.status}`}
          </h1>
          <p className="text-lg font-semibold text-foreground">PNR: {booking.pnr}</p>
        </div>

        {/* Booking Information */}
        <div className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            Booking Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Booking Status</p>
              <p className={`font-medium ${isBooked ? 'text-green-600' : 'text-red-600'}`}>
                {capitalizeFirstLetter(booking.status)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booking Date & Time</p>
              <p className="font-medium text-foreground">{booking.bookedtime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bus Number</p>
              <p className="font-medium text-foreground">{booking.busnumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bus Type</p>
              <p className="font-medium text-foreground">{booking.bustype}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p className="font-medium text-foreground">{booking.from}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p className="font-medium text-foreground">{booking.to}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departure Time</p>
              <p className="font-medium text-foreground">{booking.departuretime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arrival Time</p>
              <p className="font-medium text-foreground">{booking.arrivaltime}</p>
            </div>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="bg-card rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            Passenger Information
          </h2>
          <div className="space-y-4">
            {passengers.map((passenger, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{passenger.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Age</p>
                    <p className="font-medium text-foreground">{passenger.age}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Gender</p>
                    <p className="font-medium text-foreground">{passenger.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seat No.</p>
                    <p className="font-medium text-primary">{passenger.seatno}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-card rounded-xl shadow-card p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border">
            Payment Information
          </h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold text-primary">₹{booking.totalamount}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="font-medium text-green-600">{capitalizeFirstLetter(booking.paymentstatus)}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border text-foreground py-3 rounded-xl font-medium transition-colors"
          >
            <Ticket className="h-5 w-5" />
            My Bookings
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border text-foreground py-3 rounded-xl font-medium transition-colors"
          >
            <Home className="h-5 w-5" />
            Home
          </button>
          <button
            onClick={downloadTicketPDF}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-medium transition-colors shadow-button"
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
