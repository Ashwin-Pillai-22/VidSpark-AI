import React from 'react';
// Fix: Removed .tsx extension from the import path to align with standard TypeScript module resolution
import Logo from '../components/Logo';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 animate-fadeIn">
      <div className="text-center mb-16">
        <Logo size={80} className="mx-auto mb-8" />
        <h1 className="text-5xl font-black text-white tracking-tighter mb-4">The Future of <span className="text-brand-500">Video Content</span></h1>
        <p className="text-xl text-gray-400 font-medium">Empowering creators with the world's most advanced AI scriptwriter.</p>
      </div>

      <div className="space-y-12">
        <section className="bg-gray-800/50 p-10 rounded-[48px] border border-white/5 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <i className="fa-solid fa-rocket text-brand-500"></i> Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed font-medium text-lg">
            VidSpark AI was born out of a simple problem: Creator's Block. We believe that every great video starts with a spark, but turning that spark into a viral script shouldn't take days of research and drafting. Our platform uses Gemini 3 Flash and Pro models to bridge the gap between idea and production.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 p-10 rounded-[40px] border border-white/5">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 text-xl">
              <i className="fa-solid fa-brain"></i>
            </div>
            <h3 className="text-xl font-black text-white mb-4">Intelligent Reasoning</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              We leverage the latest LLMs to understand nuance, humor, and retention strategies specific to modern social platforms like YouTube and Instagram.
            </p>
          </div>
          <div className="bg-gray-800/50 p-10 rounded-[40px] border border-white/5">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 mb-6 text-xl">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3 className="text-xl font-black text-white mb-4">Lightning Speed</h3>
            <p className="text-gray-400 leading-relaxed font-medium">
              Generate 5,000+ word scripts in seconds. Our infrastructure is optimized for performance, ensuring your creative flow is never interrupted.
            </p>
          </div>
        </div>

        <section className="text-center py-12">
           <h2 className="text-2xl font-black text-white mb-6">Built for the Next Generation of Media</h2>
           <p className="text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
             Whether you're a solo YouTuber or a massive media agency, VidSpark AI scales with your ambition.
           </p>
           <div className="flex justify-center gap-8 opacity-40">
              <i className="fa-brands fa-youtube text-4xl"></i>
              <i className="fa-brands fa-instagram text-4xl"></i>
              <i className="fa-brands fa-tiktok text-4xl"></i>
           </div>
        </section>
      </div>
    </div>
  );
};

export default About;