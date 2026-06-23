
import React, { useState, useMemo } from 'react';
import { VideoIdea, Platform } from '../types';

interface IdeaCardProps {
  idea: VideoIdea;
  isSaved?: boolean;
  onToggleSave?: (idea: VideoIdea) => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea, isSaved = false, onToggleSave }) => {
  const [showScript, setShowScript] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isYoutube = idea.platform === Platform.YOUTUBE;

  const copyToClipboard = () => {
    const text = `
Title: ${idea.title}
Hook: ${idea.hook}
Visuals: ${idea.visuals}
Script: ${idea.script}
Hashtags: ${idea.hashtags}
    `.trim();
    
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const scriptLines = useMemo(() => idea.script.split('\n'), [idea.script]);

  const chapters = useMemo(() => {
    return scriptLines
      .filter(line => line.trim().toUpperCase().startsWith('CHAPTER:'))
      .map(line => line.trim().replace(/^chapter:\s*/i, ''));
  }, [scriptLines]);

  // Helper to render distinct badges for inline tags
  const renderTag = (type: 'sfx' | 'meme' | 'visual' | 'action', content: string) => {
    const styles = {
      sfx: "text-amber-400 bg-amber-500/10 border-amber-500/30 ring-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
      meme: "text-pink-400 bg-pink-500/10 border-pink-500/30 ring-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.1)]",
      visual: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30 ring-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
      action: "text-indigo-300 bg-indigo-500/10 border-indigo-500/30 ring-indigo-500/20"
    };

    const icons = {
      sfx: "fa-volume-high",
      meme: "fa-face-laugh-squint",
      visual: "fa-eye",
      action: "fa-clapperboard"
    };

    return (
      <span className={`inline-flex items-center gap-2 font-black px-3 py-1.5 rounded-lg border text-[11px] mx-1 uppercase tracking-wider align-middle shadow-lg ring-1 transition-transform hover:scale-105 select-none ${styles[type]}`}>
        <i className={`fa-solid ${icons[type]} text-[10px] opacity-90`}></i>
        {content}
      </span>
    );
  };

  const parseInlineTags = (text: string) => {
    // Regex matches [SFX:...], [Meme:...], [Visual:...], and (...)
    const parts = text.split(/(\[(?:sfx|meme|visual).*?\]|\(.*?\))/gi);
    
    return parts.map((part, j) => {
      const lower = part.toLowerCase();
      const cleanContent = part.replace(/[\[\]\(\)]/g, '').replace(/^(sfx|meme|visual|action):?\s*/i, '').trim();
      
      if (!cleanContent) return <span key={j}>{part}</span>;

      if (lower.startsWith('[sfx')) return <React.Fragment key={j}>{renderTag('sfx', cleanContent)}</React.Fragment>;
      if (lower.startsWith('[meme')) return <React.Fragment key={j}>{renderTag('meme', cleanContent)}</React.Fragment>;
      if (lower.startsWith('[visual')) return <React.Fragment key={j}>{renderTag('visual', cleanContent)}</React.Fragment>;
      
      // Standard parentheses actions (visual directives inside dialogue)
      if (lower.startsWith('(') && lower.endsWith(')')) {
        return <React.Fragment key={j}>{renderTag('action', cleanContent)}</React.Fragment>;
      }
      
      return <span key={j}>{part}</span>;
    });
  };

  let chapterCounter = 0;

  const renderScriptLine = (line: string, i: number) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} className="h-6" />;

    // --- 1. CHAPTER MARKERS ---
    if (trimmed.toUpperCase().startsWith('CHAPTER:') || (trimmed.startsWith('#') && trimmed.length < 50)) {
        chapterCounter++;
        const title = trimmed.replace(/^chapter:\s*/i, '').replace(/^#\s*/, '');
        return (
            <div key={i} id={`chapter-${chapterCounter}`} className="mt-28 mb-16 relative group/chapter">
                <div className="flex items-end gap-6 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-brand-500/20 group-hover/chapter:scale-110 transition-transform duration-500 border border-white/20">
                       <span className="text-3xl font-black">{chapterCounter}</span>
                    </div>
                  </div>
                  
                  <div className="flex-grow pb-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-xs font-black uppercase tracking-[0.5em] text-brand-500/80">Scene Segment</span>
                       <div className="h-px flex-grow bg-white/10"></div>
                    </div>
                    <h4 className="text-4xl font-black text-white uppercase tracking-tighter leading-none group-hover/chapter:text-brand-400 transition-colors">
                      {title}
                    </h4>
                  </div>
                </div>
                <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
                   <div className="h-full w-1/3 bg-gradient-to-r from-brand-500 to-transparent group-hover/chapter:w-full transition-all duration-1000"></div>
                </div>
            </div>
        );
    }

    // --- 2. STANDALONE VISUAL/SFX BLOCKS (Square Brackets on their own line) ---
    // If a line is JUST a bracketed instruction, render it as a distinct center block
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
       const clean = trimmed.replace(/[\[\]]/g, '');
       let icon = "fa-video";
       let colorClass = "text-gray-400 border-gray-700";
       let bgClass = "bg-gray-800/50";
       
       if (clean.toLowerCase().includes('sfx')) { 
         icon = "fa-volume-high"; 
         colorClass = "text-amber-400 border-amber-500/30"; 
         bgClass = "bg-amber-500/10";
       }
       else if (clean.toLowerCase().includes('meme')) { 
         icon = "fa-face-laugh-squint"; 
         colorClass = "text-pink-400 border-pink-500/30"; 
         bgClass = "bg-pink-500/10";
       }
       
       return (
         <div key={i} className={`my-10 flex justify-center`}>
            <div className={`px-8 py-4 rounded-3xl border-2 ${colorClass} ${bgClass} backdrop-blur-sm flex items-center gap-4 shadow-xl transform hover:scale-105 transition-transform`}>
               <i className={`fa-solid ${icon} text-lg`}></i>
               <span className="text-sm font-black uppercase tracking-widest">{clean.replace(/^(sfx|meme):?\s*/i, '')}</span>
            </div>
         </div>
       );
    }

    // --- 3. STANDALONE ACTION BLOCKS (Parentheses on their own line) ---
    if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
      return (
        <div key={i} className="my-8 p-6 bg-indigo-950/20 border-l-4 border-indigo-500 rounded-r-3xl flex items-start gap-5 shadow-xl transition-all hover:bg-indigo-950/30 group/vis">
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover/vis:scale-110 transition-transform mt-0.5">
             <i className="fa-solid fa-clapperboard text-indigo-400 text-lg"></i>
          </div>
          <p className="italic text-indigo-100 text-[17px] font-bold tracking-wide leading-relaxed">
            {parseInlineTags(trimmed.replace(/[\(\)]/g, ''))}
          </p>
        </div>
      );
    }

    // --- 4. DIALOGUE BLOCKS (Speaker: Content) ---
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex > 0 && colonIndex < 25 && !trimmed.startsWith('[')) {
      const speaker = trimmed.substring(0, colonIndex);
      const content = trimmed.substring(colonIndex + 1);
      
      return (
        <div key={i} className="mb-10 bg-white/[0.03] border border-white/[0.08] p-8 rounded-[32px] rounded-tl-sm relative hover:bg-white/[0.05] transition-all shadow-inner group/dialog">
          <div className="flex items-center justify-between mb-4">
             <div className="text-xs font-black uppercase tracking-[0.25em] text-brand-400 flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-brand-500 shadow-[0_0_12px_rgba(14,165,233,0.8)] group-hover/dialog:scale-125 transition-transform"></div>
               {speaker}
             </div>
             <i className="fa-solid fa-microphone-lines text-xs text-white/20 group-hover/dialog:text-brand-500/40 transition-colors"></i>
          </div>
          <div className="text-white text-xl leading-relaxed font-medium tracking-wide pl-4 border-l-2 border-brand-500/20">
            {parseInlineTags(content)}
          </div>
        </div>
      );
    }

    // --- 5. GENERIC TEXT FALLBACK ---
    return (
      <div key={i} className="mb-8 text-gray-200 text-lg leading-relaxed px-6 font-medium border-l-2 border-transparent hover:border-gray-700/50 transition-colors">
        {parseInlineTags(trimmed)}
      </div>
    );
  };

  return (
    <div className={`bg-gray-800 rounded-[48px] overflow-hidden border border-gray-700 shadow-2xl hover:shadow-brand-500/10 transition-all duration-700 flex flex-col group relative ${showScript ? 'md:col-span-2' : ''}`}>
      <div className={`h-3 w-full ${isYoutube ? 'bg-gradient-to-r from-red-600 to-red-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'} transition-all group-hover:h-4`} />
      
      <div className="p-8 lg:p-10 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center bg-gray-900 text-2xl shadow-inner border border-white/5 transform transition-all group-hover:rotate-6 group-hover:scale-110 ${isYoutube ? 'text-red-400' : 'text-pink-400'}`}>
              <i className={`fa-brands ${isYoutube ? 'fa-youtube' : 'fa-instagram'}`}></i>
            </div>
            <div>
              <span className="text-[12px] font-black text-gray-500 uppercase tracking-[0.3em]">{idea.platform}</span>
              <div className="text-[13px] font-bold text-gray-400 mt-1.5 flex items-center gap-2">
                <i className="fa-solid fa-calendar-day opacity-30"></i>
                {new Date(idea.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>

          {onToggleSave && (
            <button 
              onClick={() => onToggleSave(idea)}
              className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 active:scale-90 ${isSaved ? 'text-yellow-400 bg-yellow-400/15 border border-yellow-400/30 shadow-[0_0_20px_rgba(250,204,21,0.1)]' : 'text-gray-500 hover:text-white bg-gray-700/50 border border-transparent'}`}
            >
              <i className={`fa-solid fa-bookmark text-xl ${isSaved ? '' : 'fa-regular'}`}></i>
            </button>
          )}
        </div>

        <h3 className="text-4xl font-black text-white mb-8 leading-[1.05] group-hover:text-brand-400 transition-colors tracking-tighter">
          {idea.title}
        </h3>

        <div className="bg-gray-900/60 p-8 rounded-[40px] border border-white/[0.05] mb-10 shadow-inner relative overflow-hidden group/hook">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/hook:opacity-20 transition-opacity">
                <i className="fa-solid fa-quote-right text-6xl text-brand-500"></i>
            </div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-2 h-5 bg-brand-500 rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)]"></div>
               <span className="text-[13px] font-black text-brand-500 uppercase tracking-[0.25em]">Viral Hook</span>
            </div>
            <p className="italic text-gray-100 text-xl leading-relaxed font-black tracking-tight drop-shadow-sm">"{idea.hook}"</p>
        </div>

        <div className="mb-10 px-2">
            <div className="flex items-center gap-3 mb-4">
                <i className="fa-solid fa-wand-magic-sparkles text-gray-500 text-sm"></i>
                <span className="text-[12px] font-black text-gray-500 uppercase tracking-[0.25em] opacity-80">Director's Directive</span>
            </div>
            <p className="text-gray-300 text-[16px] leading-relaxed font-semibold pl-4 border-l-2 border-brand-500/20 ml-1">{idea.visuals}</p>
        </div>

        <div className="mt-auto">
            <button 
                onClick={() => setShowScript(!showScript)}
                className={`w-full flex items-center justify-between px-10 py-6 rounded-[32px] text-lg font-black transition-all border shadow-2xl ${showScript ? 'bg-brand-600 border-brand-400 text-white translate-y-[-4px]' : 'bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:bg-gray-750 hover:scale-[1.02]'}`}
            >
                <span className="flex items-center gap-5">
                  <i className={`fa-solid ${showScript ? 'fa-eye-slash' : 'fa-clapperboard'} text-2xl`}></i> 
                  {showScript ? 'Close Teleprompter' : 'Access Full Script'}
                </span>
                <i className={`fa-solid fa-chevron-${showScript ? 'up' : 'down'} text-sm transition-transform duration-300 ${showScript ? 'rotate-180' : ''}`}></i>
            </button>
            
            {showScript && (
                <div className="mt-8 p-6 lg:p-12 bg-black/60 rounded-[48px] border border-white/10 text-sm text-gray-300 max-h-[800px] overflow-y-auto custom-scrollbar shadow-inner animate-slideDown scroll-smooth border-b-8 border-b-brand-500/20 relative">
                    
                    {chapters.length > 0 && (
                      <div className="mb-12 bg-gray-900/80 backdrop-blur-md p-8 rounded-[32px] border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-3 mb-6">
                           <i className="fa-solid fa-list-ul text-brand-500"></i>
                           <span className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-500">Table of Contents</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                          {chapters.map((title, idx) => (
                            <a 
                              key={idx} 
                              href={`#chapter-${idx + 1}`}
                              className="group/toc flex items-center gap-3 text-gray-400 hover:text-white transition-all py-1"
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(`chapter-${idx + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }}
                            >
                              <span className="w-5 h-5 flex items-center justify-center rounded-lg bg-white/5 text-[10px] font-black group-hover/toc:bg-brand-600 transition-colors">{idx + 1}</span>
                              <span className="text-sm font-bold truncate group-hover/toc:translate-x-1 transition-transform">{title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-8 flex items-center justify-center">
                        <span className="px-5 py-2 bg-brand-500/10 border border-brand-500/20 rounded-full text-[10px] font-black text-brand-500 uppercase tracking-[0.5em]">Start of Production</span>
                    </div>
                    
                    {scriptLines.map((line, i) => renderScriptLine(line, i))}
                    
                    <div className="mt-16 pt-10 border-t border-white/5 flex flex-col items-center">
                        <div className="w-16 h-1.5 bg-gray-800 rounded-full mb-6"></div>
                        <p className="text-[11px] font-black text-gray-600 uppercase tracking-[0.8em] animate-pulse">Scene Out</p>
                    </div>
                </div>
            )}
        </div>
        
        <div className="mt-10 pt-10 border-t border-white/[0.04] text-[12px] text-brand-500 font-black tracking-[0.3em] uppercase flex flex-wrap gap-4">
          {idea.hashtags.split(/\s+/).map((tag, idx) => (
            <span key={idx} className="hover:text-brand-300 hover:bg-brand-500/20 transition-all cursor-default bg-brand-500/10 px-4 py-2 rounded-2xl border border-brand-500/10 shadow-sm">{tag}</span>
          ))}
        </div>
      </div>

      <div className="bg-gray-950/60 p-8 border-t border-white/[0.04] flex justify-between items-center backdrop-blur-md">
        <button 
          onClick={copyToClipboard}
          className={`text-[13px] font-black uppercase tracking-[0.2em] flex items-center gap-5 transition-all duration-300 px-8 py-4 rounded-3xl ${isCopied ? 'text-green-400 bg-green-400/10 border border-green-400/30' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
        >
          {isCopied ? (
            <><i className="fa-solid fa-check-double text-xl"></i> Script Copied!</>
          ) : (
            <><i className="fa-regular fa-copy text-xl"></i> Export Script</>
          )}
        </button>
        <div className="flex items-center gap-6 text-gray-700">
             <i className="fa-solid fa-bolt text-2xl opacity-20 group-hover:opacity-60 transition-opacity"></i>
             <i className="fa-solid fa-rocket text-2xl opacity-20 group-hover:opacity-60 transition-opacity"></i>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
