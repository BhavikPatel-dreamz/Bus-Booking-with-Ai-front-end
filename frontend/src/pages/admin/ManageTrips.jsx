import { useEffect, useState } from "react";
import { Route as RouteIcon, Pencil, Ban, Clock, Calendar } from "lucide-react";
import axios from "axios";
import { TripGridSkeleton } from "../../components/skeletons";
import { waitForLoader } from "../../helpers/loaderDelay";
import { useMemo } from "react";
import { User } from "lucide-react";
import AppDropdown from "../../components/AppDropdown";
import { Plus, Search } from "lucide-react";
import TripFormModal from "../../components/admin/TripFormModal";
import { useToast } from "../../components/toast/ToastContext";

const DAYS_OF_WEEK = [
  { index: 0, short: "Sun" },
  { index: 1, short: "Mon" },
  { index: 2, short: "Tue" },
  { index: 3, short: "Wed" },
  { index: 4, short: "Thu" },
  { index: 5, short: "Fri" },
  { index: 6, short: "Sat" },
];

const ManageTrips = () => {
  const [allbuses, setallBuses] = useState([]);
  const [alltrips, setalltrips] = useState([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTrip, setEditingTrip] = useState(null);

  const [filterDay, setFilterDay] = useState("");
  const [filterRoute, setFilterRoute] = useState("");
  const [filterBus, setFilterBus] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmTripId, setConfirmTripId] = useState(null);
  const [allBusesforFilter, setallBusesforFilter] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTripData, setEditingTripData] = useState(null);

  const { showToast } = useToast();

  const showSuccessMsg = (msg) => {
    showToast({ type: "success", message: msg });
  };

  const showErrorMsg = (msg) => {
    showToast({ type: "error", message: msg });
  };

  const [editForm, setEditForm] = useState({
    minimumRevenue: 0,
    busId: "",
    conductorId: "",
    driverId: "",
    departureTime: "",
    operatingDays: [],
    routeId: "",
  });

  useEffect(() => {
    // setEmployees(employeeData); // replace later with API
    getEmployees();
  }, []);

  // const drivers = useMemo(() => getDrivers(employees), [employees]);
  // const conductors = useMemo(() => getConductors(employees), [employees]);

  const getfilterConductors = async () => {
    const payload = {
      tripId: editingTrip,
      role: "conductor",
      departureTime: editForm.departureTime,
      days: editForm.operatingDays,
      routeId: editForm.routeId,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/trip/filteremp`,
        payload,
        { withCredentials: true },
      );
    } catch (error) {
      const errorMessage = error.response.data.message || error.message;
      showErrorMsg(errorMessage);
    }
  };

  const getfilterDrivers = async () => {
    const payload = {
      tripId: editingTrip,
      role: "driver",
      departureTime: editForm.departureTime,
      days: editForm.operatingDays,
      routeId: editForm.routeId,
    };
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URI}/api/trip/filteremp`,
        payload,
        { withCredentials: true },
      );
    } catch (error) {
      const errorMessage = error.response.data.message || error.message;
      showErrorMsg(errorMessage);
    }
  };
  const getEmployees = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/emp/getemps`,
        { withCredentials: true },
      );
      setEmployees(
        response?.data?.emps?.map((emp) => ({
          id: emp._id,
          name: emp.name,
          phone: emp.phone,
          city: emp.city,
          role: emp.role,
        })),
      );
    } catch (error) {
      const errorMessage = error.response.data.message || error.message;
      showErrorMsg(errorMessage);
    }
  };
  // Fetch all trips on mount or count change

  useEffect(() => {
    const getTrips = async () => {
      try {
        setIsLoading(true);
        await waitForLoader();
        const restrip = await axios.get(
          `${import.meta.env.VITE_BASE_URI}/api/trip/get`,
          { withCredentials: true },
        );
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URI}/api/admin/bus/get`,
          { withCredentials: true },
        );
        setallBusesforFilter(res.data.busInfo);

        setalltrips(restrip.data.trip);
      } catch (error) {
        const errorMessage = error.response.data.message || error.message;
        showErrorMsg(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    getTrips();
  }, [count]);

  // Filter buses based on trip requirements
  useEffect(() => {
    if (!editForm.departureTime || !editForm.operatingDays.length) return;
    const getfilterBus = async () => {
      const payload = {
        departureTime: editForm.departureTime,
        days: editForm.operatingDays,
        tripId: editingTrip,
        routeId: editForm.routeId,
      };
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URI}/api/trip/filterbus`,
          payload,
          { withCredentials: true },
        );
        if (response.data.buses.length === 0) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URI}/api/admin/bus/get`,
            { withCredentials: true },
          );
          setallBuses(res.data.busInfo);
        } else {
          setallBuses(response.data.buses);
        }
      } catch (error) {
        setallBuses([]);
        const errorMessage = error.response?.data?.message || error.message;
        showErrorMsg(errorMessage);
      }
    };
    getfilterBus();
    getfilterConductors();
    getfilterDrivers();
  }, [editForm.departureTime, editForm.operatingDays]);

  const buses = allbuses?.map((bus) => ({
    id: bus.busId,
    name: bus.name,
    number: bus.busnumber,
    days: bus.days,
  }));

  const busesforfilter = allBusesforFilter?.map((bus) => ({
    id: bus.busId,
    name: bus.name,
    number: bus.busnumber,
    days: bus.days,
  }));

  useEffect(() => {
    if (!editForm.busId) return;

    const selectedBus = buses.find((b) => b.id === editForm.busId);
    if (!selectedBus) return;

    // Days that this bus allows
    const availableDayIndexes = getAvailableDayIndexes(selectedBus.days);

    // Intersection: selected days ∩ available days
    const intersectedDays = editForm.operatingDays.filter((day) =>
      availableDayIndexes.includes(day),
    );

    setEditForm((prev) => ({
      ...prev,
      operatingDays: intersectedDays,
    }));
  }, [editForm.busId]);

  const uniqueRoutes = [...new Set(alltrips.map((t) => t.tripname))];

  const filteredTrips = useMemo(() => {
    return alltrips
      .filter((trip) => {
        if (filterDay && !trip.days.includes(parseInt(filterDay))) return false;
        if (filterRoute && trip.tripname !== filterRoute) return false;
        if (filterBus && trip.busname !== filterBus) return false;

        if (searchText) {
          const q = searchText.toLowerCase();
          const matches =
            trip.tripname.toLowerCase().includes(q) ||
            trip.busname.toLowerCase().includes(q);

          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [alltrips, filterDay, filterRoute, filterBus, searchText]);

  const openConfirmModal = (action, tripId) => {
    setConfirmTripId(tripId);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URI}/api/trip/delete/${confirmTripId}`,
        { withCredentials: true },
      );
      if (res.data.success) {
        setCount((prev) => prev + 1);
        showSuccessMsg("Trip deleted successfully!");
      } else {
        showErrorMsg(res.data.message);
      }
    } catch (error) {
      showErrorMsg(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    } finally {
      setShowConfirmModal(false);
    }
  };

  const getAvailableDayIndexes = (busDays = []) => {
    return DAYS_OF_WEEK.filter((d) => busDays.includes(d.index)).map(
      (d) => d.index,
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <RouteIcon className="w-7 h-7 text-sky-600" />
            Manage Trips
          </h1>
          <p className="text-slate-600 mt-1">
            View and manage all scheduled trips.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTripData(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Trip
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search trips..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Filter by Day
            </label>
            <AppDropdown
              options={DAYS_OF_WEEK.map((day) => ({
                value: String(day.index),
                label: day.short,
              }))}
              value={filterDay}
              onChange={(val) => setFilterDay(val)}
              placeholder="All Days"
              size="sm"
              clearable
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Filter by Route
            </label>
            <AppDropdown
              options={uniqueRoutes.map((route) => ({
                value: route,
                label: route,
              }))}
              value={filterRoute}
              onChange={(val) => setFilterRoute(val)}
              placeholder="All Routes"
              size="sm"
              clearable
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Filter by Bus
            </label>
            <AppDropdown
              options={busesforfilter.map((bus) => ({
                value: bus.name,
                label: bus.name,
              }))}
              value={filterBus}
              onChange={(val) => setFilterBus(val)}
              placeholder="All Buses"
              size="sm"
              clearable
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <TripGridSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTrips.map((trip) => (
            <div
              key={trip.tripId}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden ${trip.inLoss ? "border-red-400" : "border-slate-100"}`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {trip.tripname}
                    </h3>
                    <p className="text-sm text-slate-500">{trip.busname}</p>
                  </div>
                  {trip.status === "cancelled" && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
                      Cancelled
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <div>
                      <p className="text-xs text-slate-500">Departure</p>
                      <p className="text-sm font-medium text-slate-700">
                        {trip.departureTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">Reaches At</p>
                      <p className="text-sm font-medium text-slate-700">
                        {trip.arrivalTime}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <p className="text-xs text-slate-500">Operating Days</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trip.days
                      .sort((a, b) => a - b)
                      .map((dayIndex) => (
                        <span
                          key={dayIndex}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium"
                        >
                          {DAYS_OF_WEEK[dayIndex]?.short}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500">Driver</p>
                      <p className="text-sm font-medium text-slate-700">
                        {employees.find((e) => e.id === trip.driver)?.name ||
                          "not known"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">Conductor</p>
                      <p className="text-sm font-medium text-slate-700">
                        {employees.find((e) => e.id === trip.conductor)?.name ||
                          "not known"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-500">Minimum Revenue</p>
                  <p className="text-sm font-semibold text-slate-700">
                    ₹{trip.minimumRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingTripData(trip);
                      setIsModalOpen(true);
                    }}
                    disabled={trip.status === "cancelled"}
                    className="flex-1 py-2 border border-sky-200 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => openConfirmModal("delete", trip.tripId)}
                    className="flex-1 py-2 border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Ban className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredTrips.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <RouteIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            No trips found matching your filters.
          </p>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Delete Trip?
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              This trip will be permanently deleted. This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleConfirmAction}
                className="flex-1 py-2 font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50"
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}

      <TripFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTripData(null);
        }}
        trip={editingTripData}
        onSave={(mode, message) => {
          setIsModalOpen(false);
          setEditingTripData(null);

          if (mode === "error") {
            showErrorMsg(message || "Failed to save trip");
            return;
          }

          setCount((c) => c + 1);

          if (mode === "edit") showSuccessMsg("Trip updated successfully!");
          if (mode === "add") showSuccessMsg("Trip created successfully!");
        }}
      />
    </div>
  );
};

export default ManageTrips;
