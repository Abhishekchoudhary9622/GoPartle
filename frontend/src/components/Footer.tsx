'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Heart, Radio, Activity } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-[#06070A] text-slate-400 border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black shadow-md shadow-amber-500/20">
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-black rounded-full eq-bar-1" />
                  <span className="w-1 bg-black rounded-full eq-bar-2" />
                  <span className="w-1 bg-black rounded-full eq-bar-3" />
                </div>
              </div>
              <span className="text-2xl font-black tracking-tight text-white font-sans">
                Go<span className="text-amber-400">Pratle</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              The direct production desk connecting event organizers with top-tier planners, live acts, and technical stage crew across India.
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>BLR • BOM • HYD • DEL</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-amber-400 transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link href="/requirements/new" className="hover:text-amber-400 transition-colors">
                  Post a Requirement
                </Link>
              </li>
              <li>
                <Link href="/my-requirements" className="hover:text-amber-400 transition-colors">
                  My Requirements
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-bold tracking-wider uppercase text-white">
              Departments
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/events?category=planner" className="hover:text-amber-400 transition-colors">
                  Event Planners
                </Link>
              </li>
              <li>
                <Link href="/events?category=performer" className="hover:text-rose-400 transition-colors">
                  Live Performers &amp; Bands
                </Link>
              </li>
              <li>
                <Link href="/events?category=crew" className="hover:text-emerald-400 transition-colors">
                  Technical Crew &amp; FOH Audio
                </Link>
              </li>
              <li>
                <Link href="/events?eventType=Corporate" className="hover:text-amber-400 transition-colors">
                  Corporate Summits
                </Link>
              </li>
              <li>
                <Link href="/events?eventType=Wedding" className="hover:text-amber-400 transition-colors">
                  Weddings &amp; Sangeet
                </Link>
              </li>
            </ul>
          </div>

          {/* Assignment & Tech Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold tracking-wider uppercase text-white">
              Assignment Project
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Full-Stack Developer Intern assignment demonstrating modern Next.js 16 App Router, Express REST backend, MongoDB Atlas integration, dynamic 4-step wizard, and Obsidian Stage design system.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SERVER &amp; DB OPERATIONAL</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} GoPratle Platform. Built for Full-Stack Intern Assignment.</p>
          <div className="flex items-center gap-4">
            <span>Next.js 16</span>
            <span>•</span>
            <span>Node.js / Express</span>
            <span>•</span>
            <span>MongoDB Atlas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
