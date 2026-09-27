
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Autoplay,
  Pagination,
  EffectFade,
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import {
  Play,
  Sparkles,
  ArrowUpRight,
  Heart,
  Users,
  Target,
  X,
} from 'lucide-react';

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
  videoUrl: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: 'Crowdfund the future',
    titlePart1: 'Fund Ideas. Build',
    titlePart2: 'Communities.',
    highlightText: 'Create Impact.',
    description:
      'FundBuddy connects creative minds with generous hearts. Support meaningful projects and be part of something bigger.',

    primaryBtnText: 'Explore Campaigns',
    primaryBtnLink: '/explorecampaigns',

    secondaryBtnText: 'Start a Campaign',
    secondaryBtnLink: '/register',

    overlayText1: 'Together, we can',
    overlayText2: 'make it happen.',

    imageUrl:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',

    videoUrl: '/videos/video-1.mp4',
  },

  {
    id: 2,
    badge: 'Support Creators Worldwide',
    titlePart1: 'Empower Dreams.',
    titlePart2: 'Fuel Innovation.',
    highlightText: 'Change Lives.',
    description:
      'Discover innovative products, art, and community causes. Help creators transform groundbreaking ideas into reality.',

    primaryBtnText: 'Explore Campaigns',
    primaryBtnLink: '/explorecampaigns',

    secondaryBtnText: 'Join as Supporter',
    secondaryBtnLink: '/register',

    overlayText1: 'Your credits make',
    overlayText2: 'dreams come true.',

    imageUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',

    videoUrl: '/videos/video-2.mp4',
  },

  {
    id: 3,
    badge: 'Launch Your Campaign',
    titlePart1: 'Share Stories.',
    titlePart2: 'Raise Capital.',
    highlightText: 'Grow Fast.',
    description:
      'Get welcome credits upon registration, showcase your vision to supporters, and request withdrawals easily.',

    primaryBtnText: 'Start a Campaign',
    primaryBtnLink: '/explorecampaigns',

    secondaryBtnText: 'Learn More',
    secondaryBtnLink: '/#how-it-works',

    overlayText1: 'Turn your passion',
    overlayText2: 'into a movement.',

    imageUrl:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1200&auto=format&fit=crop',

    videoUrl: '/videos/video-3.mp4',
  },
];

/* ============================================
   Animation Variants
============================================ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 50,
    scale: 0.97,
  },

  visible: {
    opacity: 1,
    x: 0,
    scale: 1,

    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const buttonHover = {
  y: -3,
  scale: 1.02,

  transition: {
    duration: 0.2,
  },
};

/* ============================================
   Component
============================================ */

