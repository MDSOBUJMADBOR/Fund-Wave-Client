
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  ChevronDown,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

type UserRole = "Supporter" | "Creator";

interface FormData {
  name: string;
  email: string;
  profilePictureUrl: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface RegisterError {
  message?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    profilePictureUrl: "",
    password: "",
    confirmPassword: "",
    role: "Supporter",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Password Validation
  // =========================

  const hasMinLength = formData.password.length >= 8;

  const hasUppercase = /[A-Z]/.test(formData.password);

  const hasLowercase = /[a-z]/.test(formData.password);

  const hasNumber = /[0-9]/.test(formData.password);

  const hasSpecialChar =
    /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);

  const isPasswordStrong =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar;

  const passwordsMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  // =========================
  // Email Validation
  // =========================

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // =========================
  // Handle Input Changes
  // =========================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrorMsg("");
    setSuccessMsg("");
  };

  // =========================
  // Handle Registration
  // =========================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Password strength check
    if (!isPasswordStrong) {
      setErrorMsg(
        "Please meet all password requirements."
      );
      return;
    }

    // Password match check
    if (!passwordsMatch) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // Email validation
    if (!isValidEmail(formData.email)) {
      setErrorMsg(
        "Please enter a valid email address."
      );
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Default credits
    const defaultCredits =
      formData.role === "Supporter" ? 50 : 20;

    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        image:
          formData.profilePictureUrl || undefined,
        role: formData.role,
        credits: defaultCredits,
        plan: "free",
      };

      /*
       * Better Auth may not know custom fields such as
       * role, credits and plan depending on your client
       * configuration.
       *
       * We avoid `any` and use a controlled type assertion.
       */
      const { error } =
        await authClient.signUp.email(
          registrationData as Parameters<
            typeof authClient.signUp.email
          >[0]
        );

      if (error) {
        setErrorMsg(
          error.message ||
            "Registration failed. Please try again."
        );
        setLoading(false);
        return;
      }

      setSuccessMsg(
        "Registration successful! Redirecting..."
      );

      router.push("/");
    } catch (error: unknown) {
      console.error(
        "Registration error:",
        error
      );

      if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (
          error as RegisterError
        ).message === "string"
      ) {
        setErrorMsg(
          (error as RegisterError).message ||
            "An unexpected error occurred."
        );
      } else {
        setErrorMsg(
          "An unexpected error occurred."
        );
      }

      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl md:grid-cols-12 md:p-8">

        {/* =========================================
            LEFT SIDE
        ========================================== */}

        <div className="flex flex-col justify-between gap-6 md:col-span-5">

          {/* Profile Illustration */}
          <div className="relative flex min-h-[200px] flex-col items-center justify-center overflow-hidden rounded-2xl bg-purple-50 p-6 text-center">

            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-purple-200/60">
              <User className="h-10 w-10 text-purple-600" />
            </div>

            <div className="w-full max-w-[180px] space-y-2">
              <div className="h-2 w-full rounded bg-purple-200" />

              <div className="mx-auto h-2 w-3/4 rounded bg-purple-200" />
            </div>
          </div>

          {/* Welcome Bonus */}
          <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
            <div className="flex items-start gap-3">

              <div className="rounded-xl bg-purple-100 p-2 text-purple-600">
                <Gift className="h-6 w-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Welcome Bonus
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  Supporter will get{" "}
                  <span className="font-semibold text-slate-900">
                    50 credits
                  </span>
                </p>

                <p className="text-sm text-slate-600">
                  Creator will get{" "}
                  <span className="font-semibold text-slate-900">
                    20 credits
                  </span>
                </p>

                <p className="mt-3 text-xs text-slate-500">
                  These credits will be added to
                  your account once on registration.
                </p>
              </div>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">

            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <ShieldCheck className="h-5 w-5 text-purple-600" />
              Password Requirements
            </div>

            <ul className="space-y-2 text-xs">

              <li
                className={`flex items-center gap-2 ${
                  hasMinLength
                    ? "font-medium text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    hasMinLength
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                At least 8 characters
              </li>

              <li
                className={`flex items-center gap-2 ${
                  hasUppercase
                    ? "font-medium text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    hasUppercase
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                One uppercase letter
              </li>

              <li
                className={`flex items-center gap-2 ${
                  hasLowercase
                    ? "font-medium text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    hasLowercase
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                One lowercase letter
              </li>

              <li
                className={`flex items-center gap-2 ${
                  hasNumber
                    ? "font-medium text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    hasNumber
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                One number
              </li>

              <li
                className={`flex items-center gap-2 ${
                  hasSpecialChar
                    ? "font-medium text-emerald-600"
                    : "text-slate-500"
                }`}
              >
                <CheckCircle2
                  className={`h-4 w-4 ${
                    hasSpecialChar
                      ? "text-emerald-500"
                      : "text-slate-300"
                  }`}
                />
                One special character
              </li>

            </ul>
          </div>
        </div>

        {/* =========================================
            RIGHT SIDE
        ========================================== */}

        <div className="flex flex-col justify-center md:col-span-7">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">
              Create Your Account
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Join FundBuddy and start your journey
              today.
            </p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {errorMsg}
            </div>
          )}

          {/* Success */}
          {successMsg && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-600">
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-purple-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-purple-600 focus:bg-white"
                />
              </div>

              {isValidEmail(formData.email) && (
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Looks good!
                </p>
              )}
            </div>

            {/* Profile Picture URL */}
            <div>
              <label
                htmlFor="profilePictureUrl"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Profile Picture URL
              </label>

              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="profilePictureUrl"
                  type="url"
                  name="profilePictureUrl"
                  placeholder="https://example.com/your-image.jpg"
                  value={formData.profilePictureUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-purple-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  required
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-purple-600 focus:bg-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isPasswordStrong
                          ? "w-full bg-emerald-500"
                          : "w-1/2 bg-amber-400"
                      }`}
                    />
                  </div>

                  {isPasswordStrong && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                      Strong password
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  required
                  placeholder="••••••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-9 pr-10 text-sm outline-none transition focus:border-purple-600 focus:bg-white"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {passwordsMatch && (
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="mb-1 block text-xs font-semibold text-slate-700"
              >
                Role
              </label>

              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full cursor-pointer appearance-none rounded-xl border border-purple-200 bg-slate-50/50 px-4 py-2.5 pr-10 text-sm text-slate-800 outline-none transition focus:border-purple-600 focus:bg-white"
                >
                  <option value="Supporter">
                    Supporter (Get 50 Credits)
                  </option>

                  <option value="Creator">
                    Creator (Get 20 Credits)
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-sm font-medium text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-purple-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

