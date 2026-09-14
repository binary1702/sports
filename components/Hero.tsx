'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';

const VIDEO_ID = '5xvs0FC_A-M';
const START_TIME = 828; // 13:48
const END_TIME = 930;   // 15:30

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const iframeRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!iframeRef.current) return;

      playerRef.current = new window.YT.Player(iframeRef.current, {
        videoId: VIDEO_ID,
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start: START_TIME,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            event.target.playVideo();
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            // Hide overlay after a delay once video starts playing
            // This gives time for YouTube branding to fade
            if (event.data === window.YT.PlayerState.PLAYING) {
              setTimeout(() => {
                setIsPlaying(true);
              }, 4000); // 4 second delay to let YouTube branding fade

              const checkTime = setInterval(() => {
                const currentTime = playerRef.current?.getCurrentTime();
                if (currentTime && currentTime >= END_TIME) {
                  playerRef.current?.seekTo(START_TIME, true);
                }
              }, 500);

              // Store interval for cleanup
              (playerRef.current as any)._loopInterval = checkTime;
            }
          },
        },
      });
    };

    // Initialize when API is ready
    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if ((playerRef.current as any)?._loopInterval) {
        clearInterval((playerRef.current as any)._loopInterval);
      }
      playerRef.current?.destroy();
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 4.5-second intro sequence - overlaps with video reveal at 4s
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Phase 1: Corner accents draw in (0-1s)
        tl.fromTo(
          '.hero-corner',
          { opacity: 0, scale: 0.5 },
          { opacity: 1, scale: 1, duration: 1, stagger: 0.15 }
        )
        // Phase 2: Background lines sweep in (0.5-1.9s)
        .fromTo(
          '.hero-bg-line',
          { scaleX: 0 },
          { scaleX: 1, duration: 1.4, ease: 'power2.inOut' },
          0.5
        )
        // Phase 3: Accent line expands from center (1.2-2.2s)
        .fromTo(
          '.hero-accent-line',
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 1, ease: 'power2.inOut' },
          1.2
        )
        // Phase 4: Logos slide in (1.8-2.6s)
        .fromTo(
          '.hero-tagline',
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          1.8
        )
        // Phase 5: Credit fades in (2.2-2.8s)
        .fromTo(
          '.hero-credit',
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.6 },
          2.2
        )
        // Phase 6: Name reveals - THE GRAND FINALE (3-4.5s) - VIDEO STARTS REVEALING AT 4s
        .fromTo(
          '.hero-name',
          { opacity: 0, y: 80, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power4.out' },
          3
        )
        // Phase 7: Champion label fades up with name (3.3-4.3s)
        .fromTo(
          '.hero-label',
          { opacity: 0, y: 30, letterSpacing: '0.6em' },
          { opacity: 1, y: 0, letterSpacing: '0.1em', duration: 1, ease: 'power3.out' },
          3.3
        )
        // Phase 8: Flag drops in last (3.8-4.5s) - as video fully reveals
        .fromTo(
          '.hero-badge',
          { opacity: 0, y: -50, scale: 0.7 },
          { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power4.out' },
          3.8
        );

        return () => {
          tl.kill();
        };
      });

      // Reduced motion: set final states instantly
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.hero-badge, .hero-name, .hero-label, .hero-tagline, .hero-credit, .hero-corner', {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
        });
        gsap.set('.hero-accent-line, .hero-bg-line', { scaleX: 1, opacity: 1 });
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
      className="snap-section relative flex flex-col justify-center items-center overflow-hidden"
    >
      {/* Background YouTube video - zoomed to crop black bars */}
      {/* Mobile: aggressive zoom to fill 9:16 viewport with 16:9 video (need ~178% height minimum) */}
      {/* Using 250% height to ensure full coverage on all mobile aspect ratios */}
      {/* Desktop: moderate zoom (120%) to cover and crop letterboxing */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          ref={iframeRef}
          className="absolute pointer-events-none w-[450%] h-[250%] md:w-[120%] md:h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Black cover until video plays - hides YouTube play button */}
      <div
        className={`absolute inset-0 z-[4] bg-black pointer-events-none transition-opacity duration-1000 ${
          isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Dark overlay to dim video */}
      <div className="absolute inset-0 z-[5] bg-black/50 pointer-events-none" />

      {/* Background accent lines */}
      <div className="absolute inset-0 pointer-events-none z-[6]">
        <div className="hero-bg-line absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent origin-center" style={{ transform: 'scaleX(0)' }} />
        <div className="hero-bg-line absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent origin-center" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* Content */}
      <div className="relative z-[20] text-center px-6 max-w-5xl mx-auto">
        {/* German flag */}
        <div className="hero-badge flex justify-center mb-6 opacity-0">
          <span className="inline-flex flex-col w-16 h-10 rounded overflow-hidden border border-zinc-700">
            <span className="flex-1 bg-black" />
            <span className="flex-1 bg-red-600" />
            <span className="flex-1 bg-yellow-400" />
          </span>
        </div>

        {/* Champion name */}
        <h1 className="hero-name text-display text-foreground mb-4 opacity-0">
          <span className="font-light">ALEXANDER</span>
          <br />
          <span className="font-medium">ZVEREV</span>
        </h1>

        {/* Champion label */}
        <div className="hero-label mb-8 opacity-0">
          <span className="text-xl md:text-2xl font-light text-foreground/80 tracking-wide">
            2026 US OPEN CHAMPION
          </span>
        </div>

        {/* Logos - centered below */}
        <div className="hero-tagline flex items-center justify-center gap-4 md:gap-5 opacity-0">
          <a
            href="https://www.usopen.org"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-zinc-700 overflow-hidden hover:border-zinc-500 transition-colors"
          >
            <Image
              src="/logos/us-open.webp"
              alt="US Open"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </a>
          <a
            href="https://www.espn.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-zinc-700 overflow-hidden bg-red-600 p-1.5 hover:border-zinc-500 transition-colors"
          >
            <Image
              src="/logos/espn.webp"
              alt="ESPN"
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </a>
          <a
            href="https://binary1702.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 md:w-13 md:h-13 rounded-full border border-zinc-700 overflow-hidden hover:border-zinc-500 transition-colors"
          >
            <Image
              src="/logos/b1702.webp"
              alt="Binary 1702"
              width={52}
              height={52}
              className="w-full h-full object-cover"
            />
          </a>
        </div>

        {/* Accent line */}
        <div className="hero-accent-line w-24 h-px bg-accent mx-auto origin-center mt-8" style={{ transform: 'scaleX(0)' }} />
      </div>

      {/* Bottom right credit */}
      <div className="hero-credit absolute bottom-4 right-4 md:bottom-12 md:right-12 z-[20] opacity-0">
        <p className="text-xs md:text-base text-foreground/60 font-light">
          A Binary 1702 experiment
        </p>
      </div>

      {/* Corner accents */}
      <div className="hero-corner absolute top-4 left-4 md:top-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-t border-zinc-800 z-10 opacity-0 origin-top-left" />
      <div className="hero-corner absolute top-4 right-4 md:top-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-t border-zinc-800 z-10 opacity-0 origin-top-right" />
      <div className="hero-corner absolute bottom-4 left-4 md:bottom-8 md:left-8 w-8 h-8 md:w-12 md:h-12 border-l border-b border-zinc-800 z-10 opacity-0 origin-bottom-left" />
      <div className="hero-corner absolute bottom-4 right-4 md:bottom-8 md:right-8 w-8 h-8 md:w-12 md:h-12 border-r border-b border-zinc-800 z-10 opacity-0 origin-bottom-right" />
    </section>
  );
}
