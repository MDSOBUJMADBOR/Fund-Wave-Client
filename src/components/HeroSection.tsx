'use client';

import React from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Swiper CSS Module Imports
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Lucide Icons
import { Play, Sparkles } from 'lucide-react';

interface SlideData {
  id: number;
  badge: string;
  titlePart1: string;
  titlePart2: string;
  highlightText: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  overlayText1: string;
  overlayText2: string;
  imageUrl: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "Crowdfund the future",
    titlePart1: "Fund Ideas. Build",
    titlePart2: "Communities.",
    highlightText: "Create Impact.",
    description: "FundBuddy connects creative minds with generous hearts. Support meaningful projects and be part of something bigger.",
    primaryBtnText: "Explore Campaigns",
    primaryBtnLink: "/explorecampaigns",
    secondaryBtnText: "Start a Campaign",
    secondaryBtnLink: "/register",
    overlayText1: "Together, we can",
    overlayText2: "make it happen.",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    badge: "Support Creators Worldwide",
    titlePart1: "Empower Dreams.",
    titlePart2: "Fuel Innovation.",
    highlightText: "Change Lives.",
    description: "Discover innovative products, art, and community causes. Help creators transform groundbreaking ideas into reality.",
    primaryBtnText: "Explore Campaigns",
    primaryBtnLink: "/explorecampaigns",
    secondaryBtnText: "Join as Supporter",
    secondaryBtnLink: "/register",
    overlayText1: "Your credits make",
    overlayText2: "dreams come true.",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    badge: "Launch Your Campaign",
    titlePart1: "Share Stories.",
    titlePart2: "Raise Capital.",
    highlightText: "Grow Fast.",
    description: "Get welcome credits upon registration, showcase your vision to supporters, and request withdrawals easily.",
    primaryBtnText: "Start a Campaign",
    primaryBtnLink: "/explorecampaigns",
    secondaryBtnText: "Learn More",
    secondaryBtnLink: "/#how-it-works",
    overlayText1: "Turn your passion",
    overlayText2: "into a movement.",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop"
  }
];

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#FAFAFC] py-12 lg:py-20 overflow-hidden">
      
      {/* Background Soft Glow Spheres */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          className="hero-swiper-custom"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center min-h-[500px]">
                
                {/* Left Side Content */}
                <div className="lg:col-span-6 space-y-6 text-left">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100/80 text-purple-700 text-xs font-semibold tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>{slide.badge}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight leading-[1.12]">
                    {slide.titlePart1} <br className="hidden sm:inline" />
                    {slide.titlePart2}{' '}
                    <span className="text-purple-600">{slide.highlightText}</span>
                  </h1>

                  {/* Description */}
                  <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed font-normal">
                    {slide.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={slide.primaryBtnLink}
                      className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-purple-600/25 flex items-center justify-center"
                    >
                      {slide.primaryBtnText}
                    </Link>

                    <Link
                      href={slide.secondaryBtnLink}
                      className="px-8 py-3.5 bg-white hover:bg-slate-50 active:scale-95 text-slate-800 border border-slate-200/80 font-semibold text-sm rounded-xl transition-all duration-200 shadow-sm"
                    >
                      {slide.secondaryBtnText}
                    </Link>
                  </div>
                </div>

                {/* Right Side Image Showcase */}
                <div className="lg:col-span-6 relative">
                  <div className="relative w-full h-[360px] sm:h-[440px] rounded-[36px] overflow-hidden shadow-2xl shadow-slate-300/60 border border-white">
                    
                    {/* Main Image */}
                    <img
                      src={slide.imageUrl}
                      alt="Hero Showcase"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />

                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 bg-slate-900/10" />

                    {/* Animated Video Play Button */}
                    <div className="absolute inset-0 m-auto w-20 h-20 flex items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-purple-600/40 animate-ping" />
                      <button 
                        aria-label="Play video"
                        className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-xl shadow-purple-600/40 hover:scale-110"
                      >
                        <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                      </button>
                    </div>

                    {/* Floating Bottom Left Card */}
                    <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-6 py-4.5 rounded-2xl shadow-xl border border-white/60 max-w-[260px] sm:max-w-[280px]">
                      <p className="text-slate-900 font-bold text-base sm:text-lg leading-snug">
                        {slide.overlayText1}
                      </p>
                      <p className="text-purple-600 font-extrabold text-base sm:text-lg leading-snug">
                        {slide.overlayText2}
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Swiper Pagination Dots */}
      <style jsx global>{`
        .hero-swiper-custom {
          padding-bottom: 48px !important;
        }
        .hero-swiper-custom .swiper-pagination {
          bottom: 0 !important;
        }
        .hero-swiper-custom .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hero-swiper-custom .swiper-pagination-bullet-active {
          background: #9333ea;
          width: 28px;
          border-radius: 999px;
        }
      `}</style>
    </section>
  );
}