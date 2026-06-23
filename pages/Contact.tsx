
import React from 'react';

const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-fadeIn">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-5xl font-black text-white tracking-tighter mb-6">Get in <span className="text-brand-500">Touch</span></h1>
        <p className="text-gray-400 text-lg font-medium leading-relaxed mb-16 max-w-2xl">
          Have questions about enterprise plans, API access, or just want to share your viral success story? We're here to help.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          <div className="bg-gray-800/50 p-10 rounded-[40px] border border-white/5 flex flex-col items-center gap-6 hover:bg-gray-800 transition-all group hover:-translate-y-1 duration-300">
             <div className="w-20 h-20 rounded-3xl bg-gray-900 flex items-center justify-center text-brand-500 group-hover:scale-110 transition-transform shadow-2xl border border-white/5">
               <i className="fa-solid fa-envelope text-3xl"></i>
             </div>
             <div>
               <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Email Support</p>
               <a href="mailto:ashwin.pillai.22@gmail.com" className="text-white font-bold text-lg hover:text-brand-400 transition-colors block">ashwin.pillai.22@gmail.com</a>
             </div>
          </div>

          <a href="https://github.com/Ashwin-Pillai-22/VidSpark-AI" target="_blank" rel="noopener noreferrer" className="bg-gray-800/50 p-10 rounded-[40px] border border-white/5 flex flex-col items-center gap-6 hover:bg-gray-800 transition-all group hover:-translate-y-1 duration-300">
             <div className="w-20 h-20 rounded-3xl bg-gray-900 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-2xl border border-white/5">
               <i className="fa-brands fa-github text-3xl"></i>
             </div>
             <div>
               <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Contribute</p>
               <p className="text-white font-bold text-lg group-hover:text-brand-400 transition-colors">GitHub Repository</p>
             </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
