import { useState, useEffect } from 'react';
import { X, Bus, Check, Wifi, Wind, BatteryCharging } from 'lucide-react';
import AppDropdown from '../AppDropdown';

const amenitiesList = ['WiFi', 'AC', 'Charging'];

const busTypeOptions = [
  { value: 'Seating', label: 'Seating' },
  { value: 'Sleeper', label: 'Sleeper' },
];

const getAmenityIcon = (amenity) => {
  switch (amenity) {
    case 'WiFi': return <Wifi className="w-4 h-4" />;
    case 'AC': return <Wind className="w-4 h-4" />;
    case 'Charging': return <BatteryCharging className="w-4 h-4" />;
    default: return null;
  }
};

const emptyForm = {
  busName: '',
  busNumber: '',
  totalSeats: '',
  busType: 'Seating',
  basePrice: '',
  amenities: [],
};

const BusFormModal = ({ isOpen, onClose, onSave, bus = null }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!bus;

  useEffect(() => {
    if (isOpen) {
      if (bus) {
        setFormData({
          busName: bus.busName,
          busNumber: bus.busNumber,
          totalSeats: bus.totalSeats,
          busType: bus.busType,
          basePrice: bus.basePrice,
          amenities: [...bus.amenities],
        });
      } else {
        setFormData(emptyForm);
      }
      setErrors({});
    }
  }, [isOpen, bus]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validate = () => {
    const newErrors = {};

    const seats = Number(formData.totalSeats);
    const price = Number(formData.basePrice);

    // Bus number regex (CCNNCCNNNN)
    const busNumberRegex = /^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/;

    // Bus Name
    if (!formData.busName.trim()) {
      newErrors.busName = "Bus name is required";
    }

    // Bus Number
    if (!formData.busNumber.trim()) {
      newErrors.busNumber = "Bus number is required";
    } else if (!busNumberRegex.test(formData.busNumber.toUpperCase())) {
      newErrors.busNumber =
        "Format must be CCNNCCNNNN (e.g., GJ01AB1234)";
    }

    // Seats
    if (!seats || seats <= 0) {
      newErrors.totalSeats = "Valid seat count is required";
    } else {
      if (seats < 10) newErrors.totalSeats = "Minimum 10 seats required";
      if (seats > 60) newErrors.totalSeats = "Maximum 60 seats allowed";

      if (formData.busType === "Sleeper" && seats % 6 !== 0) {
        newErrors.totalSeats = "Sleeper seats must be multiple of 6";
      }

      if (formData.busType === "Seating" && seats % 5 !== 0) {
        newErrors.totalSeats = "Seating seats must be multiple of 5";
      }
    }

    // Price
    if (!price) {
      newErrors.basePrice = "Base price is required";
    } else if (price <= 0) {
      newErrors.basePrice = "Base price must be greater than 0";
    } else if (price > 50) {
      newErrors.basePrice = "Base price seems too high";
    }

    // Bus Type
    if (!formData.busType) {
      newErrors.busType = "Please select bus type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSave({
      ...formData,
      totalSeats: Number(formData.totalSeats),
      basePrice: Number(formData.basePrice),
    });
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Bus className="w-5 h-5 text-sky-600" />
              {isEditMode ? 'Edit Bus' : 'Add New Bus'}
            </h2>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
            {/* Bus Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bus Name</label>
              <input type="text" name="busName" value={formData.busName} onChange={handleChange} placeholder="Enter bus name"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors.busName ? 'border-rose-300 bg-rose-50' : 'border-slate-300'}`} />
              {errors.busName && <p className="mt-1 text-sm text-rose-600">{errors.busName}</p>}
            </div>

            {/* Bus Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bus Number</label>
              <input
                type="text"
                name="busNumber"
                value={formData.busNumber}
                onChange={handleChange}
                disabled={isEditMode}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm ${isEditMode
                  ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
                  : "border-slate-300 focus:ring-2 focus:ring-sky-500"
                  } ${errors.busNumber ? "border-rose-300 bg-rose-50" : ""}`}
              />
              {errors.busNumber && <p className="mt-1 text-sm text-rose-600">{errors.busNumber}</p>}
            </div>

            {/* Total Seats + Bus Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Total Seats</label>
                <input
                  type="number"
                  name="totalSeats"
                  value={formData.totalSeats}
                  onChange={handleChange}
                  disabled={isEditMode}
                  min="1"
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm ${isEditMode
                    ? "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200"
                    : "border-slate-300 focus:ring-2 focus:ring-sky-500"
                    } ${errors.totalSeats ? "border-rose-300 bg-rose-50" : ""}`}
                />
                {errors.totalSeats && <p className="mt-1 text-sm text-rose-600">{errors.totalSeats}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Bus Type</label>
                {isEditMode ? (
                  <input
                    type="text"
                    value={formData.busType}
                    disabled
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                  />
                ) : (
                  <AppDropdown
                    options={busTypeOptions}
                    value={formData.busType}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, busType: val }))
                    }
                    placeholder="Select bus type"
                  />
                )}
                {errors.busType && (
                  <p className="mt-1 text-sm text-rose-600">{errors.busType}</p>
                )}
              </div>
            </div>

            {/* Base Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Base Price (per KM)</label>
              <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} placeholder="e.g., 2.5" min="0" step="0.1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors.basePrice ? 'border-rose-300 bg-rose-50' : 'border-slate-300'}`} />
              {errors.basePrice && <p className="mt-1 text-sm text-rose-600">{errors.basePrice}</p>}
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amenities
              </label>

              <div className="flex flex-wrap gap-3">
                {amenitiesList.map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${isEditMode
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : formData.amenities.includes(amenity)
                          ? "bg-sky-50 border-sky-300 text-sky-700 cursor-pointer"
                          : "bg-white border-slate-300 text-slate-600 hover:border-slate-400 cursor-pointer"
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      disabled={isEditMode}
                      className="sr-only"
                    />
                    <span>{amenity}</span>
                    {formData.amenities.includes(amenity) && <Check className="w-4 h-4" />}
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSubmitting}
                className="flex-1 py-2.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 disabled:bg-sky-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</>
                ) : (
                  <><Bus className="w-4 h-4" />{isEditMode ? 'Update Bus' : 'Add Bus'}</>
                )}
              </button>
              <button type="button" onClick={onClose} className="px-5 py-2.5 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default BusFormModal;
