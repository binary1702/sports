'use client';

import { useRef, ReactNode } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';

interface OpeningProps {
  headline: string;
  body: ReactNode[];
  closing: {
    line1: string;
    line2: string;
  };
  accentColor?: string;
  video?: {
    id: string;
    start?: number;
  };
}

export function Opening({
  headline,
  body,
  closing,
  accentColor = 'text-red-500',
  video,
}: OpeningProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set('.opening-closing-line', { opacity: 0, y: 20 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.opening-closing',
            start: 'top 80%',
            once: true,
          },
        });

        tl.to('.opening-closing-line', {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
        });

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

  const midpoint = Math.ceil(body.length / 2);
  const leftColumn = body.slice(0, midpoint);
  const rightColumn = body.slice(midpoint);

  return (
    <section
      ref={containerRef}
      className="snap-section reveal-section relative h-dvh border-t border-zinc-800 bg-black overflow-hidden"
    >
      {/* Background video - zoomed on mobile for vertical crop */}
      {video && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&showinfo=0&rel=0&modestbranding=1&start=${video.start || 0}`}
            allow="autoplay; encrypted-media"
            className="absolute pointer-events-none w-[450%] h-[250%] md:w-[120%] md:h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ border: 'none' }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col justify-center px-4 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl">
          {/* Headline */}
          <h2
            className={`text-base font-medium uppercase tracking-wide ${accentColor} mb-6 md:mb-8 md:text-lg`}
          >
            {headline}
          </h2>

          {/* Body paragraphs - two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            <div className="space-y-4 text-sm font-light leading-relaxed text-foreground/80 md:text-base">
              {leftColumn.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <div className="space-y-4 text-sm font-light leading-relaxed text-foreground/80 md:text-base">
              {rightColumn.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>

          {/* Closing statement */}
          <div className="opening-closing mt-8 border-t border-zinc-800 pt-8 md:mt-10 md:pt-10">
            <p
              className={`opening-closing-line text-lg font-medium ${accentColor} md:text-xl lg:text-2xl`}
            >
              {closing.line1}
            </p>
            {closing.line2 && (
              <p
                className={`opening-closing-line text-xl font-medium ${accentColor} md:text-2xl lg:text-3xl`}
              >
                {closing.line2}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
