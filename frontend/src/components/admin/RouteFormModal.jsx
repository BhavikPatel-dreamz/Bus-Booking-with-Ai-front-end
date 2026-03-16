import { useState, useEffect } from 'react';
import { Route, Plus, Trash2, GripVertical, X } from 'lucide-react';

const RouteFormModal = ({ isOpen, onClose, onSave, route = null }) => {
  const isEditMode = !!route;

  const getInitialStops = () => {
    if (route?.stops?.length) {
      return route.stops.map((stop, index) => ({
        id: stop._id || index + 1,
        name: stop.name || '',
        distance: index === 0 ? 0 : stop.predistance ?? '',
        time: index === 0 ? 0 : stop.pretime ?? '',
      }));
    }

    return [
      { id: 1, name: '', distance: 0, time: 0 },
      { id: 2, name: '', distance: '', time: '' },
    ];
  };

  const [stops, setStops] = useState(getInitialStops);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

useEffect(() => {
  if (!isOpen) return;

  setStops(getInitialStops());
  setErrors({});
  setDraggedIndex(null);
}, [route, isOpen]);

  const totalDistance = stops.reduce((sum, stop, index) => {
    if (index === 0) return 0;
    return sum + (parseFloat(stop.distance) || 0);
  }, 0);

  const totalTime = stops.reduce((sum, stop, index) => {
    if (index === 0) return 0;
    return sum + (parseFloat(stop.time) || 0);
  }, 0);

  const handleStopChange = (id, field, value) => {
    setStops((prev) =>
      prev.map((stop) => (stop.id === id ? { ...stop, [field]: value } : stop))
    );
    if (errors[`stop_${id}_${field}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`stop_${id}_${field}`];
        return newErrors;
      });
    }
  };

  const addStop = () => {
    const newId = Math.max(...stops.map((s) => s.id)) + 1;
    setStops((prev) => [...prev, { id: newId, name: '', distance: '', time: '' }]);
  };

  const removeStop = (id) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((stop) => stop.id !== id));
  };

  const handleDragStart = (index) => {
    if (index === 0) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (index === 0 || draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (index) => {
    if (index === 0 || draggedIndex === null || draggedIndex === index) {
      setDraggedIndex(null);
      return;
    }
    const newStops = [...stops];
    const [draggedStop] = newStops.splice(draggedIndex, 1);
    newStops.splice(index, 0, draggedStop);
    setStops(newStops);
    setDraggedIndex(null);
  };

  const validate = () => {
    const newErrors = {};
    stops.forEach((stop, index) => {
      if (!stop.name.trim()) {
        newErrors[`stop_${stop.id}_name`] = 'Stop name is required';
      }
      if (index > 0) {
        if (stop.distance === '' || parseFloat(stop.distance) < 0) {
          newErrors[`stop_${stop.id}_distance`] = 'Valid distance required';
        }
        if (stop.time === '' || parseFloat(stop.time) < 0) {
          newErrors[`stop_${stop.id}_time`] = 'Valid time required';
        }
      }
    });
    if (stops.length < 2) {
      newErrors.general = 'At least 2 stops are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const payload = {
      stops: stops.map((stop) => ({
        name: stop.name.trim(),
        predistance: Number(stop.distance) || 0,
        pretime: Number(stop.time) || 0,
      })),
    };

    await onSave(payload, route?._id || route?.id);

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Route className="w-6 h-6 text-sky-600" />
            {isEditMode ? 'Edit Route' : 'Add New Route'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Route Summary */}
          <div className="p-4 bg-sky-50 border border-sky-100 rounded-lg">
            <h3 className="text-sm font-semibold text-sky-800 mb-2">Route Summary</h3>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-sky-600">Total Distance:</span>
                <span className="ml-2 font-bold text-sky-800">{totalDistance} km</span>
              </div>
              <div>
                <span className="text-sky-600">Total Time:</span>
                <span className="ml-2 font-bold text-sky-800">{totalTime} hrs</span>
              </div>
              <div>
                <span className="text-sky-600">Stops:</span>
                <span className="ml-2 font-bold text-sky-800">{stops.length}</span>
              </div>
            </div>
          </div>

          {/* Stops */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Stops</label>
              <button
                type="button"
                onClick={addStop}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Stop
              </button>
            </div>

            {stops.map((stop, index) => (
              <div
                key={stop.id}
                draggable={index !== 0}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={() => handleDrop(index)}
                className={`p-4 border rounded-lg transition-all ${draggedIndex === index ? 'opacity-50 border-sky-300 bg-sky-50' : 'border-slate-200'
                  } ${index === 0 ? 'bg-amber-50 border-amber-200' : 'bg-white'}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-2 ${index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 cursor-grab active:cursor-grabbing'}`}
                  >
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        {index === 0 ? 'Source' : `Stop ${index + 1}`}
                      </label>
                      <input
                        type="text"
                        value={stop.name}
                        onChange={(e) => handleStopChange(stop.id, 'name', e.target.value)}
                        placeholder="Stop name"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors[`stop_${stop.id}_name`] ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                          }`}
                      />
                      {errors[`stop_${stop.id}_name`] && (
                        <p className="mt-1 text-xs text-rose-600">{errors[`stop_${stop.id}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Distance (km)</label>
                      <input
                        type="number"
                        value={stop.distance}
                        onChange={(e) => handleStopChange(stop.id, 'distance', e.target.value)}
                        placeholder="0"
                        min="0"
                        disabled={index === 0}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${index === 0 ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                          } ${errors[`stop_${stop.id}_distance`] ? 'border-rose-300 bg-rose-50' : 'border-slate-300'}`}
                      />
                      {errors[`stop_${stop.id}_distance`] && (
                        <p className="mt-1 text-xs text-rose-600">{errors[`stop_${stop.id}_distance`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Time (hrs)</label>
                      <input
                        type="number"
                        value={stop.time}
                        onChange={(e) => handleStopChange(stop.id, 'time', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.5"
                        disabled={index === 0}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${index === 0 ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                          } ${errors[`stop_${stop.id}_time`] ? 'border-rose-300 bg-rose-50' : 'border-slate-300'}`}
                      />
                      {errors[`stop_${stop.id}_time`] && (
                        <p className="mt-1 text-xs text-rose-600">{errors[`stop_${stop.id}_time`]}</p>
                      )}
                    </div>
                  </div>

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => removeStop(stop.id)}
                      className="mt-6 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {errors.general && (
            <p className="text-sm text-rose-600 text-center">{errors.general}</p>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {isEditMode ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Route className="w-5 h-5" />
                {isEditMode ? 'Update Route' : 'Save Route'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 border border-slate-300 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RouteFormModal;
