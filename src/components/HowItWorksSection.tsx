'use client';

import React from 'react';
import { UserPlus, Compass, HeartHandshake, Award } from 'lucide-react';

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description: "Sign up as a Supporter or Creator and get welcome credits instantly to start your journey.",
    icon: <UserPlus className="w-6 h-6 text-purple-600" />
  },
  {
    number: "02",
    title: "Explore or Launch",
    description: "Discover innovative campaigns across categories or launch your own project with clear goals.",
    icon: <Compass className="w-6 h-6 text-purple-600" />
  },
  {
    number: "03",
    title: "Contribute Credits",
    description: "Support your favorite creators by pledging platform credits and tracking live progress.",
    icon: <HeartHandshake className="w-6 h-6 text-purple-600" />
  },
  {
    number: "04",
    title: "Achieve & Withdraw",
    description: "Creators reach funding goals, post campaign updates, and withdraw funds seamlessly.",
    icon: <Award className="w-6 h-6 text-purple-600" />
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-purple-600 font-semibold text-xs tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How <span className="text-purple-600">FundBuddy</span> Works
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Simple steps to support creative minds or bring your own ideas to life.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className="bg-[#FAFAFC] rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-200 group-hover:text-purple-200 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-slate-900 font-bold text-lg mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}