import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Bus, Route, ClipboardList, Plus, Settings,Mail,Navigation,BarChart3,Users } from 'lucide-react';

const AdminSidebar = () => {
  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/bookings', icon: ClipboardList, label: 'View All Bookings' },
    { to: '/admin/manage-trips', icon: Navigation, label: 'Manage Trip' },
    { to: '/admin/manage-buses', icon: Bus, label: 'Manage Buses' },
    { to: '/admin/manage-routes', icon: Route, label: 'Manage Routes' },
    { to: '/admin/manage-employees', icon: Users, label: 'Manage Employees' },
    { to: '/admin/contact-requests', icon: Mail, label: 'Contact Requests' },
    { to: '/admin/reports', icon: BarChart3, label: 'Reports & Analytics' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-136px)] hidden lg:block">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Admin Navigation
        </h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border-l-4 border-sky-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
