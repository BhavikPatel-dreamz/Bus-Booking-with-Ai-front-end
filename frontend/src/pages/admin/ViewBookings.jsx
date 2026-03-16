import { useEffect, useState } from "react";
import {
  ClipboardList,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { AdminBookingDataSkeleton } from "../../components/skeletons";
import { waitForLoader } from "../../helpers/loaderDelay";
import AppDropdown from "../../components/AppDropdown";

const ViewBookings = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchBookings();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const fetchBookings = async () => {
    try {


      setIsLoading(true);        //start skeleton

      await waitForLoader();    //fake artificial delay


      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/ticket/admin/get`,
        { withCredentials: true },
      );
      setAllBookings(response.data.allticket);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);      // 🔹 stop skeleton always
    }
  };
  const [searchPnr, setSearchPnr] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedBooking, setExpandedBooking] = useState(null);

  const itemsPerPage = 5;

  // Filter and sort bookings
  let filteredBookings = allBookings.filter((booking) => {
    const matchesPnr = booking.pnr
      .toLowerCase()
      .includes(searchPnr.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;
    return matchesPnr && matchesStatus;
  });

  // Sort
  filteredBookings.sort((a, b) => {
    if (sortBy === "date_desc")
      return new Date(b.bookedon) - new Date(a.bookedon);
    if (sortBy === "date_asc")
      return new Date(a.bookedon) - new Date(b.bookedon);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const toggleExpand = (id) => {
    setExpandedBooking(expandedBooking === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-sky-600" />
          View All Bookings
        </h1>
        <p className="text-slate-600 mt-1">
          Browse and search all bookings across the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search by PNR */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchPnr}
              onChange={(e) => {
                setSearchPnr(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by PNR..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            />
          </div>

          {/* Status Filter */}
          <AppDropdown
            options={[
              { value: "all", label: "All Status" },
              { value: "booked", label: "Booked" },
              { value: "cancelled", label: "Cancelled" },
              { value: "expired", label: "Expired" },
            ]}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
            placeholder="All Status"
          />


          {/* Sort */}
          <AppDropdown
            options={[
              { value: "date_desc", label: "Latest First" },
              { value: "date_asc", label: "Oldest First" },
              { value: "status", label: "By Status" },
            ]}
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            placeholder="Sort by"
          />

        </div>
      </div>


      {/* Booking Cards */}
      {isLoading ? (
        <AdminBookingDataSkeleton count={5} />
      ) : (<div className="space-y-4">
        {paginatedBookings.map((booking) => (
          <div
            key={booking.ticketid}
            className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
          >
            {/* Main Card Content */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                  {/* PNR */}
                  <div>
                    <p className="text-xs text-slate-500">PNR</p>
                    <p className="text-sm font-semibold text-slate-800">
                      {booking.pnr}
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`inline-flex self-start px-2.5 py-1 rounded-full text-xs font-medium ${booking.status === "booked"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {capitalizeFirstLetter(booking.status)}
                  </span>

                  {/* User */}
                  <div>
                    <p className="text-xs text-slate-500">User</p>
                    <p className="text-sm font-medium text-slate-700">
                      {booking.user}
                    </p>
                  </div>

                  {/* Route */}
                  <div>
                    <p className="text-xs text-slate-500">Route</p>
                    <p className="text-sm font-medium text-slate-700">
                      {booking.route}
                    </p>
                  </div>

                  {/* Travel Date */}
                  <div>
                    <p className="text-xs text-slate-500">Travel Date</p>
                    <p className="text-sm font-medium text-slate-700">
                      {booking.traveldate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Amount</p>
                    <p className="text-sm font-bold text-slate-800">
                      ₹{booking.amount}
                    </p>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => toggleExpand(booking.ticketid)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {expandedBooking === booking.ticketid ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedBooking === booking.ticketid && (
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 border-t border-slate-100">
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Bus Number</p>
                    <p className="font-medium text-slate-700">
                      {booking.busnumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Seats Booked</p>
                    <p className="font-medium text-slate-700">
                      {booking.seats}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">Booked On</p>
                    <p className="font-medium text-slate-700">
                      {booking.bookedon}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500">User Email</p>
                    <p className="font-medium text-slate-700">
                      {booking.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {!isLoading && paginatedBookings.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No bookings found.</p>
          </div>
        )}
      </div>)}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <p className="text-sm text-slate-600">
            Showing {startIndex + 1}-
            {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of{" "}
            {filteredBookings.length} bookings
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-slate-700">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookings;
