
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Logo from './Logo';
import CookieBanner from './CookieBanner';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {!isOnline && (
        <div className="bg-red-600 text-white text-center py-2 text-xs font-black uppercase tracking-widest z-[100] animate-pulse">
          <i className="fa-solid fa-wifi-slash mr-2"></i> You are currently offline. Some features may be unavailable.
        </div>
      )}

      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
            >
              <Logo size={36} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl font-black bg-gradient-to-r from-red-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                VidSpark AI
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Home</Link>
              <Link to="/about" className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">About</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors">Contact</Link>
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all border border-gray-700 shadow-lg flex items-center gap-2"
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  Log Out
                </button>
              ) : (
                !isAuthPage && (
                   <button
                    onClick={() => navigate('/login')}
                    className="bg-brand-600 hover:bg-brand-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-brand-500/20"
                  >
                    Sign In
                  </button>
                )
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-white p-2"
              >
                <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700 animate-slideDown">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:text-white text-sm font-bold p-2">Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:text-white text-sm font-bold p-2">About Us</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-gray-300 hover:text-white text-sm font-bold p-2">Contact</Link>
              
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-400 font-bold p-2 flex items-center gap-2 border-t border-gray-700 pt-4"
                >
                  <i className="fa-solid fa-right-from-bracket"></i> Log Out
                </button>
              ) : (
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="w-full bg-brand-600 text-white p-3 rounded-xl font-bold"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-950 border-t border-gray-800 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <Logo size={32} />
                <span className="text-xl font-black text-white">VidSpark AI</span>
              </div>
              <p className="text-gray-500 font-medium leading-relaxed text-sm mb-6">
                Igniting the next generation of social media creators with intelligent, viral-ready script generation.
              </p>
              <div className="flex items-center gap-4 text-gray-600">
                <a href="https://github.com/Ashwin-Pillai-22/VidSpark-AI" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  <i className="fa-brands fa-github text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-6">Platform</h4>
              <ul className="space-y-4">
                <li><Link to="/dashboard" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Content Lab</Link></li>
                <li><Link to="/dashboard" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Library</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link to="/" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Home</Link></li>
                <li><Link to="/about" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Our Story</Link></li>
                <li><Link to="/contact" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link to="/privacy" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Terms of Service</Link></li>
                <li><Link to="/cookie-policy" className="text-gray-500 hover:text-brand-500 transition-colors text-sm font-bold">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-600 text-[13px] font-bold">
              &copy; {new Date().getFullYear()} VidSpark AI. Built with <i className="fa-solid fa-heart text-red-500 text-[10px] mx-1"></i> for creators.
            </div>
            <div className="flex items-center gap-8 text-gray-600">
               <span className="flex items-center gap-2 text-[12px] font-black uppercase tracking-widest"><i className="fa-solid fa-shield-halved text-brand-500/50"></i> Secure by Firebase</span>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
};

export default Layout;
