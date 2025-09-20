import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import GoogleAuthButton from '../components/GoogleAuthButton';

const DriverAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [aadhaar, setAadhaar] = useState('');

    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotMsg, setForgotMsg] = useState('');

    const handleForgotPassword = async (e) => {
      e.preventDefault();
      setForgotMsg('');
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail);
      if (error) setForgotMsg(error.message);
      else setForgotMsg('Password reset email sent!');
    };

  // Verhoeff algorithm for Aadhaar validation
  const d = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,2,3,4,0,6,7,8,9,5],
    [2,3,4,0,1,7,8,9,5,6],
    [3,4,0,1,2,8,9,5,6,7],
    [4,0,1,2,3,9,5,6,7,8],
    [5,9,8,7,6,0,4,3,2,1],
    [6,5,9,8,7,1,0,4,3,2],
    [7,6,5,9,8,2,1,0,4,3],
    [8,7,6,5,9,3,2,1,0,4],
    [9,8,7,6,5,4,3,2,1,0]
  ];
  const p = [
    [0,1,2,3,4,5,6,7,8,9],
    [1,5,7,6,2,8,3,0,9,4],
    [5,8,0,3,7,9,6,1,4,2],
    [8,9,1,6,0,4,3,5,2,7],
    [9,4,5,3,1,2,6,8,7,0],
    [4,2,8,6,5,7,3,9,0,1],
    [2,7,9,3,8,0,6,4,1,5],
    [7,0,4,6,9,1,3,2,5,8]
  ];
  // const inv = [0,4,3,2,1,5,6,7,8,9]; // Not used
  function validateAadhaar(num) {
    if (!/^[2-9]{1}[0-9]{11}$/.test(num)) return false;
    let c = 0, len = num.length;
    for (let i = 0; i < len; i++) {
      c = d[c][p[(i%8)][parseInt(num[len-i-1],10)]];
    }
    return c === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    if (isLogin) {
      // Login as driver only
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else if (data.user.user_metadata?.role === 'driver') {
        setMessage('Login successful!');
        setTimeout(() => navigate('/driver'), 500);
      } else {
        setMessage('You are not registered as a driver.');
        await supabase.auth.signOut();
      }
    } else {
      // Register as driver only
      if (!validateAadhaar(aadhaar)) {
        setMessage('Invalid Aadhaar number.');
        setLoading(false);
        return;
      }
  // (No duplicate Aadhaar check, just validate format)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, aadhaar, role: 'driver' } }
      });
      if (error) {
        setMessage(error.message);
      } else {
  // Insert into drivers table
        const userId = data?.user?.id;
        if (userId) {
          await supabase.from('drivers').insert({ id: userId, full_name: fullName, aadhaar });
        }
        setMessage('Registration successful! Please check your email to confirm.');
      }
    }
    setLoading(false);
  };

  React.useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session && data.session.user?.user_metadata?.role === 'driver') {
        navigate('/driver');
      }
    };
    checkSession();
  }, [navigate]);

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_rgba(34,211,238,0.15)_0%,_transparent_50%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_rgba(59,130,246,0.15)_0%,_transparent_50%)] pointer-events-none"></div>
      </div>
      <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative border border-slate-700/50 z-10">
        <div className="mb-6 flex items-center text-slate-400 text-sm">
          <a href="/" className="flex items-center hover:text-cyan-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Home
          </a>
        </div>
        <button
          onClick={() => setIsLogin((v) => !v)}
          className="absolute right-4 top-4 text-cyan-400 text-sm font-medium hover:text-cyan-300 focus:outline-none transition-colors"
        >
          {isLogin ? 'Need account? Register' : 'Have account? Login'}
        </button>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">{isLogin ? '🚗' : '🔥'}</span>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {isLogin ? 'Driver Portal' : 'Join as Driver'}
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            {isLogin ? 'Welcome back, driver!' : 'Start earning with CarHere today'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white placeholder-slate-400 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  placeholder="Enter 12-digit Aadhaar number"
                  value={aadhaar}
                  onChange={e => setAadhaar(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={12}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-lg focus:outline-none focus:ring-2 text-white placeholder-slate-400 transition-all ${
                    aadhaar.length === 12 
                      ? (validateAadhaar(aadhaar) 
                          ? 'border-emerald-500/50 focus:ring-emerald-400' 
                          : 'border-red-500/50 focus:ring-red-400'
                        ) 
                      : 'border-slate-600/50 focus:ring-emerald-400'
                  }`}
                  required
                />
                {aadhaar.length === 12 && (
                  <div className={`text-sm mt-2 flex items-center gap-2 ${
                    validateAadhaar(aadhaar) ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    <span>{validateAadhaar(aadhaar) ? '✓' : '✗'}</span>
                    {validateAadhaar(aadhaar) ? 'Valid Aadhaar number' : 'Invalid Aadhaar number'}
                  </div>
                )}
              </div>
            </>
          )}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white placeholder-slate-400 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white placeholder-slate-400 transition-all"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                onClick={() => setShowPassword(v => !v)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-bold shadow-lg hover:from-emerald-500 hover:to-cyan-600 transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              isLogin ? 'Sign In' : 'Join as Driver'
            )}
          </button>
          {message && (
            <div className="text-center text-sm p-3 rounded-lg bg-red-900/20 border border-red-500/20 text-red-400">
              {message}
            </div>
          )}
          {isLogin && (
            <div className="text-right">
              <button 
                type="button" 
                className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors" 
                onClick={() => setShowForgot(true)}
              >
                Forgot your password?
              </button>
            </div>
          )}
        </form>
        {showForgot && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-slate-700/50 mx-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🔒</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Reset Password</h3>
                <p className="text-slate-400 text-sm">Enter your email to receive reset instructions</p>
              </div>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={forgotEmail} 
                    onChange={e => setForgotEmail(e.target.value)} 
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-white placeholder-slate-400 transition-all" 
                    required 
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 text-white font-medium shadow-lg hover:from-emerald-500 hover:to-cyan-600 transition-all"
                  >
                    Send Reset Link
                  </button>
                  <button 
                    type="button" 
                    className="flex-1 py-2.5 rounded-lg bg-slate-700 text-slate-300 font-medium border border-slate-600 hover:bg-slate-600 transition-all" 
                    onClick={() => setShowForgot(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              {forgotMsg && (
                <div className="text-center text-sm mt-4 p-3 rounded-lg bg-emerald-900/20 border border-emerald-500/20 text-emerald-400">
                  {forgotMsg}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-slate-800 text-slate-400">or continue with</span>
          </div>
        </div>
        <div className="flex justify-center">
          <GoogleAuthButton label={isLogin ? 'Sign in with Google' : 'Sign up with Google'} redirectTo={window.location.origin + '/driver'} />
        </div>
      </div>
    </div>
  );
};

export default DriverAuth;
