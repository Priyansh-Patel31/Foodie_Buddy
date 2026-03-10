import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-1.5 rounded-md">
                <span className="font-bold text-lg leading-none">F</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">Foodie</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Delivering happiness to your doorstep. The best food from top restaurants, fresh and fast.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors"><Github className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase text-sm">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Team</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Foodie Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase text-sm">Contact</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Help & Support</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Partner with us</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Ride with us</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4 tracking-wide uppercase text-sm">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Refund & Cancellation</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Foodie Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Made with ❤️ for food</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
