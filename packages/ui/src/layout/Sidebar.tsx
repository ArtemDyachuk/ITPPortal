"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import UsersIcon from "../icons/UsersIcon";
import AgenciesIcon from "../icons/AgenciesIcon";
import MapIcon from "../icons/MapIcon";
import DropdownArrowIcon from "../icons/DropdownArrowIcon";
import FeedbackIcon from "../icons/FeedbackIcon";
import AccountIcon from "../icons/AccountIcon";
import DotMenuIcon from "../icons/DotMenuIcon";

export default function Sidebar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDotMenuOpen, setIsDotMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const pathname = usePathname();
  const dotMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dot menu when clicking outside
  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (dotMenuRef.current && !dotMenuRef.current.contains(e.target as Node)) {
        setIsDotMenuOpen(false);
      }
    }

    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  const navItems = [
    { href: "/events-map", label: "Events Map", icon: <MapIcon size={20} className="shrink-0" /> },
    { href: "/users", label: "Users", icon: <UsersIcon size={20} className="shrink-0" /> },
    { href: "/agencies", label: "Agencies", icon: <AgenciesIcon size={20} className="shrink-0" /> },
  ];

  const isActive = (path: string) => pathname.includes(path);

  return (
    <>
      {/* Mobile Top Nav Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm z-40 flex items-center justify-between px-4">
        {/* App Logo/Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border border-gray-200 dark:border-slate-600 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-slate-700 overflow-hidden">
            <img src="/logo/AgencyLogo.webp" alt="ITS Platform" className="w-8 h-8 object-contain" />
          </div>
          <span className="font-semibold text-md text-gray-800 dark:text-white">ITS Platform</span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Spacer for mobile top nav */}
      <div className="md:hidden h-14" />

      {/* Backdrop for mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-opacity-60 backdrop-blur-sm z-5000 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`h-screen flex flex-col bg-white dark:bg-slate-800 shadow-sm transition-all duration-300
          md:relative md:z-40  
          ${isDesktopCollapsed ? 'md:w-16' : 'md:w-52'}
          max-md:fixed max-md:top-0 max-md:z-5000 max-md:w-52   
          ${isMobileMenuOpen ? 'max-md:right-0' : 'max-md:-right-52'}`}
      >
        {/* Centered collapse/expand button on right edge, middle of sidebar */}
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-3 z-20">
          <button
            onClick={() => {
              // Mobile: toggle menu open/close
              // Desktop: toggle collapsed/expanded
              if (window.innerWidth < 768) {
                setIsMobileMenuOpen(!isMobileMenuOpen);
              } else {
                setIsDesktopCollapsed(!isDesktopCollapsed);
              }
            }}
            className="flex items-center justify-center w-7 h-8 bg-white dark:bg-slate-700 border-none rounded-sm cursor-pointer transition-all duration-300 hover:bg-gray-100 dark:hover:bg-slate-600"
            aria-label={isDesktopCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <DropdownArrowIcon
              size={20}
              strokeWidth={3}
              className="text-gray-600 dark:text-gray-400"
              color="#4b5563"
              direction={isMobileMenuOpen || !isDesktopCollapsed ? 'right' : 'left'}
            />
          </button>
        </div>

        {/* Top Section */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between md:hidden mb-3">
            <span className="font-semibold text-md text-gray-800 dark:text-white"></span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className={`flex items-center justify-between ${isDesktopCollapsed ? 'md:flex-col md:gap-2' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-gray-200 dark:border-slate-600 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-slate-700 overflow-hidden">
                <img src="/logo/AgencyLogo.webp" alt="ITS Platform" className="w-8 h-8 object-contain" />
              </div>
              <span className={`font-semibold text-md text-gray-800 dark:text-white whitespace-nowrap ${!isMobileMenuOpen ? 'max-md:hidden' : ''} ${isDesktopCollapsed ? 'md:hidden' : ''}`}>ITS Platform</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive(item.href)
                ? "bg-blue-50 dark:bg-blue-900/30 text-[#009FDB] dark:text-blue-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="text-xl">{item.icon}</span>
              <span className={`whitespace-nowrap ${!isMobileMenuOpen ? 'max-md:hidden' : ''} ${isDesktopCollapsed ? 'md:hidden' : ''}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-slate-700 flex flex-col">
          {/* Feedback Button */}
          <Link
            href="/feedback"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FeedbackIcon size={20} strokeWidth={0.25} className="shrink-0" color="#000000" />
            <span className={`whitespace-nowrap ${!isMobileMenuOpen ? 'max-md:hidden' : ''} ${isDesktopCollapsed ? 'md:hidden' : ''}`}>Feedback</span>
          </Link>

          {/* User Block: duplicate Feedback styling, smaller icon in round bg, dot menu on right */}
          <div className="relative">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsUserMenuOpen(!isUserMenuOpen); }}
              className={`flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors`}
            >
              <AccountIcon size={16} className="shrink-0 text-gray-700 dark:text-gray-300" />

              <div className={`whitespace-nowrap flex-1 ${!isMobileMenuOpen ? 'max-md:hidden' : ''} ${isDesktopCollapsed ? 'md:hidden' : ''}`}>
                <span>User Name</span>
              </div>

              <div ref={dotMenuRef} className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsDotMenuOpen((s) => !s); }}
                  className={`w-6 h-6 text-gray-400 dark:text-gray-500 shrink-0 flex items-center justify-center ${!isMobileMenuOpen ? 'max-md:hidden' : ''} ${isDesktopCollapsed ? 'md:hidden' : ''}`}
                  aria-label="User options"
                >
                  <DotMenuIcon className="w-4 h-4" />
                </button>

                {isDotMenuOpen && (isMobileMenuOpen || !isDesktopCollapsed) && (
                  <div className="absolute bottom-full right-0 mr-2 mb-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden z-20">
                    <Link
                      href="/account"
                      onClick={() => { setIsDotMenuOpen(false); setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}
                      className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Account
                    </Link>
                    <Link
                      href="/"
                      onClick={() => { setIsDotMenuOpen(false); setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}
                      className="block px-4 py-3 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (isMobileMenuOpen || !isDesktopCollapsed) && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden z-10">
                <Link
                  href="/account"
                  onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Account
                </Link>
                <Link
                  href="/"
                  onClick={() => { setIsUserMenuOpen(false); setIsMobileMenuOpen(false); }}
                  className="block px-4 py-3 text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
