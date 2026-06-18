"use client";

import { useState, useEffect } from "react";
import { NAV_LINKS } from "@/constants";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("#hero");

  useEffect(() => {
    const sectionIds = ["#hero", ...NAV_LINKS.map((l) => l.href)];
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      // Determine active section
      let current = "#hero";
      for (const id of sectionIds) {
        const el = document.querySelector(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        isScrolled ? "py-3" : "py-5"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5">
        {/* Brand */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("#hero");
          }}
          className="group flex items-center gap-2.5"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl glass holo-border font-display text-sm font-bold text-white">
            LS
            <span className="absolute inset-0 rounded-xl bg-cyan-400/0 transition-colors group-hover:bg-cyan-400/10" />
          </span>
          <span className="hidden font-display text-base font-semibold tracking-tight text-white sm:block">
            Lavanya<span className="text-holo"> S</span>
          </span>
        </a>

        {/* Desktop links — floating glass pill */}
        <div
          className={`hidden items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-500 md:flex ${
            isScrolled ? "glass holo-border" : "bg-transparent"
          }`}
        >
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`relative rounded-full px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-violet-500/20 ring-1 ring-cyan-400/30" />
                )}
                {link.label}
              </button>
            );
          })}
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#contact");
            }}
            className="hidden rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#0a0807] shadow-lg shadow-violet-500/30 transition-transform hover:scale-105 sm:block"
          >
            Connect
          </a>

          <button
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl glass md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span
              className={`block h-0.5 w-5 bg-cyan-300 transition-all ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-cyan-300 transition-all ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-cyan-300 transition-all ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`mx-5 mt-3 overflow-hidden rounded-2xl glass-strong holo-border transition-all duration-400 md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 border-transparent opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-1 p-4">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNavClick(link.href)}
                className="w-full rounded-lg px-4 py-3 text-left font-mono text-sm uppercase tracking-wider text-white/70 transition-colors hover:bg-white/5 hover:text-cyan-300"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
