import { useEffect, useState } from "react";
import { Route, Pencil, Trash2, X, MapPin, Plus } from "lucide-react";
import RouteFormModal from "../../components/admin/RouteFormModal";
import axios from "axios";
import { RouteDataSkeleton } from "../../components/skeletons";
import { useToast } from "../../components/toast/ToastContext";
import { waitForLoader } from "../../helpers/loaderDelay";

const ManageRoutes = () => {
  const [route, setroute] = useState({});
  const [isreload, setIsreload] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);

  const { showToast } = useToast();

  const showSuccessMsg = (msg) => {
    showToast({ type: "success", message: msg });
  };

  const showErrorMsg = (msg) => {
    showToast({ type: "error", message: msg });
  };

  useEffect(() => {
    getRoutes();
  }, [isreload]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getRoutes = async () => {
    try {
      setIsLoading(true); //start loader

      await waitForLoader(); // fake artificial delay

      await axios
        .get(`${import.meta.env.VITE_BASE_URI}/api/admin/route/get`, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success === true) {
            setroute(res.data);
          }
        });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // 🔹 stop loader always
    }
  };

  const routes = route?.routeInfo?.filter((res) => !res.ogroute) || [];
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = async (route) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URI}/api/admin/route/${route.id}`,
        { withCredentials: true },
      );

      const fullRoute = res.data.route || res.data;

      setEditingRoute(fullRoute);
      setIsModalOpen(true);
    } catch (err) {
      const errorMessage = err.response.data.message || err.message || "Failed to load route details"
      showErrorMsg(errorMessage);
    }
  };

  const handleDeleteClick = (route) => {
    setRouteToDelete(route);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URI}/api/admin/route/${routeToDelete.id}`,
        { withCredentials: true },
      );
      if (res.data.success === true) {
        showSuccessMsg("Route removed successfully!");
      } else {
        showErrorMsg(res.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsreload(!isreload);
      setIsDeleting(false);
      setShowDeleteModal(false);
      setRouteToDelete(null);
    }
  };

  const handleModalSave = async (payload, id) => {
    try {
      if (id) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URI}/api/admin/route/update`,
          { id, stops: payload.stops },
          { withCredentials: true },
        );
        showSuccessMsg("Route updated successfully!");
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URI}/api/admin/route`,
          payload,
          { withCredentials: true },
        );
        showSuccessMsg("Route created successfully!");
      }

      setIsModalOpen(false);
      setEditingRoute(null);
      setIsreload((p) => !p);
    } catch (err) {
      showErrorMsg(err.response?.data?.message || "Failed to save route");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRouteToDelete(null);
  };
  const handleAddClick = () => {
    setEditingRoute(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Route className="w-7 h-7 text-sky-600" />
            Manage Routes
          </h1>
          <p className="text-slate-600 mt-1">
            View, edit, and manage all routes in the system.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Route
        </button>
      </div>

      {isLoading ? (
        <RouteDataSkeleton count={4} />
      ) : (
        <>
          {/* Route Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {routes.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-xl shadow-sm border border-slate-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {route.route}
                    </h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {route.numberofstops} stops
                    </p>
                  </div>
                </div>

                {/* Stops Preview */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {route.stops.map((stop, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium"
                    >
                      {capitalizeFirstLetter(stop)}
                    </span>
                  ))}
                </div>

                {/* Route Stats */}
                <div className="flex gap-6 mb-4 text-sm">
                  <div>
                    <span className="text-slate-500">Distance:</span>
                    <span className="ml-1 font-semibold text-slate-700">
                      {route.distance} km
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Duration:</span>
                    <span className="ml-1 font-semibold text-slate-700">
                      {route.time} hrs
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditClick(route)}
                    className="flex-1 py-2 border border-sky-200 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit Route
                  </button>
                  <button
                    onClick={() => handleDeleteClick(route)}
                    className="flex-1 py-2 border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove Route
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!isLoading && routes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <Route className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No routes found.</p>
            </div>
          )}
        </>
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
                Remove Route
              </h3>
            </div>

            <p className="text-slate-600 mb-2">
              Are you sure you want to remove the route:
            </p>
            <p className="font-semibold text-slate-800 mb-4">
              {routeToDelete?.name}
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-6">
              <p className="text-sm text-amber-700">
                <strong>Warning:</strong> Removing this route may affect
                existing buses assigned to it. This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 disabled:bg-rose-400 transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Yes, Remove
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
      <RouteFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoute(null);
        }}
        onSave={handleModalSave}
        route={editingRoute}
      />
    </div>
  );
};

export default ManageRoutes;
