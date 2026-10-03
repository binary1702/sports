'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';

interface AnimationFrom {
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  letterSpacing?: string;
  scaleX?: number;
}

interface ElementAnimation {
  delay?: number;
  duration?: number;
  ease?: string;
  from?: AnimationFrom;
  stagger?: number;
}

interface HeroAnimation {
  corners?: ElementAnimation;
  bgLines?: ElementAnimation;
  accentLine?: ElementAnimation;
  badge?: ElementAnimation;
  title?: ElementAnimation;
  subtitle?: ElementAnimation;
  logos?: ElementAnimation;
  credit?: ElementAnimation;
}

interface HeroProps {
  video: {
    id: string;
    start?: number;
    end?: number;
  };
  badge:
    | { type: 'flag'; colors: string[] }
    | { type: 'image'; src: string; alt?: string }
    | { type: 'emoji'; emoji: string };
  title: {
    line1: string;
    line2: string;
    line1Weight?: 'light' | 'medium';
    line2Weight?: 'light' | 'medium';
  };
  subtitle: string;
  logos: Array<{
    src: string;
    alt: string;
    href: string;
    bgColor?: string;
    padding?: string;
    wide?: boolean;
  }>;
  animation?: HeroAnimation;
}

const defaultAnimation: HeroAnimation = {
  corners: { delay: 0, duration: 1, ease: 'power3.out', from: { opacity: 0, scale: 0.5 }, stagger: 0.15 },
  bgLines: { delay: 0.5, duration: 1.4, ease: 'power2.inOut', from: { scaleX: 0 } },
  accentLine: { delay: 1.2, duration: 1, ease: 'power2.inOut', from: { scaleX: 0, opacity: 0 } },
  badge: { delay: 3.8, duration: 0.7, ease: 'power4.out', from: { opacity: 0, y: -50, scale: 0.7 } },
  title: { delay: 3, duration: 1.5, ease: 'power4.out', from: { opacity: 0, y: 80, scale: 0.85 } },
  subtitle: { delay: 3.3, duration: 1, ease: 'power3.out', from: { opacity: 0, y: 30, letterSpacing: '0.6em' } },
  logos: { delay: 1.8, duration: 0.8, ease: 'power3.out', from: { opacity: 0, y: 20 } },
  credit: { delay: 2.2, duration: 0.6, ease: 'power3.out', from: { opacity: 0, x: 20 } },
};

export function Hero({ video, badge, title, subtitle, logos, animation }: HeroProps) {
  const anim = { ...defaultAnimation, ...animation };
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
        videoId: video.id,
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
          start: video.start ?? 0,
          disablekb: 1,
          iv_load_policy: 3,
          fs: 0,
          loop: 1,
          playlist: video.id,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            event.target.playVideo();
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            // Hide overlay immediately once video starts playing
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);

              const checkTime = setInterval(() => {
                const currentTime = playerRef.current?.getCurrentTime();
                if (video.end && currentTime && currentTime >= video.end) {
                  playerRef.current?.seekTo(video.start ?? 0, true);
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
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Corners
        if (anim.corners) {
          tl.fromTo(
            '.hero-corner',
            { ...anim.corners.from },
            { opacity: 1, scale: 1, y: 0, x: 0, duration: anim.corners.duration, stagger: anim.corners.stagger, ease: anim.corners.ease },
            anim.corners.delay
          );
        }

        // Background lines
        if (anim.bgLines) {
          tl.fromTo(
            '.hero-bg-line',
            { ...anim.bgLines.from },
            { scaleX: 1, opacity: 1, duration: anim.bgLines.duration, ease: anim.bgLines.ease },
            anim.bgLines.delay
          );
        }

        // Accent line
        if (anim.accentLine) {
          tl.fromTo(
            '.hero-accent-line',
            { ...anim.accentLine.from },
            { scaleX: 1, opacity: 1, duration: anim.accentLine.duration, ease: anim.accentLine.ease },
            anim.accentLine.delay
          );
        }

        // Logos
        if (anim.logos) {
          tl.fromTo(
            '.hero-tagline',
            { ...anim.logos.from },
            { opacity: 1, y: 0, x: 0, duration: anim.logos.duration, ease: anim.logos.ease },
            anim.logos.delay
          );
        }

        // Credit
        if (anim.credit) {
          tl.fromTo(
            '.hero-credit',
            { ...anim.credit.from },
            { opacity: 1, y: 0, x: 0, duration: anim.credit.duration, ease: anim.credit.ease },
            anim.credit.delay
          );
        }

        // Title
        if (anim.title) {
          tl.fromTo(
            '.hero-name',
            { ...anim.title.from },
            { opacity: 1, x: 0, y: 0, scale: 1, duration: anim.title.duration, ease: anim.title.ease },
            anim.title.delay
          );
        }

        // Subtitle
        if (anim.subtitle) {
          tl.fromTo(
            '.hero-label',
            { ...anim.subtitle.from },
            { opacity: 1, y: 0, letterSpacing: '0.1em', duration: anim.subtitle.duration, ease: anim.subtitle.ease },
            anim.subtitle.delay
          );
        }

        // Badge
        if (anim.badge) {
          tl.fromTo(
            '.hero-badge',
            { ...anim.badge.from },
            { opacity: 1, y: 0, scale: 1, duration: anim.badge.duration, ease: anim.badge.ease },
            anim.badge.delay
          );
        }

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
        {/* Badge (flag, image, or emoji) */}
        <div className="hero-badge flex justify-center mb-6 opacity-0">
          {badge.type === 'flag' ? (
            <span className="inline-flex flex-col w-16 h-10 rounded overflow-hidden border border-zinc-700">
              {badge.colors.map((color, i) => (
                <span key={i} className="flex-1" style={{ backgroundColor: color }} />
              ))}
            </span>
          ) : badge.type === 'emoji' ? (
            <span className="text-6xl">{badge.emoji}</span>
          ) : (
            <span className="inline-flex w-16 h-16 rounded-full overflow-hidden border border-zinc-700">
              <Image
                src={badge.src}
                alt={badge.alt ?? ''}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="hero-name text-display text-foreground mb-4 opacity-0">
          <span className={`font-${title.line1Weight ?? 'light'}`}>{title.line1}</span>
          <br />
          <span className={`font-${title.line2Weight ?? 'medium'}`}>{title.line2}</span>
        </h1>

        {/* Subtitle */}
        <div className="hero-label mb-8 opacity-0">
          <span className="text-xl md:text-2xl font-light text-foreground/80 tracking-wide">
            {subtitle}
          </span>
        </div>

        {/* Logos - centered below */}
        <div className="hero-tagline flex items-center justify-center gap-4 md:gap-5 opacity-0">
          {logos.map((logo, i) => (
            <a
              key={i}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${logo.wide ? 'h-8 md:h-10 px-3' : 'w-12 h-12 md:w-14 md:h-14'} rounded-full border border-zinc-700 overflow-hidden hover:border-zinc-500 transition-colors flex items-center justify-center ${logo.bgColor ?? ''} ${logo.padding ?? ''}`}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.wide ? 80 : 56}
                height={logo.wide ? 20 : 56}
                className={logo.wide ? 'h-5 md:h-6 w-auto object-contain' : 'w-full h-full object-cover'}
              />
            </a>
          ))}
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
