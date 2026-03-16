import { useState, useEffect, useMemo } from 'react';
import { X, Save, Route as RouteIcon } from 'lucide-react';
import AppDropdown from '../AppDropdown';
import EmployeeSearchDropdown from './EmployeeSearchDropdown';
import axios from 'axios';

const convertTo12Hour = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  let hours12 = hours % 12;
  if (hours12 === 0) hours12 = 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const convertTo24Hour = (time12) => {
  if (!time12) return '';
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;
  let [, hours, minutes, period] = match;
  hours = parseInt(hours, 10);
  if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const DAYS_OF_WEEK = [
  { index: 0, short: 'Sun' }, { index: 1, short: 'Mon' }, { index: 2, short: 'Tue' },
  { index: 3, short: 'Wed' }, { index: 4, short: 'Thu' }, { index: 5, short: 'Fri' }, { index: 6, short: 'Sat' },
];


const TripFormModal = ({ isOpen, onClose, onSave, trip }) => {
  const isEditMode = Boolean(trip);
  const BASE = import.meta.env.VITE_BASE_URI;

  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [conductors, setConductors] = useState([]);

  const [formData, setFormData] = useState({
    routeId: '',
    busId: '',
    driverId: '',
    conductorId: '',
    departureTime: '',
    operatingDays: [],
    minimumRevenue: '',
  });
  const [timeInput, setTimeInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const getRoutes = async () => {
      try {
        const res = await axios.get(`${BASE}/api/admin/route/get`, { withCredentials: true });
        setRoutes(res.data.routeInfo);
      } catch (err) {

      }
    };

    getRoutes();
  }, [isOpen]);

  const fetchFilters = async (routeId, departureTime, days) => {
    try {
      const payload = { routeId, departureTime, days, tripId: trip?.tripId };

      const [busRes, driverRes, conductorRes] = await Promise.all([
        axios.post(`${BASE}/api/trip/filterbus`, payload, { withCredentials: true }),
        axios.post(`${BASE}/api/trip/filteremp`, { ...payload, role: "driver" }, { withCredentials: true }),
        axios.post(`${BASE}/api/trip/filteremp`, { ...payload, role: "conductor" }, { withCredentials: true }),
      ]);

      setBuses(
        (busRes.data.buses || []).map(bus => ({
          id: bus.busId,   // ⭐ must be id
          name: `${bus.name} (${bus.busnumber})`,
        }))
      );
      setDrivers(
        (driverRes.data.employees || []).map(emp => ({
          id: String(emp.empId),    // ⭐ id
          name: emp.empname, // ⭐ name
          phone: emp.phone,
          city: emp.empcity,
          role: emp.emprole,
        }))
      );

      setConductors(
        (conductorRes.data.employees || []).map(emp => ({
          id: String(emp.empId),
          name: emp.empname,
          phone: emp.phone,
          city: emp.empcity,
          role: emp.emprole,
        }))
      );
    } catch (err) {

    }
  };

  useEffect(() => {
    if (
      !formData.routeId ||
      !formData.departureTime ||
      formData.operatingDays.length === 0
    ) return;

    fetchFilters(formData.routeId, formData.departureTime, formData.operatingDays);
  }, [formData.routeId, formData.departureTime, formData.operatingDays]);

  useEffect(() => {
    if (!isOpen) return;

    if (trip) {
      setFormData({
        routeId: String(trip.routeId),
        driverId: String(trip.driver),
        conductorId: String(trip.conductor),
        busId: String(trip.busId),
        departureTime: trip.departureTime,
        operatingDays: [...trip.days],
        minimumRevenue: String(trip.minimumRevenue),
      });

      setTimeInput(convertTo24Hour(trip.departureTime));

      // 🔥 IMPORTANT — trigger filters immediately
      fetchFilters(
        String(trip.routeId),
        trip.departureTime,
        [...trip.days]
      );

    } else {
      setFormData({
        routeId: '',
        busId: '',
        driverId: '',
        conductorId: '',
        departureTime: '',
        operatingDays: [],
        minimumRevenue: '',
      });
      setTimeInput('');
    }

    setErrors({});
  }, [isOpen, trip]);

  const handleTimeChange = (e) => {
    setTimeInput(e.target.value);
    setFormData((prev) => ({ ...prev, departureTime: convertTo12Hour(e.target.value) }));
    if (errors.departureTime) setErrors((prev) => ({ ...prev, departureTime: '' }));
  };

  const handleDayToggle = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      operatingDays: prev.operatingDays.includes(dayIndex)
        ? prev.operatingDays.filter((d) => d !== dayIndex)
        : [...prev.operatingDays, dayIndex].sort((a, b) => a - b),
    }));
    if (errors.operatingDays) setErrors((prev) => ({ ...prev, operatingDays: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.routeId) newErrors.routeId = 'Please select a route';
    if (!formData.busId) newErrors.busId = 'Please select a bus';
    if (!formData.driverId) newErrors.driverId = 'Please select a driver';
    if (!formData.conductorId) newErrors.conductorId = 'Please select a conductor';
    if (!formData.departureTime) newErrors.departureTime = 'Departure time is required';
    if (formData.operatingDays.length === 0) newErrors.operatingDays = 'At least one operating day must be selected';
    if (!formData.minimumRevenue || parseFloat(formData.minimumRevenue) <= 0) {
      newErrors.minimumRevenue = 'Valid minimum revenue is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      routeId: formData.routeId,
      busId: formData.busId,
      departureTime: formData.departureTime,
      minimumRevenue: formData.minimumRevenue,
      days: formData.operatingDays,
      driverId: formData.driverId,
      conductorId: formData.conductorId,
    };

    try {
      setIsSubmitting(true);

      if (trip) {
        await axios.put(`${BASE}/api/trip/update`, {
          ...payload,
          tripId: trip.tripId,
        }, { withCredentials: true });

        onSave("edit");
      } else {
        await axios.post(`${BASE}/api/trip/`, payload, { withCredentials: true });

        onSave("add");
      }
    } catch (err) {
      onSave("error", err?.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const setField = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-sky-600" />
            {isEditMode ? 'Edit Trip' : 'Add New Trip'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form - scrollable */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* Operating Days */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Operating Days <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.index}
                  type="button"
                  onClick={() => handleDayToggle(day.index)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${formData.operatingDays.includes(day.index)
                    ? 'bg-sky-600 border-sky-600 text-white'
                    : 'bg-white border-slate-300 text-slate-600 hover:border-slate-400'
                    }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            {errors.operatingDays && <p className="mt-2 text-xs text-rose-600">{errors.operatingDays}</p>}
          </div>
          {/* Route & Time in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Route <span className="text-rose-500">*</span>
              </label>
              <AppDropdown
                options={routes.map(r => ({
                  value: String(r.id),
                  label: r.route
                }))}
                value={formData.routeId}
                onChange={(val) => !isEditMode && setField('routeId', val)}
                placeholder="Select a route"
                hasError={!!errors.routeId}
                searchable={!isEditMode}
                disabled={isEditMode}
              />
              {errors.routeId && <p className="mt-1 text-xs text-rose-600">{errors.routeId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Departure Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={timeInput}
                onChange={handleTimeChange}
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors.departureTime ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                  }`}
              />
              {/* {formData.departureTime && (
                <p className="mt-1 text-xs text-slate-500">Formatted: {formData.departureTime}</p>
              )} */}
              {errors.departureTime && <p className="mt-1 text-xs text-rose-600">{errors.departureTime}</p>}
            </div>
          </div>


          {/* Bus & Revenue in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bus <span className="text-rose-500">*</span>
              </label>
              <AppDropdown
                options={buses.map(b => ({
                  value: String(b.id),
                  label: b.name
                }))}
                value={formData.busId}
                onChange={(val) => setField('busId', val)}
                placeholder="Select a bus"
                hasError={!!errors.busId}
                searchable
              />
              {errors.busId && <p className="mt-1 text-xs text-rose-600">{errors.busId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Minimum Revenue (₹) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                value={formData.minimumRevenue}
                onChange={(e) => setField('minimumRevenue', e.target.value)}
                placeholder="e.g., 5000"
                min="1"
                step="1"
                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors.minimumRevenue ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                  }`}
              />
              {errors.minimumRevenue && <p className="mt-1 text-xs text-rose-600">{errors.minimumRevenue}</p>}
            </div>
          </div>

          {/* Driver & Conductor in 2 cols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EmployeeSearchDropdown
              label="Driver"
              employees={drivers}
              value={formData.driverId}
              onChange={(id) => setField('driverId', id)}
              placeholder="Search and select a driver..."
              emptyMessage="No drivers available"
              hasError={!!errors.driverId}
              errorMessage={errors.driverId}
            />
            <EmployeeSearchDropdown
              label="Conductor"
              employees={conductors}
              value={formData.conductorId}
              onChange={(id) => setField('conductorId', id)}
              placeholder="Search and select a conductor..."
              emptyMessage="No conductors available"
              hasError={!!errors.conductorId}
              errorMessage={errors.conductorId}
            />
          </div>



          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 disabled:bg-sky-400 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isEditMode ? 'Save Changes' : 'Add Trip'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { DAYS_OF_WEEK };
export default TripFormModal;
