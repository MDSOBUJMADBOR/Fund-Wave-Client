'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Link as LinkIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Gift, 
  ShieldCheck, 
  ChevronDown
} from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profilePictureUrl: '',
    password: '',
    confirmPassword: '',
    role: 'Supporter',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password Validation Rules
  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  const isPasswordStrong =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Password Strength Check
    if (!isPasswordStrong) {
      setErrorMsg('Please meet all password requirements.');
      return;
    }

    // 2. Passwords Match Check
    if (!passwordsMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    // 3. Assign Default Credits based on Role
    const defaultCredits = formData.role === 'Supporter' ? 50 : 20;

    // Final Data Structure for DB/Console
    const userData = {
      name: formData.name,
      email: formData.email,
      profilePictureUrl: formData.profilePictureUrl || null,
      role: formData.role,
      credits: defaultCredits, // Credits assigned once on registration
      password: formData.password, // In real app, hash this before saving
      createdAt: new Date().toISOString(),
    };

  

    console.log(userData);
    

    setSuccessMsg('Registration successful! Check browser console for data.');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 p-6 md:p-8 gap-8 border border-slate-100">
        
        {/* Left Side: Info Cards */}
        <div className="md:col-span-5 flex flex-col gap-6 justify-between">
          {/* Top Illustration/Banner Placeholder */}
          <div className="bg-purple-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[200px]">
            <div className="w-20 h-20 bg-purple-200/60 rounded-full flex items-center justify-center mb-3">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <div className="space-y-2 w-full max-w-[180px]">
              <div className="h-2 bg-purple-200 rounded w-full"></div>
              <div className="h-2 bg-purple-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>

          {/* Welcome Bonus Card */}
          <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-xl">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Welcome Bonus</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Supporter will get <span className="font-semibold text-slate-900">50 credits</span>
                </p>
                <p className="text-sm text-slate-600">
                  Creator will get <span className="font-semibold text-slate-900">20 credits</span>
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  These credits will be added to your account once on registration.
                </p>
              </div>
            </div>
          </div>

          {/* Password Requirements Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm">
              <ShieldCheck className="w-5 h-5 text-purple-600" />
              Password Requirements
            </div>
            <ul className="space-y-2 text-xs">
              <li className={`flex items-center gap-2 ${hasMinLength ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${hasMinLength ? 'text-emerald-500' : 'text-slate-300'}`} />
                At least 8 characters
              </li>
              <li className={`flex items-center gap-2 ${hasUppercase ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${hasUppercase ? 'text-emerald-500' : 'text-slate-300'}`} />
                One uppercase letter
              </li>
              <li className={`flex items-center gap-2 ${hasLowercase ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${hasLowercase ? 'text-emerald-500' : 'text-slate-300'}`} />
                One lowercase letter
              </li>
              <li className={`flex items-center gap-2 ${hasNumber ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${hasNumber ? 'text-emerald-500' : 'text-slate-300'}`} />
                One number
              </li>
              <li className={`flex items-center gap-2 ${hasSpecialChar ? 'text-emerald-600 font-medium' : 'text-slate-500'}`}>
                <CheckCircle2 className={`w-4 h-4 ${hasSpecialChar ? 'text-emerald-500' : 'text-slate-300'}`} />
                One special character
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Create Your Account</h1>
            <p className="text-sm text-slate-500 mt-1">Join FundBuddy and start your journey today.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-xl text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>
              {isValidEmail(formData.email) && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Looks good!
                </p>
              )}
            </div>

            {/* Profile Picture URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Profile Picture URL</label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="url"
                  name="profilePictureUrl"
                  placeholder="https://example.com/your-image.jpg"
                  value={formData.profilePictureUrl}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Progress Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isPasswordStrong ? 'w-full bg-emerald-500' : 'w-1/2 bg-amber-400'
                      }`}
                    ></div>
                  </div>
                  {isPasswordStrong && (
                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                      Strong password <CheckCircle2 className="w-3.5 h-3.5" />
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm outline-none focus:border-purple-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordsMatch && (
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full appearance-none px-4 py-2.5 bg-slate-50/50 border border-purple-200 rounded-xl text-sm text-slate-800 outline-none focus:border-purple-600 focus:bg-white transition cursor-pointer pr-10"
                >
                  <option value="Supporter">Supporter (Get 50 Credits)</option>
                  <option value="Creator">Creator (Get 20 Credits)</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-xl text-sm transition shadow-lg shadow-purple-600/20 active:scale-[0.99]"
            >
              Create Account
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-600 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}