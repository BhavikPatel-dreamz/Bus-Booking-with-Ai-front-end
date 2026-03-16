import {
  Bus,
  Route,
  ClipboardList,
  CheckCircle,
  XCircle,
  IndianRupee,
  UserRoundCheck,
  Navigation
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DashboardDataSkeleton } from "../../components/skeletons";
import { waitForLoader } from "../../helpers/loaderDelay";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState({});
  const [recentBookings, setRecentBookings] = useState([]);
  const [revenueTrend, setrevenueTrend] = useState([])
  const [bookingTrend, setbookingTrend] = useState([])
  const [routeTrend, setrouteTrend] = useState({})
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchDashboard();
  }, []);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const fetchDashboard = async () => {
    try {

      setIsLoading(true);          //tart loader

      await waitForLoader();      // fake delay delay


      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/admin/dashboard/home`,
        { withCredentials: true },
      );
      setDashboard(response.data);
      setRecentBookings(response.data.recentTickets);
      setrevenueTrend(response.data?.revenueTrend)
      setbookingTrend(response.data?.bookingTrend)
      setrouteTrend(response.data?.routeTrend)

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);        //stop loader always
    }
  };

  const summaryData = [
    {
      label: "Total Buses",
      value: dashboard.totalBus,
      icon: Bus,
      color: "bg-sky-500",
    },
    {
      label: "Total Routes",
      value: dashboard.totalRoutes,
      icon: Route,
      color: "bg-emerald-500",
    },

    {
      label: "Total Customers",
      value: (dashboard.totalCustomer),
      icon: UserRoundCheck,
      color: "bg-pink-500",
    },
    {
      label: "Total Trips",
      value: dashboard.totalTrip,
      icon: Navigation,
      color: "bg-cyan-500",
    },
    {
      label: "Total Bookings",
      value: dashboard.totalBookiings,
      icon: ClipboardList,
      color: "bg-violet-500",
    },
    {
      label: "Active Bookings",
      value: dashboard.activeBooking,
      icon: CheckCircle,
      color: "bg-amber-500",
    },
    {
      label: "Cancelled Bookings",
      value: dashboard.cancelledBooking,
      icon: XCircle,
      color: "bg-rose-500",
    },
    {
      label: "Total Revenue",
      value: `₹${Math.ceil(dashboard.totalrevenue)}`,
      icon: IndianRupee,
      color: "bg-teal-500",
    },
  ];
  // Dummy chart data - Revenue Trend (This Week)
  const revenueTrendData = {
    labels: revenueTrend.map(day => day.day),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: revenueTrend?.map((day) => day.sum),
        backgroundColor: 'rgba(14, 165, 233, 0.7)',
        borderColor: 'rgb(14, 165, 233)',
        borderWidth: 2,
      },
    ],
  };


  const bookingsTrendData = {
    labels: bookingTrend?.map((day) => day.day),
    datasets: [
      {
        label: 'Bookings',
        data: bookingTrend?.map((day) => day.count),
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };


  const revenueByRouteData = {
    labels: Object.keys(routeTrend),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: Object.values(routeTrend),
        backgroundColor: [
          'rgba(14, 165, 233, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: [
          'rgb(14, 165, 233)',
          'rgb(16, 185, 129)',
          'rgb(139, 92, 246)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Welcome back! Here's an overview of your system.
        </p>
      </div>


      {isLoading ? (
        <DashboardDataSkeleton />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {summaryData.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      {item.label}
                    </p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {item.value}
                    </p>
                  </div>
                  <div className={`${item.color} p-3 rounded-lg`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Charts Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-800">This Week's Analytics</h2>

            {/* Top Row - Two Charts Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-semibold text-slate-700 mb-4">Revenue Trend (This Week)</h3>
                <div className="h-64">
                  <Bar data={revenueTrendData} options={chartOptions} />
                </div>
              </div>

              {/* Bookings Trend Chart */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-semibold text-slate-700 mb-4">Bookings Trend (This Week)</h3>
                <div className="h-64">
                  <Line data={bookingsTrendData} options={chartOptions} />
                </div>
              </div>
            </div>

            {/* Bottom Row - Full Width Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-base font-semibold text-slate-700 mb-4">Revenue by Route (This Week)</h3>
              <div className="h-72">
                <Bar data={revenueByRouteData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                Recent Bookings
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Latest booking activity across the platform
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      PNR
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentBookings.slice(0, 8).map((booking, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">
                        {booking.pnr}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {booking.route}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === "booked"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                            }`}
                        >
                          {capitalizeFirstLetter(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {booking.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>)}
    </div>

  );
};

export default Dashboard;
