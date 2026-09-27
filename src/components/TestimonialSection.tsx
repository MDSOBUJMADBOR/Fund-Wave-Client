"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

/* =====================================================
   Types
===================================================== */

interface Testimonial {
  id: number;
  name: string;
  email: string;
  role: "creator" | "supporter";
  image: string;
}

/* =====================================================
   Fallback Image
===================================================== */

const fallbackImage = "https://i.ibb.co/4pDNDk1/avatar.png";

/* =====================================================
   Testimonial Data
===================================================== */

const testimonials: Testimonial[] = [
  /* =========================
     CREATORS
  ========================= */

  {
    id: 1,
    name: "Alex Morgan",
    email: "alex@gmail.com",
    role: "creator",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 2,
    name: "David Chen",
    email: "david@gmail.com",
    role: "creator",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 3,
    name: "Sophia Martinez",
    email: "sophia@gmail.com",
    role: "creator",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 4,
    name: "Emily Carter",
    email: "emily@gmail.com",
    role: "creator",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 5,
    name: "Michael Brown",
    email: "michael@gmail.com",
    role: "creator",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
  },

  /* =========================
     SUPPORTERS
  ========================= */

  {
    id: 6,
    name: "Sarah Jenkins",
    email: "sarah@gmail.com",
    role: "supporter",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 7,
    name: "James Wilson",
    email: "james@gmail.com",
    role: "supporter",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 8,
    name: "Olivia Smith",
    email: "olivia@gmail.com",
    role: "supporter",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 9,
    name: "Daniel Brown",
    email: "daniel@gmail.com",
    role: "supporter",
    image:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=300&auto=format&fit=crop",
  },

  {
    id: 10,
    name: "Emma Wilson",
    email: "emma@gmail.com",
    role: "supporter",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=300&auto=format&fit=crop",
  },
];

/* =====================================================
   Testimonial Card
===================================================== */

const TestimonialCard = ({
  testimonial,
}: {
  testimonial: Testimonial;
}) => {
  return (
    <div
      className="
        group relative
        w-[280px] shrink-0
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        p-5
        shadow-[0_8px_30px_rgba(15,23,42,0.06)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-indigo-200
        hover:shadow-[0_15px_40px_rgba(79,70,229,0.14)]
        sm:w-[310px]
      "
    >
      {/* =================================================
          Decorative Glow
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -right-10
          -top-10
          h-28
          w-28
          rounded-full
          bg-indigo-500/10
          blur-3xl
          transition-all
          duration-500
          group-hover:bg-indigo-500/20
        "
      />

      {/* =================================================
          Card Content
      ================================================= */}

      <div className="relative flex items-center gap-4">
        {/* =================================================
            Avatar
        ================================================= */}

        <div
          className="
            relative
            h-16
            w-16
            shrink-0
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-slate-100
            shadow-sm
          "
        >
          <Image
            src={testimonial.image || fallbackImage}
            alt={testimonial.name || "User"}
            fill
            sizes="64px"
            unoptimized
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-110
            "
          />

          {/* Online Indicator */}

          <span
            className="
              absolute
              bottom-1
              right-1
              h-3
              w-3
              rounded-full
              border-2
              border-white
              bg-emerald-500
            "
          />
        </div>

        {/* =================================================
            User Information
        ================================================= */}

        <div className="min-w-0 flex-1">
          {/* Name */}

          <h3
            className="
              truncate
              text-base
              font-bold
              text-slate-900
            "
          >
            {testimonial.name}
          </h3>

          {/* Email */}

          <div className="mt-1 flex items-center gap-1.5">
            <Mail
              className="
                h-3.5
                w-3.5
                shrink-0
                text-slate-400
              "
            />

            <p
              className="
                truncate
                text-xs
                text-slate-500
              "
            >
              {testimonial.email}
            </p>
          </div>

          {/* Role */}

          <div
            className="
              mt-2
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-indigo-50
              px-2.5
              py-1
            "
          >
            <ShieldCheck
              className="
                h-3.5
                w-3.5
                text-indigo-600
              "
            />

            <span
              className="
                text-[11px]
                font-semibold
                capitalize
                text-indigo-600
              "
            >
              {testimonial.role}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================
          Divider
      ================================================= */}

      <div className="mt-5 h-px w-full bg-slate-100" />

      {/* =================================================
          Bottom Information
      ================================================= */}

      <div className="mt-3 flex items-center justify-between">
        <span
          className="
            text-xs
            font-medium
            text-slate-400
          "
        >
          FundBuddy{" "}
          {testimonial.role === "creator"
            ? "Creator"
            : "Supporter"}
        </span>

        <span
          className="
            flex
            items-center
            gap-1
            text-xs
            font-medium
            text-emerald-600
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-emerald-500
            "
          />

          Available
        </span>
      </div>
    </div>
  );
};

