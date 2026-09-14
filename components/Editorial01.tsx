'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';

export function Editorial01() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Set initial state
        gsap.set('.finale-line', { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.editorial-finale',
            start: 'top 80%',
            once: true,
          },
        });

        tl.to('.finale-line', { opacity: 1, y: 0, duration: 0.6, stagger: 0.3 });

        return () => {
          tl.kill();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="snap-section reveal-section relative h-dvh border-t border-zinc-800 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/arthur-ashe-player.webp"
          alt=""
          fill
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/65 to-black/35" />
      </div>

      {/* Content wrapper - flex layout for vertical centering */}
      <div className="relative z-10 flex h-full flex-col px-6 py-6 md:px-12 md:py-16 lg:px-16 lg:py-20">
        {/* Main content area - centers vertically */}
        <div className="flex flex-1 items-center w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(200px,0.6fr)_minmax(0,1.4fr)] gap-4 md:gap-12 lg:gap-20 w-full">
            {/* Left column - portrait and facts */}
            <div className="flex flex-col items-start md:items-center text-center justify-center order-1 w-full">
              {/* Mobile: horizontal layout */}
              <div className="flex md:hidden items-center gap-4 w-full">
                {/* Portrait */}
                <div className="w-20 h-20 rounded-full overflow-hidden border border-zinc-700/60 shrink-0">
                  <Image
                    src="/arthur-ashe-trophy.webp"
                    alt="Arthur Ashe with trophy"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* Info + links */}
                <div className="text-left">
                  <div className="text-xl font-light text-us-open-yellow">1968</div>
                  <div className="text-[9px] tracking-widest uppercase text-foreground/70 mb-1">US Open Champion</div>
                  <div className="flex gap-3">
                    <a href="https://en.wikipedia.org/wiki/Arthur_Ashe" target="_blank" rel="noopener noreferrer" className="text-[10px] text-foreground/50 hover:text-us-open-yellow transition-colors">Wikipedia ↗</a>
                    <a href="https://www.usta.com/en/home/about-usta/who-we-are/national/arthur-ashe.html" target="_blank" rel="noopener noreferrer" className="text-[10px] text-foreground/50 hover:text-us-open-yellow transition-colors">USTA ↗</a>
                  </div>
                </div>
              </div>

              {/* Desktop: vertical layout */}
              <div className="hidden md:flex flex-col items-center">
                {/* Portrait */}
                <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border border-zinc-700/60">
                  <Image
                    src="/arthur-ashe-trophy.webp"
                    alt="Arthur Ashe with trophy"
                    width={280}
                    height={280}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* 1968 fact */}
                <div className="mt-5">
                  <div className="text-5xl lg:text-6xl font-light text-us-open-yellow mb-2">1968</div>
                  <div className="text-xs tracking-widest uppercase text-foreground/70 mb-2">US Open Champion</div>
                  <div className="text-xs text-muted leading-relaxed">
                    First Black man to win<br />
                    the men&apos;s singles title
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-10">
                  <div className="text-lg font-medium text-foreground mb-1">Arthur Ashe</div>
                  <div className="text-xs text-muted tracking-wide">Tennis Player · Activist · Humanitarian</div>
                </div>

                {/* Links */}
                <div className="mt-5">
                  <div className="flex flex-row items-center gap-4">
                    <a href="https://en.wikipedia.org/wiki/Arthur_Ashe" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/50 hover:text-us-open-yellow transition-colors">Wikipedia ↗</a>
                    <a href="https://www.usta.com/en/home/about-usta/who-we-are/national/arthur-ashe.html" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/50 hover:text-us-open-yellow transition-colors">USTA ↗</a>
                    <a href="https://www.usopen.org/en_US/visit/arthur_ashe_stadium.html" target="_blank" rel="noopener noreferrer" className="text-sm text-foreground/50 hover:text-us-open-yellow transition-colors">US Open ↗</a>
                  </div>
                </div>
              </div>
            </div>

          {/* Right column - main content (full width on mobile) */}
          <div className="flex flex-col order-2">
            {/* Title */}
            <h2 className="text-lg md:text-2xl lg:text-3xl font-light text-us-open-yellow mb-3 md:mb-6">
              Who is Arthur Ashe?
            </h2>

            {/* Body copy */}
            <div className="space-y-2 md:space-y-4 text-xs md:text-base lg:text-lg font-light text-foreground/80 leading-relaxed max-w-3xl">
              <p>
                Arthur Ashe Stadium is the centerpiece of the US Open and the largest tennis stadium in the world. It is the court where Ben Shelton faced off Alexander Zverev in the 2026 US Open singles finals, are played. The stadium is named after one of the most important figures in tennis history.
              </p>

              <p>
                Ashe won the inaugural US Open in 1968, becoming the first Black man to win the tournament&apos;s singles title.
              </p>

              <p>
                Ashe&apos;s 1968 victory came at a turning point in tennis history. That year marked the beginning of the Open Era, when professional players were allowed to compete alongside amateurs in major tournaments. Ashe was still serving in the U.S. Army and competing as an amateur when he won the title.
              </p>

              <p>
                His significance extended far beyond tennis. He became an outspoken advocate for civil rights, opposed apartheid in South Africa, helped establish the National Junior Tennis League, and later worked extensively to raise awareness about AIDS.
              </p>

              <p>
                Four years after his death in 1993, the US Open opened its new main stadium and named it Arthur Ashe Stadium. The venue opened in 1997 and seats more than 23,000 spectators, making it the largest tennis stadium in the world.
              </p>
            </div>

            {/* Finale */}
            <div className="editorial-finale mt-3 md:mt-6 pt-3 md:pt-6 border-t border-zinc-700/50">
              <p className="finale-line text-sm md:text-xl lg:text-2xl font-light text-foreground/50 mb-1 md:mb-2">
                So when the final is played on Arthur Ashe Stadium,
              </p>
              <p className="finale-line text-base md:text-2xl lg:text-3xl font-medium text-us-open-yellow">
                the name above the court carries weight.
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
