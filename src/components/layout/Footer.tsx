import { SOCIAL_LINKS } from "@/constants";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg glass holo-border font-display text-xs font-bold text-white">
            LS
          </span>
          <p className="font-mono text-xs text-white/40">
            © 2026 Lavanya S · Senior QA Automation Engineer
          </p>
        </div>

        <div className="flex items-center gap-5 font-mono text-xs">
          <a
            href="tel:+14706956058"
            className="text-white/50 transition-colors hover:text-cyan-300"
          >
            +1 (470) 695-6058
          </a>
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={link.label}
              className="text-white/50 transition-colors hover:text-cyan-300"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
