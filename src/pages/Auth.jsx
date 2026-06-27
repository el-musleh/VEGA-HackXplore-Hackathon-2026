import { useNavigate } from 'react-router-dom';
import { Droplet, Mail, Lock, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = (e) => {
    e.preventDefault();
    navigate('/gateway'); // On success, go to role selection
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 bg-white-bg relative overflow-hidden">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-earthy-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-64 h-64 bg-water-drop-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* Logo Area */}
      <div className="flex flex-col items-center mb-10 z-10 animate-fade-in-down">
        <div className="w-20 h-20 bg-gradient-to-tr from-water-drop-blue to-earthy-green rounded-3xl flex items-center justify-center mb-4 shadow-lg text-white transform rotate-3">
          <Droplet size={40} strokeWidth={2.5} className="transform -rotate-3"/>
        </div>
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">AquaSync</h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">Join the Global Irrigation Network</p>
      </div>

      {/* Form Area */}
      <div className="w-full max-w-sm z-10 animate-fade-in-down" style={{ animationDelay: '0.1s' }}>
        <form onSubmit={handleAuth} className="space-y-4">
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email address" 
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-water-drop-blue focus:outline-none transition-all font-medium text-gray-800"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-water-drop-blue focus:outline-none transition-all font-medium text-gray-800"
            />
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-lg shadow-gray-900/20 hover:shadow-xl active:scale-95 transition-all group"
          >
            {isLogin ? 'Sign In' : 'Create Account'}
            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <div className="h-px bg-gray-200 flex-1" />
          <span className="px-4 text-xs font-bold text-gray-400 uppercase">Or continue with</span>
          <div className="h-px bg-gray-200 flex-1" />
        </div>

        <button 
          onClick={() => navigate('/gateway')}
          className="w-full mt-8 flex items-center justify-center py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold shadow-sm hover:border-gray-200 hover:bg-gray-50 active:scale-95 transition-all"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-water-drop-blue font-bold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>

    </div>
  );
}
