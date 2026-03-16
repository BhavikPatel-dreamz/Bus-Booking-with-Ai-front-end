import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import AppDropdown from "../AppDropdown";

const EmployeeFormModal = ({ isOpen, onClose, onSave, employee, existingPhones = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    role: 'driver',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = Boolean(employee);

  // Reset form when modal opens/closes or employee changes
  useEffect(() => {
    if (isOpen) {
      if (employee) {
        setFormData({
          name: employee.name,
          phone: employee.phone,
          city: employee.city,
          role: employee.role,
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          city: '',
          role: 'driver',
        });
      }
      setErrors({});
    }
  }, [isOpen, employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    } else if (existingPhones.includes(formData.phone)) {
      newErrors.phone = 'Phone number already exists';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    onSave(formData);
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-xl font-semibold text-slate-800">
            {isEditMode ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors.name ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phone <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10-digit phone number"
              maxLength={10}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors.phone ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              City <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm ${errors.city ? 'border-rose-300 bg-rose-50' : 'border-slate-300'
                }`}
            />
            {errors.city && (
              <p className="mt-1 text-xs text-rose-600">{errors.city}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role <span className="text-rose-500">*</span>
            </label>
            <AppDropdown
              options={[
                { value: "driver", label: "Driver" },
                { value: "conductor", label: "Conductor" },
              ]}
              value={formData.role}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, role: val }))
              }
              placeholder="Select role"
            />

          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
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
              {isEditMode ? 'Save Changes' : 'Add Employee'}
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

export default EmployeeFormModal;
