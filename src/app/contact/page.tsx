"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MapPin,
  Phone,
  Clock3,
  Send,
  MessageCircle,
  Sparkles,
  Bot,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "general",
    message: "",
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "general",
      message: "",
    });
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#FCFBFE] text-slate-800">
      {/* ==================================================
          HERO BANNER
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-100/50 via-white to-transparent pt-16 pb-14 sm:pt-20 sm:pb-16 border-b border-purple-100/60">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-sm backdrop-blur-md mb-5"
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>24/7 Community Support</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]"
          >
            We&apos;re Here to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Help You Make an Impact
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed"
          >
            Have a question about a campaign, your credits, payouts, or partnerships? Reach out to our team or chat directly with our AI assistant.
          </motion.p>
        </div>
      </section>

      {/* ==================================================
          CONTACT GRID (INFO + FORM)
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT SIDE: Contact Channels & Cards */}
          <div className="lg:col-span-5 space-y-6">
            {/* Main Gradient Contact Card */}
            <div className="rounded-3xl bg-gradient-to-br from-purple-700 via-indigo-700 to-slate-900 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-xl" />

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-md mb-6">
                <MessageCircle className="h-7 w-7" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Let&apos;s Connect
              </h2>
              <p className="mt-2 text-sm text-purple-100 leading-relaxed">
                Our support team typically responds to inquiries within 2 to 4 business hours.
              </p>

              <div className="mt-8 space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-purple-200 tracking-wider">
                      Direct Email
                    </p>
                    <a
                      href="mailto:support@fundwave.com"
                      className="mt-1 block text-sm sm:text-base font-semibold hover:text-purple-200 transition-colors"
                    >
                      support@fundwave.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-purple-200 tracking-wider">
                      Toll-Free Phone
                    </p>
                    <a
                      href="tel:+8801800386392"
                      className="mt-1 block text-sm sm:text-base font-semibold hover:text-purple-200 transition-colors"
                    >
                      +880 1800-FUNDWAVE
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-purple-200 tracking-wider">
                      Headquarters
                    </p>
                    <p className="mt-1 text-sm sm:text-base font-semibold">
                      Gulshan Avenue, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-purple-200 tracking-wider">
                      Support Schedule
                    </p>
                    <p className="mt-1 text-sm font-semibold">
                      Mon – Sat: 9:00 AM – 8:00 PM (GMT+6)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Quick Help Card */}
            <Link
              href="/aichat"
              className="group flex items-center justify-between rounded-3xl border border-purple-200/80 bg-gradient-to-r from-purple-50 via-white to-indigo-50 p-6 shadow-sm hover:border-purple-400 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Need Instant Answers?
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chat with FundWave AI for real-time guidance
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-purple-600 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* RIGHT SIDE: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-sm relative">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900">
                      Message Received!
                    </h3>
                    <p className="max-w-md mx-auto text-sm text-slate-600 leading-relaxed">
                      Thank you for contacting FundWave. A confirmation email has been logged, and our team will get back to you shortly.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-700 transition-all cursor-pointer shadow-md shadow-purple-600/20"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Send Another Message</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                        Inquiry Form
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                        Send Us a Direct Message
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        Fill out the details below and select the appropriate category for rapid routing.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Full Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            placeholder="John Doe"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>

                        {/* Email Address */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="you@domain.com"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Category */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Department / Topic
                          </label>
                          <select
                            value={formData.category}
                            onChange={(e) =>
                              setFormData({ ...formData, category: e.target.value })
                            }
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all cursor-pointer font-medium"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="campaigns">Campaign Creation & Approval</option>
                            <option value="backer">Backer & Credit Pledges</option>
                            <option value="payouts">Creator Withdrawals & Finance</option>
                            <option value="safety">Safety, Trust & Fraud Report</option>
                          </select>
                        </div>

                        {/* Subject */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                            Subject *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) =>
                              setFormData({ ...formData, subject: e.target.value })
                            }
                            placeholder="Brief summary of inquiry"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Message Body */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                          Your Message *
                        </label>
                        <textarea
                          rows={5}
                          required
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          placeholder="How can our community support team assist you today?"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={submitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30 transition-all cursor-pointer active:scale-98 disabled:opacity-70"
                      >
                        {submitting ? (
                          <span>Sending Message...</span>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          SUPPORT TOPICS / QUICK HELPDESK
      ================================================== */}
      <section className="bg-slate-50/70 border-t border-slate-200/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Self-Service Resources
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Common Support Topics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 mb-4">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Credits & Transactions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Learn how platform credits are topped up, escrowed, or refunded automatically upon request rejection.
              </p>
              <Link
                href="/howitworks"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700"
              >
                <span>Read guide</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-4">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Campaign Review Times
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Submitted campaigns undergo administrative compliance review within 24 to 48 hours before going public.
              </p>
              <Link
                href="/dashboard/Creator/Addnewcampaign"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700"
              >
                <span>Creator guidelines</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 mb-4">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Trust & Safety Flags
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Report suspect projects or breach of terms directly to our Trust & Safety compliance desk for audit.
              </p>
              <a
                href="mailto:safety@fundwave.com"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700"
              >
                <span>Contact safety team</span>
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
