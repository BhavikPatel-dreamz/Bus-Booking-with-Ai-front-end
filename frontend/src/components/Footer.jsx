import { Bus } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg- border-t border-blue-200 bg-[#f3f5f7]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2 text-blue-800">
            <Bus className="h-5 w-5" />
            <span className="font-semibold select-none ">QuickBus</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-slate-700">
            <span>© {currentYear} QuickBus. All rights reserved.</span>
            <a
              href="/contact"
              className="hover:text-blue-700 transition-colors font-medium"
            >
              Contact Us
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
