'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  Compass, 
  Heart, 
  ShieldCheck, 
  Users, 
  User 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Tab State: 'email' or 'google'
  const [activeTab, setActiveTab] = useState<'email' | 'google'>('email');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error States
  const [emailError, setEmailError] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidEmail = (emailStr: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);

  // Handle Email Login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setAuthError('');

    // Validation 1: Check Email Format
    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Dummy Authentication Simulation
    setTimeout(() => {
      // Demo validation check: Change this condition according to your test data
      if (email === 'user@example.com' && password === '12345678') {
        // 1. Generate & Store Secret Access Token in LocalStorage
        const dummyToken = `secret_access_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
        localStorage.setItem('access-token', dummyToken);

        // 2. Redirect to Dashboard
        router.push('/dashboard');
      } else {
        // Validation 2: Incorrect Email or Password
        setAuthError('Incorrect email or password');
        setLoading(false);
      }
    }, 1000);
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = () => {
    setLoading(true);
    
    // Simulate Google OAuth
    setTimeout(() => {
      const googleToken = `google_access_token_${Math.random().toString(36).substring(2)}_${Date.now()}`;
      localStorage.setItem('access-token', googleToken);

      // Redirect to Dashboard
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 p-6 md:p-8 gap-8 border border-slate-100">
        
        {/* Left Side: Info & Features */}
        <div className="md:col-span-5 flex flex-col gap-6 justify-between">
          {/* Top Illustration/Banner */}
          <div className="bg-purple-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
            <div className="w-20 h-20 bg-purple-200/60 rounded-full flex items-center justify-center mb-3">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <div className="w-24 h-16 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Lock className="w-8 h-8" />
            </div>
          </div>

          {/* Why Join Card */}
          <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">
              Why Join FundBuddy?
            </h3>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                  <Compass className="w-4 h-4" />
                </div>
                <span>Discover amazing campaigns</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                  <Heart className="w-4 h-4" />
                </div>
                <span>Support projects you love</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>Secure & easy transactions</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <span>Be a part of a growing community</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Welcome Back!</h1>
            <p className="text-sm text-slate-500 mt-1">Login to your account to continue.</p>
          </div>

          {/* Login Tabs */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`pb-3 text-sm font-semibold transition border-b-2 flex-1 text-center ${
                activeTab === 'email'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Email Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('google')}
              className={`pb-3 text-sm font-semibold transition border-b-2 flex-1 text-center ${
                activeTab === 'google'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Google Sign-In
            </button>
          </div>

          {/* TAB 1: Email Login Form */}
          {activeTab === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    className={`w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-sm outline-none transition ${
                      emailError
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 focus:border-purple-600 focus:bg-white'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> {emailError}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setAuthError('');
                    }}
                    className={`w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border rounded-xl text-sm outline-none transition ${
                      authError
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-slate-200 focus:border-purple-600 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {authError && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" /> {authError}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                  />
                  Remember me
                </label>
                <Link href="#" className="text-purple-600 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-purple-600/20 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 w-full"></div>
                <span className="bg-white px-3 text-xs text-slate-400 absolute">or</span>
              </div>

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 transition flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>
            </form>
          ) : (
            /* TAB 2: Direct Google Sign-In Tab */
            <div className="py-8 text-center space-y-4">
              <p className="text-sm text-slate-600">
                Click below to sign in directly with your Google account.
              </p>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-medium text-slate-700 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {loading ? 'Authenticating...' : 'Sign in with Google'}
              </button>
            </div>
          )}

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-purple-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}