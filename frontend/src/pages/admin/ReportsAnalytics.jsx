import { useState, useEffect } from "react";
import {
  IndianRupee,
  ClipboardList,
  TrendingUp,
  XCircle,
  Printer,
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
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import axios from "axios";
import AppDropdown from "../../components/AppDropdown";
import { ReportsDataSkeleton } from "../../components/skeletons";
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
  Legend,
);

const ReportsAnalytics = () => {
  const [scope, setScope] = useState("Week");
  const [dashboard, setDashboard] = useState({});
  const [revenueTrend, setrevenueTrend] = useState([]);
  const [bookingTrend, setbookingTrend] = useState([]);
  const [routeTrend, setrouteTrend] = useState({});
  const [busTrend, setbusTrend] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadreport();
  }, [scope]);

  const loadreport = async () => {
    try {
      setIsLoading(true);

      await waitForLoader();
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/admin/dashboard/report`,
        {
          period: scope,
        },
        { withCredentials: true },
      );

      setDashboard(response.data);
      setrevenueTrend(response.data?.revenuetrend);
      setbookingTrend(response.data?.bookingtrend);
      setrouteTrend(response.data?.routetrend);
      setbusTrend(response.data?.bustrend);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  // Dummy data for different scopes - structured for easy replacement
  const dummyData = {
    totalRevenue: `₹${dashboard.totalrevenue}`,
    totalBookings: dashboard.totalBookiings,
    avgRevenuePerBooking: `₹${dashboard.average}`,
    cancellationRate: `${dashboard.cancelRate}%`,
    revenueTrend: {
      labels: revenueTrend.map((day) => day.day),
      data: revenueTrend.map((day) => day.sum),
    },
    bookingsTrend: {
      labels: bookingTrend.map((day) => day.day),
      data: bookingTrend.map((day) => day.count),
    },
    revenueByRoute: {
      labels: Object.keys(routeTrend),
      data: Object.keys(routeTrend)
        .map((route) => routeTrend[route].revenue)
    },
    revenueByBus: {
      labels: Object.keys(busTrend),
      data: Object.keys(busTrend)
        .map((bus) => busTrend[bus].revenue)
    },
    topTrips: Object.keys(routeTrend).map((route) => {
      return {
        name: route,
        bookings: routeTrend[route].totalBookiings,
        revenue: routeTrend[route].revenue,
      };
    }),
    topBuses: Object.keys(busTrend).map((bus) => {
      return {
        name: bus,
        trips: busTrend[bus].Totaltrip,
        revenue: busTrend[bus].revenue,
      };
    }),
  };

  // Report Cards Data
  const reportCards = [
    {
      label: "Total Revenue",
      value: dummyData.totalRevenue,
      icon: IndianRupee,
      color: "bg-teal-500",
    },
    {
      label: "Total Bookings",
      value: dummyData.totalBookings,
      icon: ClipboardList,
      color: "bg-violet-500",
    },
    {
      label: "Avg Revenue/Booking",
      value: dummyData.avgRevenuePerBooking,
      icon: TrendingUp,
      color: "bg-emerald-500",
    },
    {
      label: "Cancellation Rate",
      value: dummyData.cancellationRate,
      icon: XCircle,
      color: "bg-rose-500",
    },
  ];

  // Chart configurations
  const revenueTrendChartData = {
    labels: dummyData.revenueTrend.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: dummyData.revenueTrend.data,
        backgroundColor: "rgba(14, 165, 233, 0.7)",
        borderColor: "rgb(14, 165, 233)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const bookingsTrendChartData = {
    labels: dummyData.bookingsTrend.labels,
    datasets: [
      {
        label: "Bookings",
        data: dummyData.bookingsTrend.data,
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const revenueByRouteChartData = {
    labels: dummyData.revenueByRoute.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: dummyData.revenueByRoute.data,
        backgroundColor: [
          "rgba(14, 165, 233, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: [
          "rgb(14, 165, 233)",
          "rgb(16, 185, 129)",
          "rgb(139, 92, 246)",
          "rgb(245, 158, 11)",
          "rgb(239, 68, 68)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const revenueByBusChartData = {
    labels: dummyData.revenueByBus.labels,
    datasets: [
      {
        label: "Revenue (₹)",
        data: dummyData.revenueByBus.data,
        backgroundColor: [
          "rgba(99, 102, 241, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(20, 184, 166, 0.7)",
          "rgba(251, 146, 60, 0.7)",
          "rgba(168, 85, 247, 0.7)",
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(236, 72, 153)",
          "rgb(20, 184, 166)",
          "rgb(251, 146, 60)",
          "rgb(168, 85, 247)",
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
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handlePrint = () => {
    window.print();
  };

  const getScopeLabel = () => {
    switch (scope) {
      case "Week":
        return "This Week";
      case "Month":
        return "This Month";
      case "Year":
        return "Year";
      default:
        return "";
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };



  return (
    <>
      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 20px;
            }
            .no-print {
              display: none !important;
            }
            .print-header {
              display: block !important;
            }
          }
        `}
      </style>

      <div className="space-y-6">
        {/* Page Header with Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 no-print">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Reports & Analytics
            </h1>
            <p className="text-slate-600 mt-1">
              View detailed analytics and performance reports.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AppDropdown
              options={[
                { value: "Week", label: "This Week" },
                { value: "Month", label: "This Month" },
                { value: "Year", label: "This Year" },
              ]}
              value={scope}
              onChange={(val) => setScope(val)}
              placeholder="Select scope"
            />
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print Report
            </button>
          </div>
        </div>

        {/* Print Area */}
        <div className="print-area">
          {/* Print Header - Only visible in print */}
          <div className="print-header hidden mb-8 text-center border-b-2 border-slate-200 pb-6">
            <h1 className="text-3xl font-bold text-slate-800">
              QuickBus – Analytics Report
            </h1>
            <p className="text-lg text-slate-600 mt-2">
              Scope: {getScopeLabel()}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Generated on: {getCurrentDate()}
            </p>
          </div>

          {/* Report Cards */}
          {isLoading ? (
  <ReportsDataSkeleton />
) : (
  <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reportCards.map((item, index) => (
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
                  <div className={`${item.color} p-3 rounded-lg no-print`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="space-y-6 mt-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Trends & Analysis
            </h2>

            {/* Charts Grid - 2x2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-semibold text-slate-700 mb-4">
                  Revenue Trend
                </h3>
                <div className="h-64">
                  <Line data={revenueTrendChartData} options={chartOptions} />
                </div>
              </div>

              {/* Bookings Trend */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-semibold text-slate-700 mb-4">
                  Bookings Trend
                </h3>
                <div className="h-64">
                  <Line data={bookingsTrendChartData} options={chartOptions} />
                </div>
              </div>

              {/* Revenue by Route */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-semibold text-slate-700 mb-4">
                  Revenue by Route
                </h3>
                <div className="h-64">
                  <Bar data={revenueByRouteChartData} options={chartOptions} />
                </div>
              </div>

              {/* Revenue by Bus */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                <h3 className="text-base font-semibold text-slate-700 mb-4">
                  Revenue by Bus
                </h3>
                <div className="h-64">
                  <Bar data={revenueByBusChartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Performance Cards Section */}
          <div className="space-y-6 mt-6">
            <h2 className="text-lg font-semibold text-slate-800">
              Top Performers
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Performing Trips */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-base font-semibold text-slate-700">
                    Top Performing Trips
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {dummyData.topTrips
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 3)
                    .map((trip, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {trip.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {trip.bookings} bookings
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">
                            {trip.revenue}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Top Performing Buses */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-base font-semibold text-slate-700">
                    Top Performing Buses
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {dummyData.topBuses
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 3)
                    .map((bus, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-violet-100 text-violet-700 rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {bus.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {bus.trips} trips
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-emerald-600">
                            {bus.revenue}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
            </>
)}
        </div>
      </div>
    </>
  );
};

export default ReportsAnalytics;
