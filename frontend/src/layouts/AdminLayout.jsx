import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminSidebar from '../components/admin/AdminSidebar';
import MobileSidebar from '../components/admin/MobileSidebar';

const AdminLayout = () => {

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleAdminMenuClick = () => {
    setMobileSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar onAdminMenuClick={handleAdminMenuClick} />
      <MobileSidebar isOpen={mobileSidebarOpen} onClose={handleCloseSidebar} />
      <div className="flex-1 flex">

        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLayout;
