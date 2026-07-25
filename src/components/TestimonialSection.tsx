'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Swiper CSS Module Imports
import 'swiper/css';
import 'swiper/css/pagination';

// Lucide Icons
import { Star, Quote, Sparkles } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  photo: string;
  rating: number;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Tech Campaign Creator",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "FundBuddy was instrumental in turning our smart home device from a prototype into reality. The community support and instant credit transfers made our fundraising seamless!"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Community Supporter",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "I love supporting creative ideas on FundBuddy. Purchasing credit packages is quick, and seeing creators bring their projects to life makes me feel genuinely connected."
  },
  {
    id: 3,
    name: "David Chen",
    role: "Indie Game Developer",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "The platform transparently handles every credit contributed. Requesting fund withdrawals was super easy once we hit our goal. Highly recommended for all creators!"
  },
  {
    id: 4,
    name: "Sophia Martinez",
    role: "Art & Culture Creator",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "As a first-time creator, I received 20 default credits just for signing up! The dashboard analytics made tracking contributions effortless."
  },
  {
    id: 5,
    name: "Michael Brown",
    role: "Startup Founder",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "FundBuddy helped us connect with supporters from around the world. The secure credit system made every contribution transparent and trustworthy."
  },
  {
    id: 6,
    name: "Emily Carter",
    role: "Education Project Creator",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "Launching my educational campaign was simple and stress-free. I loved how easy it was to engage with supporters and monitor campaign progress."
  },
  {
    id: 7,
    name: "James Wilson",
    role: "Creative Supporter",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    rating: 5,
    quote: "I've backed multiple campaigns through FundBuddy, and every experience has been smooth. It's rewarding to see innovative ideas receive the support they deserve."
  }
];

export default function TestimonialSection() {
  return (
    <section className="py-20 bg-[#FAFAFC] relative overflow-hidden">
      
      {/* Background Soft Glow Spheres */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-5 right-10 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-100/80 text-purple-700 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Community Feedback</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Loved by <span className="text-purple-600">Creators & Supporters</span>
          </h2>
          
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            See what our community members have to say about their journey with FundBuddy.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={28}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="testimonial-swiper-custom"
        >
          {testimonials.map((item) => (
            <SwiperSlide key={item.id} className="h-auto pb-14">
              <div className="bg-white/90 backdrop-blur-sm rounded-[24px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between h-full transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1.5 group">
                
                {/* Upper Content */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                      <Quote className="w-5 h-5 fill-current" />
                    </div>
                    
                    {/* Rating Stars */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Quote Text */}
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom Content: User Info */}
                <div className="flex items-center gap-3.5 pt-6 mt-6 border-t border-slate-100">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm shrink-0">
                    <img
                      src={item.photo}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-bold text-base leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-purple-600 text-xs font-semibold">
                      {item.role}
                    </p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>

      {/* Pagination Dot Styles */}
      <style jsx global>{`
        .testimonial-swiper-custom .swiper-pagination {
          bottom: 0 !important;
        }
        .testimonial-swiper-custom .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .testimonial-swiper-custom .swiper-pagination-bullet-active {
          background: #9333ea;
          width: 28px;
          border-radius: 999px;
        }
      `}</style>
    </section>
  );
}