/* =====================================================
   Marquee Row
===================================================== */

const MarqueeRow = ({
  testimonials,
  reverse = false,
}: {
  testimonials: Testimonial[];
  reverse?: boolean;
}) => {
  /*
    Example:

    Original:
    A B C D E

    Duplicate:
    A B C D E A B C D E

    This allows the animation to continue
    smoothly without an empty space.
  */

  const items = [
    ...testimonials,
    ...testimonials,
  ];

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="flex w-max gap-5"
        initial={{
          x: reverse ? "-50%" : "0%",
        }}
        animate={{
          x: reverse ? "0%" : "-50%",
        }}
        transition={{
          duration: reverse ? 32 : 28,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
      >
        {items.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.id}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </motion.div>
    </div>
  );
};

/* =====================================================
   Main Testimonial Component
===================================================== */

export default function TestimonialSection() {
  /* =====================================================
     Creator Data
  ===================================================== */

  const creators = testimonials.filter(
    (item) => item.role === "creator"
  );

  /* =====================================================
     Supporter Data
  ===================================================== */

  const supporters = testimonials.filter(
    (item) => item.role === "supporter"
  );

  /* =====================================================
     Main UI
  ===================================================== */

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-slate-50
        px-4
        py-12
        sm:px-6
        sm:py-14
        lg:px-8
        lg:py-16
      "
    >
      {/* =================================================
          Background Decoration
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-10
          h-72
          w-72
          rounded-full
          bg-indigo-200/30
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-32
          -right-32
          h-80
          w-80
          rounded-full
          bg-blue-200/30
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl">
        {/* =================================================
            Section Header
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
          }}
          className="
            mx-auto
            mb-9
            max-w-2xl
            text-center
            sm:mb-11
          "
        >
          {/* Badge */}

          <div
            className="
              mb-4
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-indigo-100
              bg-indigo-50
              px-3.5
              py-1.5
              text-xs
              font-semibold
              text-indigo-600
            "
          >
            <Sparkles className="h-3.5 w-3.5" />

            Community Members
          </div>

          {/* Heading */}

          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-slate-900
              sm:text-3xl
              lg:text-4xl
            "
          >
            Meet Our{" "}
            <span className="text-indigo-600">
              Community
            </span>
          </h2>

          {/* Description */}

          <p
            className="
              mx-auto
              mt-3
              max-w-xl
              text-sm
              leading-6
              text-slate-500
              sm:text-base
            "
          >
            Meet the creators and supporters who make
            FundBuddy a growing community.
          </p>
        </motion.div>

        {/* =================================================
            Marquee Container
        ================================================= */}

        <div className="relative">
          {/* =================================================
              Left Fade
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-12
              bg-gradient-to-r
              from-slate-50
              to-transparent
              sm:w-20
              lg:w-32
            "
          />

          {/* =================================================
              Right Fade
          ================================================= */}

          <div
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-12
              bg-gradient-to-l
              from-slate-50
              to-transparent
              sm:w-20
              lg:w-32
            "
          />

          {/* =================================================
              TOP ROW
              CREATOR
              RIGHT → LEFT
          ================================================= */}

          <MarqueeRow
            testimonials={creators}
            reverse={false}
          />

          {/* =================================================
              BOTTOM ROW
              SUPPORTER
              LEFT → RIGHT
          ================================================= */}

          <div className="mt-5">
            <MarqueeRow
              testimonials={supporters}
              reverse={true}
            />
          </div>
        </div>

        {/* =================================================
            Bottom Text
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          whileInView={{
            opacity: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: 0.3,
            duration: 0.5,
          }}
          className="mt-8 text-center"
        >
          <p
            className="
              text-xs
              text-slate-400
              sm:text-sm
            "
          >
            Trusted creators and supporters helping
            bring great ideas to life.
          </p>
        </motion.div>
      </div>
    </section>
  );
}