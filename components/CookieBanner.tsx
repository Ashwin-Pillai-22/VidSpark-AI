
import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-slideUp">
      <div className="max-w-4xl mx-auto bg-gray-800/90 backdrop-blur-2xl border border-white/10 p-6 rounded-[32px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/20 flex items-center justify-center flex-shrink-0 text-brand-400">
            <i className="fa-solid fa-cookie-bite text-2xl"></i>
          </div>
          <div>
            <h4 className="text-white font-black text-lg tracking-tight">Cookie Notice</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              We use cookies to enhance your creative experience, analyze traffic, and ensure secure authentication with Firebase. By continuing to use VidSpark AI, you agree to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={acceptCookies}
            className="flex-grow md:flex-none bg-white text-black px-8 py-3 rounded-2xl font-black text-sm hover:bg-brand-500 hover:text-white transition-all shadow-xl active:scale-95"
          >
            Accept All
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="flex-grow md:flex-none bg-gray-700 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-gray-600 transition-all border border-white/5"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
