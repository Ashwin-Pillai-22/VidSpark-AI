
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Platform, Mood, VideoDuration } from '../types';

const SAMPLE_SCRIPTS = [
  {
    title: "The Silent Killer of Productivity",
    platform: Platform.YOUTUBE,
    mood: Mood.EDUCATIONAL,
    hook: "You're not lazy. You're just fighting a war against your own biology that you were never taught how to win.",
    visuals: "Fast-cut montage of blue light screens, ticking clocks, and high-stress office environments transitioning into a calm, focused library setting.",
    tags: ["#productivity", "#science", "#focus"]
  },
  {
    title: "3 Secrets to Viral Reels in 2025",
    platform: Platform.INSTAGRAM,
    mood: Mood.INSPIRATIONAL,
    hook: "Stop chasing trends. The algorithm doesn't care about the music you use; it cares about the 3 seconds you just wasted.",
    visuals: "Split screen showing 'Mistake' vs 'Correct' hook styles. Text overlays flashing neon colors.",
    tags: ["#creatortips", "#reels", "#viral"]
  },
  {
    title: "I Survived 7 Days in the Metaverse",
    platform: Platform.YOUTUBE,
    mood: Mood.ENTERTAINING,
    hook: "I spent 168 hours with a headset strapped to my face. My brain literally forgot what grass feels like.",
    visuals: "Cinematic drone shots of a real-world empty room vs hyper-saturated VR landscapes. High-energy glitch transitions.",
    tags: ["#metaverse", "#challenge", "#7days"]
  }
];

const FAQS = [
  {
    question: "How does the AI ensure the scripts go viral?",
    answer: "Our engine is trained on high-retention data patterns. It prioritizes the '3-second hook' and 'information density' markers that platforms like YouTube and Instagram use to promote content to wider audiences."
  },
  {
    question: "Can I use these scripts for commercial brand deals?",
    answer: "Absolutely. Once generated, the scripts are yours to adapt, edit, and film. They provide a professional framework that saves hours of drafting time."
  },
  {
    question: "What makes the 'Deep Dive' format different?",
    answer: "Unlike basic AI summaries, our 'Deep Dive' mode targets 4500+ words with a multi-chapter structure, cinematic directives, and logical flow designed for long-form video essays and masterclasses."
  },
  {
    question: "Do I need technical skills to use VidSpark AI?",
    answer: "None at all. Just enter your topic, choose your vibe, and our AI acts as your world-class head writer and creative director."
  }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <div className="bg-gray-900 min-h-screen text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-brand-500 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-black uppercase tracking-[0.3em] text-brand-400 mb-8 animate-fadeIn">
            <i className="fa-solid fa-bolt-lightning"></i> AI-Powered Creator Suite
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] animate-slideUp">
            IGNITE YOUR <br />
            <span className="bg-gradient-to-r from-red-500 via-brand-500 to-purple-600 bg-clip-text text-transparent">VIRAL SPARK</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl font-medium mb-12 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Generate high-retention video scripts, aggressive viral hooks, and cinematic visual directives in seconds. Built for the modern creator economy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={() => navigate('/signup')}
              className="group relative px-10 py-5 bg-brand-600 hover:bg-brand-500 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-brand-500/20 hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Start Creating Free</span>
              <i className="fa-solid fa-chevron-right relative z-10 group-hover:translate-x-1 transition-transform"></i>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Samples Showcase */}
      <section className="py-24 bg-gray-950/50 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <h2 className="text-4xl font-black tracking-tight text-white mb-4">Viral Blueprint Samples</h2>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">A glimpse into the intelligence of our generation engine</p>
            </div>
            <div className="flex gap-4">
               <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20"><i className="fa-brands fa-youtube"></i></div>
               <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500 border border-pink-500/20"><i className="fa-brands fa-instagram"></i></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SAMPLE_SCRIPTS.map((sample, idx) => (
              <div key={idx} className="bg-gray-800/40 border border-white/5 p-8 rounded-[40px] hover:bg-gray-800/60 transition-all group hover:translate-y-[-8px] duration-500">
                <div className="flex items-center justify-between mb-6">
                   <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg text-gray-400">{sample.platform}</span>
                   <i className="fa-solid fa-sparkles text-brand-500/30 group-hover:text-brand-500 transition-colors"></i>
                </div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-brand-400 transition-colors leading-tight">{sample.title}</h3>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5 mb-6">
                  <span className="text-[9px] font-black text-brand-500 uppercase tracking-widest block mb-2">The Hook</span>
                  <p className="text-sm italic text-gray-300 leading-relaxed">"{sample.hook}"</p>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-8 line-clamp-3">
                  {sample.visuals}
                </p>
                <div className="flex flex-wrap gap-2">
                  {sample.tags.map(t => <span key={t} className="text-[10px] font-bold text-gray-600">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
             <button onClick={() => navigate('/signup')} className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white transition-colors">
               Explore thousands more ideas <i className="fa-solid fa-arrow-right ml-2 text-brand-500"></i>
             </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black tracking-tighter text-white mb-6">Frequently Asked <span className="text-brand-500">Curiosities</span></h2>
            <p className="text-gray-400 font-medium">Everything you need to know about scaling your content with VidSpark AI.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className={`group cursor-pointer rounded-3xl border transition-all duration-300 ${activeFaq === idx ? 'bg-gray-800/80 border-brand-500/30' : 'bg-gray-800/30 border-white/5 hover:border-white/10'}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="p-8 flex items-center justify-between">
                  <h3 className={`text-lg font-black transition-colors ${activeFaq === idx ? 'text-brand-400' : 'text-white group-hover:text-brand-500'}`}>
                    {faq.question}
                  </h3>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${activeFaq === idx ? 'bg-brand-500 text-white rotate-180' : 'bg-white/5 text-gray-500'}`}>
                    <i className="fa-solid fa-chevron-down text-xs"></i>
                  </div>
                </div>
                {activeFaq === idx && (
                  <div className="px-8 pb-8 animate-fadeIn">
                    <p className="text-gray-400 font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-brand-600 to-indigo-900 rounded-[64px] p-12 md:p-24 text-center relative overflow-hidden shadow-[0_0_100px_rgba(14,165,233,0.15)]">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            <div className="relative z-10">
              <Logo size={80} className="mx-auto mb-10 filter brightness-0 invert opacity-50" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-10">READY TO GO VIRAL?</h2>
              <p className="max-w-xl mx-auto text-white/70 text-lg font-medium mb-12">
                Join 10,000+ creators who have optimized their workflow and doubled their retention rates with VidSpark AI.
              </p>
              <button 
                onClick={() => navigate('/signup')}
                className="px-12 py-6 bg-white text-brand-600 rounded-2xl font-black text-xl hover:bg-gray-100 transition-all shadow-2xl active:scale-95"
              >
                Spark Your First Script
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
