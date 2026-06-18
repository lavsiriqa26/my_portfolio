"use client";

import { useEffect, useRef } from "react";

/**
 * Custom cursor: a sharp neon dot that tracks the pointer 1:1 and a larger
 * glowing ring that trails behind with easing. Grows when hovering anything
 * interactive. Disabled on touch devices (handled via CSS `cursor`).
 */
export default function CursorGlow() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const move = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;

      const target = e.target as HTMLElement;
      const interactive = !!target.closest(
        "a, button, input, textarea, [data-cursor]"
      );
      ring.style.setProperty("--s", interactive ? "2.4" : "1");
      ring.style.borderColor = interactive
        ? "rgba(219,146,89,0.9)"
        : "rgba(232,196,121,0.7)";
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(var(--s, 1))`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-cyan-300"
        style={{ boxShadow: "0 0 12px 2px rgba(232,196,121,0.9)" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border transition-[border-color] duration-300"
        style={{ borderColor: "rgba(232,196,121,0.7)" }}
      />
    </>
  );
}
