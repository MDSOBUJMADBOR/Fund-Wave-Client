
"use client";

import React, { FormEvent } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Clock3,
  Send,
  MessageCircle,
  HeartHandshake,
} from "lucide-react";

const ContactPage = () => {



const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  alert("Thank you! Your message has been submitted.");

  // Reset all form fields
  event.currentTarget.reset();
};





  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-200">
              Get In Touch
            </p>

            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              We&apos;d Love to Hear From You
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-violet-100 sm:text-lg">
              Have a question about FundWave, a campaign, or your account?
              Send us a message and our team will be happy to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact Information */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-800 p-8 text-white shadow-xl sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                <HeartHandshake className="h-7 w-7" />
              </div>

              <h2 className="mt-7 text-2xl font-bold sm:text-3xl">
                Let&apos;s Connect
              </h2>

              <p className="mt-4 leading-7 text-violet-100">
                Whether you are a Supporter, Creator, or simply interested in
                FundWave, we are here to answer your questions.
              </p>

              <div className="mt-10 space-y-7">
                {/* Email */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Mail className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-violet-200">
                      Email
                    </p>

                    <a
                      href="mailto:support@fundwave.com"
                      className="mt-1 block text-sm font-medium transition hover:text-violet-200"
                    >
                      support@fundwave.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Phone className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-violet-200">
                      Phone
                    </p>

                    <a
                      href="tel:+8801000000000"
                      className="mt-1 block text-sm font-medium transition hover:text-violet-200"
                    >
                      +880 1000-000000
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-violet-200">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Clock3 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-violet-200">
                      Support Hours
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      Saturday - Thursday
                    </p>

                    <p className="mt-1 text-xs text-violet-200">
                      10:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                  Send a Message
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                  How can we help?
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Fill out the form below and tell us what you need help with.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {/* Name + Email */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email Address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is your message about?"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                {/* User Type */}
                <div>
                  <label
                    htmlFor="userType"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    I am a
                  </label>

                  <select
                    id="userType"
                    name="userType"
                    defaultValue=""
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="supporter">Supporter</option>
                    <option value="creator">Creator</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Write your message here..."
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-700 active:scale-[0.99]"
                >
                  <Send className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Help Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
              Need Help?
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              We&apos;re here for your crowdfunding journey
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Whether you are supporting a project or building your own
              campaign, FundWave is designed to make the process simple.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <h3 className="font-bold text-slate-900">
                Campaign Questions
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Need information about creating or supporting a campaign?
                We&apos;re happy to help.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <h3 className="font-bold text-slate-900">
                Account Support
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Having trouble with your account, credits, or dashboard?
                Contact our support team.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
              <h3 className="font-bold text-slate-900">
                Platform Feedback
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Have an idea that could make FundWave better? Send us your
                feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-3xl bg-gradient-to-r from-violet-700 to-indigo-700 px-6 py-14 text-center shadow-xl sm:px-12">
          <HeartHandshake className="mx-auto h-12 w-12 text-white" />

          <h2 className="mt-5 text-3xl font-bold text-white sm:text-4xl">
            Ready to make an impact?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-violet-100">
            Explore campaigns, support meaningful projects, or start a
            campaign of your own.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/campaigns"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              Explore Campaigns
            </a>

            <a
              href="/register"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;

