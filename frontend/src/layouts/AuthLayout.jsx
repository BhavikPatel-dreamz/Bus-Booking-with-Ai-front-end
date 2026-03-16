import { Outlet, Link } from 'react-router-dom';
import { Bus } from 'lucide-react';

const AuthLayout = () => {
  return (
    // <div className="min-h-screen bg-[#1B4498] flex flex-col">
    <div className="min-h-screen auth-bg flex flex-col">
      <div className="p-6">
        <span
          className="inline-flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
        >
          <Bus className="h-8 w-8" />
          <span className="text-xl select-none font-bold tracking-tight">QuickBus</span>
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
