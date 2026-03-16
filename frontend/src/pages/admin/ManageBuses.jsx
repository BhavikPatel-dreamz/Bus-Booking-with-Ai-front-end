import { useState, useEffect } from "react";
import axios from "axios";
import {
  Bus,
  Pencil,
  X,
  Check,
  Wifi,
  Wind,
  BatteryCharging,
  Trash2,
} from "lucide-react";
import { BusDataSkeleton } from "../../components/skeletons";
import { waitForLoader } from "../../helpers/loaderDelay";
import AppDropdown from "../../components/AppDropdown";
import BusFormModal from "../../components/admin/BusFormModal";
import { useToast } from "../../components/toast/ToastContext";

const ManageBuses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusData, setEditingBusData] = useState(null);
  const [buses, setBuses] = useState([]);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isreload, setIsreload] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteSuccess, setshowDeleteSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [busTypeFilter, setBusTypeFilter] = useState("");
  const { showToast } = useToast();

  const showSuccessMsg = (msg) => {
    showToast({ type: "success", message: msg });
  };

  const showErrorMsg = (msg) => {
    showToast({ type: "error", message: msg });
  };

  useEffect(() => {
    loadbuses();
  }, [isreload]);
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const loadbuses = async () => {
    try {
      setIsLoading(true); //start loader

      await waitForLoader(); // fake artificial delay

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/admin/bus/get`,
        { withCredentials: true },
      );
      setBuses(response.data.busInfo);
    } catch (error) {
      const errorMessage = error.response.data.message || error.message;
      showErrorMsg(errorMessage);
    } finally {
      setIsLoading(false); //stop loader
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "WiFi":
        return <Wifi className="w-4 h-4" />;
      case "AC":
        return <Wind className="w-4 h-4" />;
      case "Charging":
        return <BatteryCharging className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleModalSave = async (formData) => {
    try {
      const payload = {
        name: formData.busName,
        busnumber: formData.busNumber,
        totalseats: Number(formData.totalSeats),
        type: formData.busType.toLowerCase(),
        baseprice: Number(formData.basePrice),
        amenties: formData.amenities,
      };

      let res;

      // CREATE
      if (!editingBusData) {
        res = await axios.post(
          `${import.meta.env.VITE_BASE_URI}/api/admin/bus`,
          payload,
          { withCredentials: true },
        );
      }
      // UPDATE
      else {
        res = await axios.put(
          `${import.meta.env.VITE_BASE_URI}/api/admin/bus`,
          {
            id: editingBusData.id,
            ...payload,
          },
          { withCredentials: true },
        );
      }

      if (res.data.success === true) {
        showSuccessMsg(`${res?.data?.message}`);
        setIsreload(!isreload);
      } else {
        showErrorMsg(`${res?.data?.message}`);
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message;
      showErrorMsg(`${errorMessage}`);
    } finally {
      setIsModalOpen(false);
      setEditingBusData(null);
      setTimeout(() => {
        setShowSuccess(false);
        setshowDeleteSuccess(false);
      }, 3000);
    }
  };

  const handleDeleteClick = (bus) => {
    setRouteToDelete(bus);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!routeToDelete?.id) return;

    try {
      setIsDeleting(true);

      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URI}/api/admin/bus/${routeToDelete.id}`,
        { withCredentials: true },
      );
      if (res.data.success === true) {
        setShowDeleteModal(false);
        showSuccessMsg(" Bus delete successfully!");
      } else {
        showErrorMsg(res.data.message);
      }
    } catch (err) {
      const errorMessage = err.response.data.message || err.message;
      showErrorMsg(`${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setRouteToDelete(null);
      setIsreload(!isreload);
      setTimeout(() => {
        setShowSuccess(false);
        setshowDeleteSuccess(false);
      }, 3000);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRouteToDelete(null);
  };

  const busTypeOptions = [
    { value: "seating", label: "Seating" },
    { value: "sleeper", label: "Sleeper" },
  ];

  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      !searchText ||
      bus.name.toLowerCase().includes(searchText.toLowerCase()) ||
      bus.busnumber.toLowerCase().includes(searchText.toLowerCase());

    const matchesType = !busTypeFilter || bus.type === busTypeFilter;

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-700 font-medium">
            {editingBusData
              ? "Bus update successfully!"
              : "Bus add successfully!"}
          </p>
        </div>
      )}

      {showDeleteSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600" />
          <p className="text-emerald-700 font-medium">
            Bus delete successfully!
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Bus className="w-7 h-7 text-sky-600" />
            Manage Buses
          </h1>
          <p className="text-slate-600 mt-1">
            View and manage all buses in the system.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingBusData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          + Add Bus
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by name or number..."
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <AppDropdown
            options={busTypeOptions}
            value={busTypeFilter}
            onChange={(val) => setBusTypeFilter(val)}
            placeholder="All Bus Types"
            clearable
          />
        </div>
      </div>

      {isLoading ? (
        <BusDataSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {bus.name}
                    </h3>
                    <p className="text-sm text-slate-500">{bus.busnumber}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      bus.type === "seating"
                        ? "bg-sky-100 text-sky-700"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {capitalizeFirstLetter(bus.type)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Total Seats</p>
                    <p className="text-sm font-medium text-slate-700">
                      {bus.totalseats}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Base Price/KM</p>
                    <p className="text-sm font-medium text-slate-700">
                      ₹{bus.baseprice}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {bus.amenties.map((amenity) => (
                    <span
                      key={amenity}
                      className="flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                    >
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingBusData({
                        id: bus.id,
                        busName: bus.name,
                        busNumber: bus.busnumber,
                        totalSeats: bus.totalseats,
                        busType: bus.type === "seating" ? "Seating" : "Sleeper",
                        basePrice: bus.baseprice,
                        amenities: bus.amenties,
                      });
                      setIsModalOpen(true);
                    }}
                    className="flex-1 py-2 border border-sky-200 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Bus
                  </button>
                  <button
                    onClick={() => handleDeleteClick(bus)}
                    className="flex-1 py-2 border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Bus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && filteredBuses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No buses found</p>
        </div>
      )}
      {!isLoading && buses.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
          <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Bus not found.</p>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-rose-100 rounded-full">
                <Trash2 className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">
                Remove Bus
              </h3>
            </div>

            <p className="text-slate-600 mb-2">
              Are you sure you want to remove the bus:
            </p>
            <p className="font-semibold text-slate-800 mb-4">
              {routeToDelete?.name}
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <p className="text-sm text-amber-700">
                <strong>Warning:</strong> Removing this bus may affect assigned
                routes, schedules, or trips. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 text-white font-medium rounded-lg"
              >
                {isDeleting ? "Removing..." : "Yes, Remove"}
              </button>

              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <BusFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
        bus={editingBusData}
      />
    </div>
  );
};

export default ManageBuses;
