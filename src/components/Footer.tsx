'use client';
import { usePathname } from "next/navigation";
import Link from 'next/link';
import { 
  Heart, 
  Sparkles,
  Mail,
  MapPin
} from 'lucide-react';

export default function Footer() {





  // const pathname = usePathname();

  //  if (pathname.includes("/dashboard")) {
  //   return null;
  // }


  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          
          {/* Column 1: Brand Logo & Description */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-xl">
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <span>FundBuddy</span>
            </Link>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering creators and supporters around the globe to fund amazing campaigns, share ideas, and build extraordinary communities together.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span>Dhaka, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>support@fundbuddy.com</span>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="hover:text-purple-400 transition-colors">
                  Explore Campaigns
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-purple-400 transition-colors">
                  Join as Creator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Social Links */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-white font-semibold text-sm tracking-wider uppercase">
              Connect With Us
            </h3>
            <p className="text-sm text-slate-400">
              Follow us on social media to get the latest updates on trending campaigns.
            </p>

            {/* Social Media SVG Icons */}
            <div className="flex items-center gap-3 pt-2">
              {/* GitHub */}
              <a
                href="https://github.com/MDSOBUJMADBOR"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/md-sobuj-madbor"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://web.facebook.com/sobuj.madbor.735717"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://x.com/MMadbor88566"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-300 flex items-center justify-center transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FundBuddy. All rights reserved.</p>
          
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> for Creators & Supporters.
          </p>

          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}