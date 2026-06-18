"use client";

import { useEffect, useRef } from "react";

export default function SplitText({
  text,
  className = "",
  delay = 0,
  charDelay = 25,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  charDelay?: number;
  as?: "span" | "h2" | "h3" | "p" | "div";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          el.classList.add("is-visible");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Component = Tag as "span";

  return (
    <Component ref={ref as never} className={`split-text ${className}`}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="split-char-wrap"
        >
          <span
            className="split-char"
            style={{ transitionDelay: `${delay + i * charDelay}ms` }}
          >
            {char === " " ? " " : char}
          </span>
        </span>
      ))}
    </Component>
  );
}
