'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Palette, Users, Activity, Rocket, Film, ArrowUpRight } from 'lucide-react';

const categories = [
  {
    name: "Technology",
    count: "120+ Campaigns",
    icon: <Cpu className="w-6 h-6 text-purple-600" />,
    description: "Smart gadgets, AI innovations, and software tools."
  },
  {
    name: "Art & Design",
    count: "85+ Campaigns",
    icon: <Palette className="w-6 h-6 text-purple-600" />,
    description: "Digital art, illustrations, and creative crafts."
  },
  {
    name: "Community",
    count: "150+ Campaigns",
    icon: <Users className="w-6 h-6 text-purple-600" />,
    description: "Social causes, local development, and clean water."
  },
  {
    name: "Health & Fitness",
    count: "60+ Campaigns",
    icon: <Activity className="w-6 h-6 text-purple-600" />,
    description: "Medical support, wellness products, and fitness tech."
  },
  {
    name: "Startups & Gaming",
    count: "95+ Campaigns",
    icon: <Rocket className="w-6 h-6 text-purple-600" />,
    description: "Indie games, tech startups, and novel products."
  },
  {
    name: "Film & Video",
    count: "40+ Campaigns",
    icon: <Film className="w-6 h-6 text-purple-600" />,
    description: "Short films, documentaries, and creative shows."
  }
];

export default function ExploreByCategorySection() {
  return (
    <section className="py-20 bg-[#FAFAFC] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3">
            <span className="text-purple-600 font-semibold text-xs tracking-wider uppercase bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100">
              Categories
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
              Explore by <span className="text-purple-600">Category</span>
            </h2>
          </div>
          <Link 
            href="/campaigns" 
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1 group"
          >
            <span>View All Campaigns</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/campaigns?category=${encodeURIComponent(cat.name)}`}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                    {cat.count}
                  </span>
                </div>

                <h3 className="text-slate-900 font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}