import { Pencil, Trash2, Phone, MapPin } from 'lucide-react';

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const { name, phone, city, role } = employee;

  const roleBadgeStyles = {
    driver: 'bg-sky-100 text-sky-700',
    conductor: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-md transition-shadow">
      {/* Header with Name and Role Badge */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">{name}</h3>
          <span
            className={`inline-block mt-1.5 px-3 py-1 rounded-full text-xs font-medium capitalize ${
              roleBadgeStyles[role] || 'bg-slate-100 text-slate-600'
            }`}
          >
            {role}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-600">
          <Phone className="w-4 h-4 text-slate-400" />
          <span className="text-sm">{phone}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm">{city}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-slate-100">
        <button
          onClick={onEdit}
          className="flex-1 py-2 border border-sky-200 text-sky-600 font-medium rounded-lg hover:bg-sky-50 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="py-2 px-4 border border-rose-200 text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
