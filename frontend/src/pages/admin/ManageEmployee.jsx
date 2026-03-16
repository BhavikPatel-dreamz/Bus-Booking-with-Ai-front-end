import { useState, useEffect } from "react";
import { Users, Plus, Search } from "lucide-react";
import EmployeeCard from "../../components/admin/EmployeeCard";
import EmployeeFormModal from "../../components/admin/EmployeeFormModal";
import { EmployeeDataSkeleton } from "../../components/skeletons";
import { useToast } from "../../components/toast/ToastContext";
import axios from "axios";
import AppDropdown from "../../components/AppDropdown";

const ManageEmployee = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const { showToast } = useToast();
  
  const showErrorMsg = (msg) => {
    showToast({ type: "error", message: msg });
  };

  // Simulate API loading
  useEffect(() => {
    const getEmployee = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URI}/api/emp/getemps`,
          { withCredentials: true },
        );
        setEmployees(
          response.data.emps.map((emp) => ({
            id: emp._id,
            name: emp.name,
            phone: emp.phone,
            city: emp.city,
            role: emp.role,
          })),
        );
      } catch (error) {
        const errorMessage = error.response.data.message || error.message;
        showErrorMsg(`${errorMessage}`);
      } finally {
        setIsLoading(false);
      }
    };
    getEmployee();
  }, []);
  // Filter employees based on search and role
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery);
    const matchesRole = roleFilter === "all" || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });
 
  // Handle Add
  const handleAddClick = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  // Handle Edit
  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };
  // Handle Save (Add or Edit)
  const handleSave = async (formData) => {
    if (editingEmployee) {
      const payload = {
        name: formData.name,
        _id: editingEmployee.id,
        role: formData.role,
        city: formData.city,
        phone: formData.phone,
      };
      
      try {
        await axios.put(
          `${import.meta.env.VITE_BASE_URI}/api/emp/update`,
          payload,
          { withCredentials: true },
        );
        // Update existing employee
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === editingEmployee.id ? { ...emp, ...formData } : emp,
          ),
        );
      } catch (error) {
        const errorMessage = error.response.data.message || error.message;
        showErrorMsg(`${errorMessage}`);
      } finally {
        setIsModalOpen(false);
        setEditingEmployee(null);
      }
    } else {
      const payload = {
        name: formData.name,
        role: formData.role,
        phone: formData.phone,
        city: formData.city,
      };
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URI}/api/emp/create`,
          payload,
          { withCredentials: true },
        );
        // Add new employee
        const newEmployee = {
          id:res.data.emp._id,
          ...formData,
        };
        setEmployees((prev) => [newEmployee, ...prev]);
      } catch (error) {
        const errorMessage = error.response.data.message || error.message;
        showErrorMsg(`${errorMessage}`);
      } finally {
        setIsModalOpen(false);
      }
    }
  };

  // Handle Delete
  const handleDeleteClick = (employeeId) => {
    setShowDeleteConfirm(employeeId);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URI}/api/emp/delete/${showDeleteConfirm}`,
        { withCredentials: true },
      );
      setEmployees((prev) =>
        prev.filter((emp) => emp.id !== showDeleteConfirm),
      );
    } catch (error) {
      const errorMessage = error.response.data.message || error.message;
      showErrorMsg(`${errorMessage}`);
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-sky-600" />
            Manage Employees
          </h1>
          <p className="text-slate-600 mt-1">
            View, add, and manage drivers and conductors.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
            />
          </div>
          {/* Role Filter */}
          <div className="sm:w-48">
            <AppDropdown
              options={[
                { value: "all", label: "All Roles" },
                { value: "driver", label: "Driver" },
                { value: "conductor", label: "Conductor" },
              ]}
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              placeholder="All Roles"
            />
          </div>
        </div>
      </div>

      {/* Employee List */}
      {isLoading ? (
        <EmployeeDataSkeleton count={6} />
      ) : (
        <>
          {filteredEmployees.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <EmployeeCard
                  key={employee.id}
                  employee={employee}
                  onEdit={() => handleEditClick(employee)}
                  onDelete={() => handleDeleteClick(employee.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">
                No employees found matching your criteria.
              </p>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSave}
        employee={editingEmployee}
        existingPhones={employees
          .filter((e) => e.id !== editingEmployee?.id)
          .map((e) => e.phone)}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              Delete Employee?
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              This employee will be permanently removed. This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors"
              >
                Yes, Delete
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEmployee;
