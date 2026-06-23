
import React, { useState, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { Mood, VideoDuration, Platform, VideoIdea, UserProfile } from '../types';
import { generateIdeas } from '../services/aiService';
import { 
  saveIdeaToDb, 
  deleteIdeaFromDb, 
  getUserSavedIdeas,
  getUserProfile
} from '../services/dbService';
import IdeaCard from '../components/IdeaCard';
import Skeleton from '../components/Skeleton';
import Logo from '../components/Logo';

interface DashboardProps {
  user: User;
}

const LOADING_MESSAGES = [
  "Igniting the creative spark...",
  "Analyzing viral trends...",
  "Drafting high-retention scripts...",
  "Reviewing creative hooks...",
  "Optimizing for maximum engagement...",
  "Almost ready for your channel..."
];

const ONBOARDING_STEPS = [
  {
    title: "Welcome to your Content Lab",
    description: "This is where your next viral hit is born. Let's take a quick 30-second tour of your tools.",
    target: "header"
  },
  {
    title: "Defining the Vision",
    description: "Enter a topic here. Be specific. Instead of 'cooking', try 'Why sourdough is actually a chemistry experiment'.",
    target: "topic"
  },
  {
    title: "Refining the Vibe",
    description: "Tailor the mood and format. Educational deep dives perform best on YouTube, while high-energy stories win on Reels.",
    target: "config"
  },
  {
    title: "The Production Library",
    description: "Every script you bookmark is saved here for your next filming session. Think of it as your digital script binder.",
    target: "library-btn"
  }
];

const ITEMS_PER_PAGE = 6;

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.YOUTUBE);
  const [mood, setMood] = useState<Mood>(Mood.EDUCATIONAL);
  const [duration, setDuration] = useState<VideoDuration>(VideoDuration.MEDIUM);
  
  const [generatedIdeas, setGeneratedIdeas] = useState<VideoIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<VideoIdea[]>([]);
  const [view, setView] = useState<'generate' | 'library'>('generate');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Onboarding State
  const [onboardingStep, setOnboardingStep] = useState<number | null>(null);

  // API Key status
  const [hasApiKey, setHasApiKey] = useState<boolean>(true);
  const provider = ((process.env as any).AI_PROVIDER || 'gemini').toLowerCase();

  // Library states
  const [librarySearch, setLibrarySearch] = useState('');
  const [libraryLimit, setLibraryLimit] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    checkApiKeyStatus();
    if (user) {
      fetchSavedIdeas();
      fetchProfile();
      checkOnboarding();
    }
  }, [user, view]);

  const fetchProfile = async () => {
    try {
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
        // Use profile defaults if no content has been generated yet
        if (generatedIdeas.length === 0 && !topic) {
          setPlatform(profile.defaultPlatform || Platform.YOUTUBE);
          setMood(profile.defaultMood || Mood.EDUCATIONAL);
        }
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const checkOnboarding = () => {
    const seen = localStorage.getItem(`onboarding_seen_${user.uid}`);
    if (!seen) {
      setOnboardingStep(0);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem(`onboarding_seen_${user.uid}`, 'true');
    setOnboardingStep(null);
  };

  const checkApiKeyStatus = async () => {
    if (provider === 'gemini' && (window as any).aistudio) {
      const selected = await (window as any).aistudio.hasSelectedApiKey();
      setHasApiKey(selected);
    } else {
      setHasApiKey(true);
    }
  };

  const handleOpenKeyDialog = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setHasApiKey(true);
      setError(null);
    }
  };

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchSavedIdeas = async () => {
    try {
      const ideas = await getUserSavedIdeas(user.uid);
      setSavedIdeas(ideas);
    } catch (err) {
      console.error("Failed to fetch saved ideas:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (!hasApiKey && provider === 'gemini') {
      setError("API Engine not initialized. Please connect your API key.");
      return;
    }

    setLoading(true);
    setError(null);
    setGeneratedIdeas([]);
    setView('generate');

    try {
      const ideas = await generateIdeas({ platform, topic, mood, duration });
      setGeneratedIdeas(ideas);
    } catch (err: any) {
        if (err.message === "API_KEY_NOT_FOUND") {
          setHasApiKey(false);
          setError("Your API key is invalid or from an unpaid project.");
        } else {
          setError(err.message || "Something went wrong during generation.");
        }
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = async (idea: VideoIdea) => {
    const isAlreadySaved = savedIdeas.some(s => s.id === idea.id);
    const previousSavedState = [...savedIdeas];

    if (isAlreadySaved) {
      setSavedIdeas(prev => prev.filter(s => s.id !== idea.id));
    } else {
      setSavedIdeas(prev => [idea, ...prev]);
    }

    try {
      if (isAlreadySaved) {
        await deleteIdeaFromDb(idea.id);
      } else {
        await saveIdeaToDb(user.uid, idea);
      }
    } catch (err: any) {
      console.error("Firestore Sync Error:", err);
      setSavedIdeas(previousSavedState);
      setError("Failed to sync with library.");
      setTimeout(() => setError(null), 5000);
    }
  };

  const filteredLibrary = useMemo(() => {
    return savedIdeas.filter(idea => 
      idea.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
      idea.topic?.toLowerCase().includes(librarySearch.toLowerCase()) ||
      idea.hook.toLowerCase().includes(librarySearch.toLowerCase())
    );
  }, [savedIdeas, librarySearch]);

  const paginatedLibrary = useMemo(() => {
    return filteredLibrary.slice(0, libraryLimit);
  }, [filteredLibrary, libraryLimit]);

  // Priority: Profile Name > Firebase Display Name > Email Prefix
  const greetingName = userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Creator';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      
      {/* Onboarding Overlay */}
      {onboardingStep !== null && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-fadeIn">
          <div className="max-w-md w-full bg-gray-800 border border-brand-500/30 rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-brand-500/20">
                {onboardingStep + 1}
              </div>
              <div className="h-1 flex-grow bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-500 transition-all duration-500" 
                  style={{ width: `${((onboardingStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{ONBOARDING_STEPS[onboardingStep].title}</h3>
            <p className="text-gray-400 font-medium leading-relaxed mb-10">
              {ONBOARDING_STEPS[onboardingStep].description}
            </p>

            <div className="flex items-center justify-between">
              <button 
                onClick={completeOnboarding}
                className="text-gray-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
              >
                Skip Guide
              </button>
              <button 
                onClick={() => {
                  if (onboardingStep < ONBOARDING_STEPS.length - 1) {
                    setOnboardingStep(onboardingStep + 1);
                  } else {
                    completeOnboarding();
                  }
                }}
                className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95 flex items-center gap-3"
              >
                {onboardingStep === ONBOARDING_STEPS.length - 1 ? "Let's Ignite!" : "Next Step"}
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10" id="header">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center tracking-tight">
            <span className="bg-brand-500/20 text-brand-500 p-2 rounded-xl mr-3 shadow-lg shadow-brand-500/10">
              <i className="fa-solid fa-sparkles"></i>
            </span>
            Content Lab
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">Design your next viral masterpiece, {greetingName}</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="inline-flex bg-gray-800 p-1.5 rounded-xl border border-gray-700 self-start shadow-xl">
            <button 
              onClick={() => setView('generate')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${view === 'generate' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-wand-magic-sparkles"></i> Generate
            </button>
            <button 
              id="library-btn"
              onClick={() => setView('library')}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all relative flex items-center gap-2 ${view === 'library' ? 'bg-yellow-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              <i className="fa-solid fa-bookmark"></i> Library
            </button>
          </div>
        </div>
      </div>

      {!hasApiKey && provider === 'gemini' && (
        <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-key text-yellow-500 text-xl"></i>
            <div>
              <h4 className="text-white font-bold text-sm">API Key Required</h4>
              <p className="text-gray-400 text-xs">To generate content with Gemini models, please select your API key.</p>
            </div>
          </div>
          <button 
            onClick={handleOpenKeyDialog}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
          >
            Select API Key
          </button>
        </div>
      )}

      {view === 'generate' && (
        <div className="mb-12">
          <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 p-6 lg:p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none group-hover:bg-brand-500/10 transition-all duration-700"></div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 relative z-10">
              <div className="lg:col-span-4" id="topic">
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">The Topic</label>
                <input
                  required
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="block w-full bg-gray-900 border border-gray-700 rounded-xl text-white px-4 py-3.5 focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all placeholder:text-gray-600 font-bold disabled:opacity-50"
                  placeholder="e.g., The future of AI robots"
                  disabled={loading}
                />
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-4" id="config">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                    className="block w-full bg-gray-900 border border-gray-700 rounded-xl text-white px-4 py-3.5 appearance-none focus:ring-2 focus:ring-brand-500 cursor-pointer font-bold disabled:opacity-50"
                    disabled={loading}
                  >
                    {Object.values(Platform).map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Vibe</label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as Mood)}
                    className="block w-full bg-gray-900 border border-gray-700 rounded-xl text-white px-4 py-3.5 appearance-none focus:ring-2 focus:ring-brand-500 cursor-pointer font-bold disabled:opacity-50"
                    disabled={loading}
                  >
                    {Object.values(Mood).map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Format</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value as VideoDuration)}
                    className="block w-full bg-gray-900 border border-gray-700 rounded-xl text-white px-4 py-3.5 appearance-none focus:ring-2 focus:ring-brand-500 cursor-pointer font-bold disabled:opacity-50"
                    disabled={loading}
                  >
                    {Object.values(VideoDuration).map((d) => (
                      <option key={d} value={d}>{d.split(' (')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="lg:col-span-2 flex items-end">
                 <button
                    type="submit"
                    disabled={loading || !topic.trim()}
                    className="w-full h-[54px] flex items-center justify-center rounded-xl shadow-xl text-sm font-black text-white bg-gradient-to-br from-brand-600 to-indigo-700 hover:from-brand-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition-all active:scale-95 group shadow-brand-600/20"
                  >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin text-lg"></i> : <span className="flex items-center gap-2">Spark Ideas <i className="fa-solid fa-bolt group-hover:translate-y-[-2px] transition-transform"></i></span>}
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'library' && (
        <div className="mb-8 animate-fadeIn">
          <div className="relative max-w-xl mx-auto">
            <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
            <input 
              type="text" 
              placeholder="Search library..."
              value={librarySearch}
              onChange={(e) => { setLibrarySearch(e.target.value); setLibraryLimit(ITEMS_PER_PAGE); }}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-4 pl-12 pr-6 text-white focus:ring-2 focus:ring-yellow-500 focus:outline-none transition-all font-bold placeholder:text-gray-600 shadow-xl"
            />
          </div>
        </div>
      )}

      <div className="min-h-[400px]">
        {error && (
           <div className="py-12 px-6 text-red-400 bg-red-900/10 rounded-3xl border border-red-900/30 mb-8 shadow-lg flex flex-col items-center animate-slideDown">
             <i className="fa-solid fa-triangle-exclamation text-4xl mb-4"></i>
            <p className="font-bold text-center mb-4">{error}</p>
          </div>
        )}

        {loading ? (
           <div className="space-y-12">
             <div className="flex flex-col items-center justify-center py-12">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-brand-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fa-solid fa-wand-magic-sparkles text-xl text-brand-500 animate-bounce"></i>
                    </div>
                </div>
                <p className="text-xl font-black text-white mb-2 animate-pulse tracking-tight">{LOADING_MESSAGES[loadingMsgIdx]}</p>
                <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] opacity-60">Architecting your viral hit</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} />)}
             </div>
           </div>
        ) : (
          <div className="flex flex-col gap-10">
            {view === 'generate' && generatedIdeas.length === 0 && !error && (
              <div className="relative group/glass animate-fadeIn transition-all duration-700">
                {/* Outer Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-500/20 via-purple-500/20 to-brand-500/20 rounded-[50px] blur-2xl opacity-0 group-hover/glass:opacity-50 transition-opacity duration-700"></div>
                
                <div className="relative bg-gray-900/80 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 lg:p-16 text-center shadow-2xl overflow-hidden min-h-[600px] flex flex-col items-center justify-center group-hover/glass:border-brand-500/30 group-hover/glass:shadow-[0_0_60px_-15px_rgba(14,165,233,0.3)] transition-all duration-500">
                   
                   {/* Internal Gradient Bloom */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none opacity-50 group-hover/glass:opacity-100 group-hover/glass:bg-brand-500/10 transition-all duration-700"></div>

                   {/* Top Icon with Shake Effect on Hover */}
                   <div className="mb-8 relative z-10 group-hover/glass:scale-110 transition-transform duration-500">
                      <div className="w-20 h-20 bg-[#1a1f2e] rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 rotate-[-6deg] group-hover/glass:rotate-0 transition-all duration-500 relative overflow-hidden group-hover/glass:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent opacity-0 group-hover/glass:opacity-100 transition-opacity"></div>
                        <i className="fa-solid fa-wand-magic-sparkles text-3xl text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"></i>
                      </div>
                      <div className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-400 rounded-full border-4 border-[#0f172a] shadow-[0_0_15px_rgba(34,211,238,0.6)] animate-pulse"></div>
                   </div>

                   {/* Title */}
                   <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tighter leading-tight max-w-3xl relative z-10">
                     Silence is the canvas of the <span className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">unheard creator.</span>
                   </h2>
                   
                   {/* Subtitle */}
                   <p className="text-gray-400 text-lg font-medium max-w-2xl mb-16 leading-relaxed relative z-10">
                     Speak your vision into the AI, and let's craft the resonance your audience is waiting for. We'll engineer high-retention hooks and detailed multi-chapter scripts tailored for your audience's psychology.
                   </p>

                   {/* Feature Cards */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12 relative z-10">
                      {/* Card 1 */}
                      <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-white/5 p-8 rounded-3xl text-left hover:border-white/10 transition-all duration-300 group/card relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/10">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                         <i className="fa-solid fa-lightbulb text-yellow-500 text-2xl mb-4 group-hover/card:scale-110 transition-transform block origin-left drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"></i>
                         <h4 className="font-black text-white text-sm uppercase tracking-widest mb-3">Pro Tip</h4>
                         <p className="text-gray-500 text-xs font-medium leading-relaxed group-hover/card:text-gray-400 transition-colors">
                           Focus your topic on a specific problem or curiosity for a stronger AI "Information Density".
                         </p>
                      </div>

                      {/* Card 2 */}
                      <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-white/5 p-8 rounded-3xl text-left hover:border-white/10 transition-all duration-300 group/card relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-500/10">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                         <i className="fa-solid fa-chart-line text-brand-400 text-2xl mb-4 group-hover/card:scale-110 transition-transform block origin-left drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"></i>
                         <h4 className="font-black text-white text-sm uppercase tracking-widest mb-3">Retention</h4>
                         <p className="text-gray-500 text-xs font-medium leading-relaxed group-hover/card:text-gray-400 transition-colors">
                           We optimize scripts for the "3-second hook" to maximize early engagement metrics.
                         </p>
                      </div>

                      {/* Card 3 */}
                      <div className="bg-[#1a1f2e]/80 backdrop-blur-sm border border-white/5 p-8 rounded-3xl text-left hover:border-white/10 transition-all duration-300 group/card relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                         <i className="fa-regular fa-eye text-purple-400 text-2xl mb-4 group-hover/card:scale-110 transition-transform block origin-left drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]"></i>
                         <h4 className="font-black text-white text-sm uppercase tracking-widest mb-3">Directives</h4>
                         <p className="text-gray-500 text-xs font-medium leading-relaxed group-hover/card:text-gray-400 transition-colors">
                           Each script includes cinematic visual markers so you know exactly what to film.
                         </p>
                      </div>
                   </div>

                   {/* Bottom Box */}
                   <div className="w-full max-w-xl bg-[#131a29] border border-brand-900/30 rounded-2xl p-6 flex gap-5 items-start relative overflow-hidden hover:bg-[#131a29]/80 transition-all duration-300 z-10 group/thought hover:border-brand-500/30">
                      <div className="absolute left-0 top-0 w-1 h-full bg-brand-600 group-hover/thought:w-1.5 transition-all"></div>
                      <i className="fa-solid fa-robot text-brand-500 mt-1 text-xl group-hover/thought:scale-110 transition-transform"></i>
                      <div className="text-left">
                         <h5 className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-2">Thought from VidSpark AI</h5>
                         <p className="text-gray-400 text-xs font-medium italic leading-relaxed group-hover/thought:text-gray-300 transition-colors">
                           "Great content isn't just about what you say, but how you frame the silent moments. I'm ready to help you find the rhythm that keeps viewers until the very last second."
                         </p>
                      </div>
                   </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-slideDown">
              {(view === 'generate' ? generatedIdeas : paginatedLibrary).map((idea) => (
                <IdeaCard 
                  key={idea.id} 
                  idea={idea} 
                  isSaved={savedIdeas.some(s => s.id === idea.id)}
                  onToggleSave={toggleSave}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
