'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, PlusCircle, Calendar, Home, Bookmark, Radio, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Browse Events', href: '/events', icon: Calendar },
    { name: 'Post Requirement', href: '/requirements/new', icon: PlusCircle },
    { name: 'My Requirements', href: '/my-requirements', icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#08090C]/90 border-b border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo with Stage Audio Indicator */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              {/* Miniature Soundboard EQ Visualizer */}
              <div className="flex items-end gap-1 h-5">
                <span className="w-1 bg-black rounded-full eq-bar-1" />
                <span className="w-1 bg-black rounded-full eq-bar-2" />
                <span className="w-1 bg-black rounded-full eq-bar-3" />
                <span className="w-1 bg-black rounded-full eq-bar-4" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                Go<span className="text-amber-400">Pratle</span>
              </span>
              <div className="flex items-center gap-1.5 -mt-1 hidden sm:flex">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400">
                  PRODUCTION NETWORK
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-amber-400 bg-amber-500/10 font-semibold border border-amber-500/25 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Live Telemetry & Post Button */}
          <div className="hidden md:flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12151E] border border-white/[0.06] text-xs font-mono text-slate-400">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>LIVE GIGS ACTIVE</span>
            </div>

            <Link
              href="/requirements/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all duration-200 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Post Requirement</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-300 hover:bg-[#151822]"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#08090C]/98 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                  isActive
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-[#151822]'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-amber-400' : 'text-slate-400')} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-3">
            <Link
              href="/requirements/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>Post Requirement</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
