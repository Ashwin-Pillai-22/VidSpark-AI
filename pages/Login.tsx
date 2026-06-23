
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  setPersistence, 
  browserLocalPersistence, 
  browserSessionPersistence 
} from 'firebase/auth';
// Fix: Removed .ts extension from import path
import { auth, googleProvider } from '../firebaseConfig';
// Fix: Corrected named imports from react-router-dom
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(auth, persistence);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login Error:", err);
      let msg = "Invalid email or password.";
      if (err.code === 'auth/too-many-requests') {
        msg = "Too many failed attempts. Try again later.";
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // Silently ignore if user closed the popup
        setLoading(false);
        return;
      }
      console.error("Google Sign-in Error:", err);
      setError(err.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Sign in to spark your next viral video</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-center gap-3 py-3 border border-gray-600 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <i className="fa-brands fa-google text-lg text-red-400"></i>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-700"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-gray-800 px-3 text-gray-500 font-bold tracking-widest">Or email login</span></div>
          </div>

          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm flex items-start animate-shake">
               <i className="fa-solid fa-circle-exclamation mr-2 mt-0.5 flex-shrink-0"></i>
               <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Email Address</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Password</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3.5 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-5 w-5 rounded border-gray-700 bg-gray-900 text-brand-600 focus:ring-brand-500 focus:ring-offset-gray-800 cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-400 cursor-pointer select-none font-medium">
                Remember me (Fast login)
              </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 transition-all transform active:scale-[0.99]"
            >
              {loading ? <i className="fa-solid fa-circle-notch fa-spin mr-2"></i> : 'Sign In'}
            </button>
          </form>
        </div>
        <div className="px-8 py-5 bg-gray-900/50 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-brand-500 hover:text-brand-400 transition-colors">Sign up now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
