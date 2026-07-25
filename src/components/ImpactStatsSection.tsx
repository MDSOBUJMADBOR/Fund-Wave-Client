'use client';

import React from 'react';
import { CircleDollarSign, FolderCheck, Users, ShieldCheck } from 'lucide-react';

const stats = [
  {
    value: "1.2M+",
    label: "Credits Contributed",
    description: "Directly invested into innovative campaigns",
    icon: <CircleDollarSign className="w-6 h-6 text-purple-600" />
  },
  {
    value: "450+",
    label: "Successful Projects",
    description: "Campaigns that reached their target goal",
    icon: <FolderCheck className="w-6 h-6 text-purple-600" />
  },
  {
    value: "15,000+",
    label: "Active Supporters",
    description: "Backers helping bring ideas to life",
    icon: <Users className="w-6 h-6 text-purple-600" />
  },
  {
    value: "99.8%",
    label: "Satisfaction Rate",
    description: "Verified transparency & safe credit usage",
    icon: <ShieldCheck className="w-6 h-6 text-purple-600" />
  }
];

export default function ImpactStatsSection() {
  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      
      {/* Soft Glow Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-purple-400 font-semibold text-xs tracking-wider uppercase bg-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/10">
            Our Community Growth
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Platform Impact in <span className="text-purple-400">Numbers</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Together, our creators and supporters are making a measurable difference every single day.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/60 flex flex-col items-center text-center hover:border-purple-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                {stat.icon}
              </div>

              <span className="text-4xl sm:text-5xl font-black text-white mb-2">
                {stat.value}
              </span>

              <h3 className="text-purple-300 font-bold text-base mb-1">
                {stat.label}
              </h3>

              <p className="text-slate-400 text-xs leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}