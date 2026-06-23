
import React, { useState, useEffect } from 'react';
import { User, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { UserProfile, Platform, Mood } from '../types';
import { getUserProfile, saveUserProfile } from '../services/dbService';
import { auth } from '../firebaseConfig';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    uid: user.uid,
    displayName: user.displayName || '',
    creatorNiche: '',
    bio: '',
    youtubeHandle: '',
    instagramHandle: '',
    defaultPlatform: Platform.YOUTUBE,
    defaultMood: Mood.EDUCATIONAL,
    updatedAt: Date.now()
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getUserProfile(user.uid);
      if (data) {
        setProfile(data);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user.uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await saveUserProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Creator Identity...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Identity Card (Preview) */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-[40px] border border-gray-700 p-8 sticky top-24 shadow-2xl overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-brand-500/20 transition-all duration-700"></div>
            
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-red-500/20">
                {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              
              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
                {profile.displayName || 'Unnamed Creator'}
              </h2>
              <p className="text-brand-500 text-xs font-black uppercase tracking-widest mb-6">
                {profile.creatorNiche || 'Niche Not Set'}
              </p>
              
              <div className="bg-gray-900/50 rounded-2xl p-4 mb-6 border border-white/5">
                <p className="text-gray-400 text-sm font-medium leading-relaxed italic line-clamp-3">
                  {profile.bio || "No bio added yet. Tell us your creator story."}
                </p>
              </div>

              <div className="flex justify-center gap-4 text-gray-500 mb-8">
                <i className={`fa-brands fa-youtube text-xl ${profile.youtubeHandle ? 'text-white' : 'opacity-20'}`}></i>
                <i className={`fa-brands fa-instagram text-xl ${profile.instagramHandle ? 'text-white' : 'opacity-20'}`}></i>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-red-500/20"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 rounded-[40px] border border-white/5 p-8 lg:p-12 shadow-2xl backdrop-blur-xl">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Creator Profile</h1>
            <p className="text-gray-400 font-medium mb-10">Personalize your AI engine for consistent brand output.</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={profile.displayName}
                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-500 transition-all font-bold" 
                    placeholder="e.g., TechWithSam"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Your Niche</label>
                  <input 
                    type="text" 
                    value={profile.creatorNiche}
                    onChange={(e) => setProfile({...profile, creatorNiche: e.target.value})}
                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-500 transition-all font-bold" 
                    placeholder="e.g., Tech Reviews, Cooking"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Creator Bio</label>
                <textarea 
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-500 transition-all font-bold resize-none" 
                  placeholder="Tell your audience who you are..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">YouTube Handle</label>
                  <div className="relative">
                    <i className="fa-brands fa-at absolute left-5 top-1/2 -translate-y-1/2 text-gray-600"></i>
                    <input 
                      type="text" 
                      value={profile.youtubeHandle}
                      onChange={(e) => setProfile({...profile, youtubeHandle: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-12 pr-6 py-4 text-white focus:ring-2 focus:ring-brand-500 transition-all font-bold" 
                      placeholder="handle"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Instagram Handle</label>
                  <div className="relative">
                    <i className="fa-brands fa-at absolute left-5 top-1/2 -translate-y-1/2 text-gray-600"></i>
                    <input 
                      type="text" 
                      value={profile.instagramHandle}
                      onChange={(e) => setProfile({...profile, instagramHandle: e.target.value})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl pl-12 pr-6 py-4 text-white focus:ring-2 focus:ring-brand-500 transition-all font-bold" 
                      placeholder="handle"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <h3 className="text-sm font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-sliders text-brand-500"></i> AI Defaults
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Primary Platform</label>
                    <select 
                      value={profile.defaultPlatform}
                      onChange={(e) => setProfile({...profile, defaultPlatform: e.target.value as Platform})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-500 transition-all font-bold appearance-none cursor-pointer"
                    >
                      {Object.values(Platform).map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-gray-500 mb-2 uppercase tracking-widest ml-1">Signature Vibe</label>
                    <select 
                      value={profile.defaultMood}
                      onChange={(e) => setProfile({...profile, defaultMood: e.target.value as Mood})}
                      className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-6 py-4 text-white focus:ring-2 focus:ring-brand-500 transition-all font-bold appearance-none cursor-pointer"
                    >
                      {Object.values(Mood).map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="bg-brand-600 hover:bg-brand-500 text-white px-10 py-5 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {saving ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>}
                </button>
                {success && (
                  <span className="text-green-400 font-black text-xs uppercase tracking-widest animate-fadeIn">
                    <i className="fa-solid fa-check mr-2"></i> Profile Synced!
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