export default function HeroSection() {
  /*
   * Currently playing video ID
   */
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  /*
   * Swiper slide change হলে video বন্ধ করে image দেখাবে
   */
  const handleSlideChange = () => {
    setPlayingVideo(null);
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#FAFAFC] py-10 sm:py-14 lg:py-20">

      {/* ============================================
          Background Glow
      ============================================ */}

      <motion.div
        className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-purple-200/30 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, 25, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Decorative Dots */}

      <div className="pointer-events-none absolute left-[8%] top-[20%] hidden h-2 w-2 rounded-full bg-purple-400/50 lg:block" />

      <div className="pointer-events-none absolute right-[10%] top-[30%] hidden h-3 w-3 rounded-full bg-indigo-400/40 lg:block" />

      <div className="pointer-events-none absolute bottom-[20%] left-[45%] hidden h-2 w-2 rounded-full bg-purple-300 lg:block" />

      {/* ============================================
          Main Container
      ============================================ */}

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{
            crossFade: true,
          }}
          slidesPerView={1}
          loop
          speed={900}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          onSlideChange={handleSlideChange}
          className="hero-swiper-custom"
        >

          {slides.map((slide) => (

            <SwiperSlide key={slide.id}>

              <div className="grid min-h-[580px] grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">

                {/* ============================================
                    LEFT CONTENT
                ============================================ */}

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-6 text-left lg:col-span-6"
                >

                  {/* Badge */}

                  <motion.div variants={fadeUp}>

                    <div className="inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white/80 px-4 py-2 text-xs font-semibold tracking-wide text-purple-700 shadow-sm backdrop-blur-md">

                      <span className="relative flex h-2 w-2">

                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />

                        <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />

                      </span>

                      <Sparkles className="h-3.5 w-3.5" />

                      <span>
                        {slide.badge}
                      </span>

                    </div>

                  </motion.div>

                  {/* Heading */}

                  <motion.h1
                    variants={fadeUp}
                    className="max-w-3xl text-4xl font-black leading-[1.08] tracking-[-0.03em] text-slate-950 sm:text-5xl lg:text-[58px] xl:text-[64px]"
                  >

                    {slide.titlePart1}

                    <br className="hidden sm:block" />

                    {slide.titlePart2}{' '}

                    <span className="relative inline-block text-purple-600">

                      {slide.highlightText}

                      <motion.span
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: '100%',
                        }}
                        transition={{
                          delay: 0.8,
                          duration: 0.7,
                        }}
                        className="absolute -bottom-1 left-0 h-1 rounded-full bg-purple-200"
                      />

                    </span>

                  </motion.h1>

                  {/* Description */}

                  <motion.p
                    variants={fadeUp}
                    className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Buttons */}

                  <motion.div
                    variants={fadeUp}
                    className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center"
                  >

                    {/* Primary Button */}

                    <motion.div
                      whileHover={buttonHover}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >

                      <Link
                        href={slide.primaryBtnLink}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-600/25 transition-all duration-300 hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-600/30 sm:w-auto"
                      >

                        {slide.primaryBtnText}

                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

                      </Link>

                    </motion.div>

                    {/* Secondary Button */}

                    <motion.div
                      whileHover={buttonHover}
                      whileTap={{
                        scale: 0.97,
                      }}
                    >

                      <Link
                        href={slide.secondaryBtnLink}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-800 shadow-sm transition-all duration-300 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 sm:w-auto"
                      >

                        {slide.secondaryBtnText}

                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

                      </Link>

                    </motion.div>

                  </motion.div>

                  {/* Stats */}

                  <motion.div
                    variants={fadeUp}
                    className="flex flex-wrap items-center gap-4 pt-4 sm:gap-5"
                  >

                    {/* Supporters */}

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <Users className="h-4 w-4" />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          10K+
                        </p>

                        <p className="text-xs text-slate-500">
                          Supporters
                        </p>

                      </div>

                    </div>

                    <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                    {/* Campaigns */}

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <Target className="h-4 w-4" />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          500+
                        </p>

                        <p className="text-xs text-slate-500">
                          Campaigns
                        </p>

                      </div>

                    </div>

                    <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                    {/* Success Rate */}

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                        <Heart className="h-4 w-4" />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-900">
                          98%
                        </p>

                        <p className="text-xs text-slate-500">
                          Success Rate
                        </p>

                      </div>

                    </div>

                  </motion.div>

                </motion.div>

                {/* ============================================
                    RIGHT SIDE
                ============================================ */}

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeRight}
                  className="relative lg:col-span-6"
                >

                  {/* Glow */}

                  <div className="absolute -inset-5 rounded-[45px] bg-gradient-to-br from-purple-200/40 via-transparent to-indigo-200/40 blur-2xl" />

                  {/* Main Media Container */}

                  <motion.div
                    whileHover={{
                      y: -5,
                    }}
                    transition={{
                      duration: 0.4,
                    }}
                    className="group relative h-[360px] w-full overflow-hidden rounded-[30px] border border-white bg-slate-100 shadow-2xl shadow-slate-300/50 sm:h-[450px] lg:h-[500px] lg:rounded-[36px]"
                  >

                    {/* ============================================
                        IMAGE
                    ============================================ */}

                    {playingVideo !== slide.id && (

                      <Image
                        src={slide.imageUrl}
                        alt="FundBuddy campaign"
                        fill
                        priority={slide.id === 1}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      />

                    )}

                    {/* ============================================
                        VIDEO
                    ============================================ */}

                    {playingVideo === slide.id && (

                      <motion.video
                        initial={{
                          opacity: 0,
                          scale: 1.04,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.5,
                        }}
                        src={slide.videoUrl}
                        autoPlay
                        controls
                        playsInline
                        className="absolute inset-0 z-40 h-full w-full object-cover"
                        onEnded={() => {
                          setPlayingVideo(null);
                        }}
                      />

                    )}

                    {/* ============================================
                        IMAGE OVERLAY + CONTENT
                    ============================================ */}

                    {playingVideo !== slide.id && (
                      <>

                        {/* Gradient */}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/10 to-transparent" />

                        {/* Top Badge */}

                        <motion.div
                          initial={{
                            opacity: 0,
                            y: -15,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.5,
                            duration: 0.6,
                          }}
                          className="absolute left-5 top-5 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-xl sm:left-6 sm:top-6"
                        >

                          <Sparkles className="h-3.5 w-3.5 text-purple-200" />

                          <span>
                            Make an Impact
                          </span>

                        </motion.div>

                        {/* ============================================
                            PLAY BUTTON
                        ============================================ */}

                        <div className="absolute inset-0 z-20 flex items-center justify-center">

                          {/* Pulse Ring */}

                          <motion.span
                            animate={{
                              scale: [1, 1.35, 1],
                              opacity: [0.35, 0, 0.35],
                            }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                            className="absolute h-24 w-24 rounded-full bg-purple-500 sm:h-28 sm:w-28"
                          />

                          {/* Button */}

                          <motion.button
                            onClick={() => {
                              setPlayingVideo(slide.id);
                            }}
                            whileHover={{
                              scale: 1.12,
                            }}
                            whileTap={{
                              scale: 0.95,
                            }}
                            aria-label="Play video"
                            className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-purple-600 text-white shadow-2xl shadow-purple-900/40 transition-colors duration-300 hover:bg-purple-700 sm:h-20 sm:w-20"
                          >

                            <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />

                          </motion.button>

                        </div>

                        {/* ============================================
                            BOTTOM CONTENT CARD
                        ============================================ */}

                        <motion.div
                          initial={{
                            opacity: 0,
                            y: 25,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: 0.7,
                            duration: 0.7,
                          }}
                          className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl border border-white/20 bg-white/90 p-5 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[300px]"
                        >

                          <div className="mb-2 flex items-center gap-2">

                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                              <Heart className="h-4 w-4 fill-current" />
                            </div>

                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                              Community Impact
                            </span>

                          </div>

                          <p className="text-base font-bold leading-snug text-slate-900 sm:text-lg">
                            {slide.overlayText1}
                          </p>

                          <p className="text-base font-extrabold leading-snug text-purple-600 sm:text-lg">
                            {slide.overlayText2}
                          </p>

                        </motion.div>

                        {/* ============================================
                            FLOATING MINI CARD
                        ============================================ */}

                        <motion.div
                          animate={{
                            y: [0, -8, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="absolute right-5 top-20 z-20 hidden rounded-2xl border border-white/20 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block"
                        >

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                              <Target className="h-4 w-4" />
                            </div>

                            <div>

                              <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                Active Projects
                              </p>

                              <p className="text-sm font-bold text-slate-900">
                                500+
                              </p>

                            </div>

                          </div>

                        </motion.div>

                      </>
                    )}

                    {/* ============================================
                        VIDEO CLOSE BUTTON
                    ============================================ */}

                    {playingVideo === slide.id && (

                      <motion.button
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        whileHover={{
                          scale: 1.1,
                        }}
                        whileTap={{
                          scale: 0.9,
                        }}
                        onClick={() => {
                          setPlayingVideo(null);
                        }}
                        aria-label="Close video"
                        className="absolute right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-xl backdrop-blur-md transition-colors hover:bg-black/70"
                      >

                        <X className="h-5 w-5" />

                      </motion.button>

                    )}

                  </motion.div>

                </motion.div>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

      {/* ============================================
          Custom Pagination
      ============================================ */}

      <style jsx global>{`

        .hero-swiper-custom {
          padding-bottom: 55px !important;
        }

        .hero-swiper-custom .swiper-pagination {
          bottom: 0 !important;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 6px;
        }

        .hero-swiper-custom
          .swiper-pagination-bullet {

          width: 7px;
          height: 7px;

          margin: 0 !important;

          border-radius: 999px;

          background: #cbd5e1;

          opacity: 1;

          transition:
            width 0.35s ease,
            background 0.35s ease,
            transform 0.35s ease;
        }

        .hero-swiper-custom
          .swiper-pagination-bullet:hover {

          transform: scale(1.2);
        }

        .hero-swiper-custom
          .swiper-pagination-bullet-active {

          width: 30px;

          background: #9333ea;
        }

        @media (max-width: 640px) {

          .hero-swiper-custom {
            padding-bottom: 45px !important;
          }

        }

      `}</style>

    </section>
  );
}

