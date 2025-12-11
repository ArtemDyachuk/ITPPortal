"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showText, setShowText] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { href: "/events-map", label: "Events Map", icon: "📍" },
    { href: "/users", label: "Users", icon: "👥" },
    { href: "/agencies", label: "Agencies", icon: "🏢" },
  ];

  const isActive = (path: string) => pathname === path;

  // Delay showing text during expansion animation
  useEffect(() => {
    if (isCollapsed) {
      setShowText(false);
    } else {
      const timer = setTimeout(() => setShowText(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isCollapsed]);

  return (
    <>
      <aside
        className={`${
          isCollapsed ? "w-16" : "w-52"
        } fixed left-0 top-0 h-screen z-40 flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300`}
      >
        {/* Top Section */}
        <div className="p-4 border-b border-gray-200">
          <div className={`flex ${isCollapsed ? "flex-col items-center gap-2" : "items-center justify-between"}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center bg-blue-50">
                <span className="text-lg">🚦</span>
              </div>
              {!isCollapsed && showText && (
                <span className="font-semibold text-md text-gray-800">ITS Platform</span>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1 rounded hover:bg-gray-100 transition-colors ${isCollapsed ? "w-full flex justify-center" : ""}`}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 flex flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive(item.href)
                ? "bg-blue-50 text-blue-700 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && showText && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 flex flex-col">
          {/* Feedback Button */}
          <Link
            href="/feedback"
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="text-xl">💬</span>
            {!isCollapsed && showText && <span>Feedback</span>}
          </Link>

          {/* User Block */}
          <div>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded hover:bg-gray-100 transition-colors border-none bg-transparent cursor-pointer text-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              {showText && (
                <>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-gray-800">User Name</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 8l4 4 4-4" />
                  </svg>
                </>
              )}
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && !isCollapsed && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
                <Link
                  href="/account"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Account
                </Link>
                <Link
                  href="/"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="block px-4 py-3 text-red-500 hover:bg-gray-100 transition-colors"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer to push content */}
      <div className={`${isCollapsed ? "w-16" : "w-52"} shrink-0 transition-all duration-300`} />
    </>
  );
}
