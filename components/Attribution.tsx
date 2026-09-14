'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap } from '@/lib/gsap';

export function Attribution() {
  const glitchContainerRef = useRef<HTMLAnchorElement>(null);
  const glitchARef = useRef<HTMLSpanElement>(null);
  const glitchBRef = useRef<HTMLSpanElement>(null);
  const isAnimatingRef = useRef(false);

  const triggerGlitch = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Signal shift effect - ~200ms total
    tl
      // Initial state
      .set([glitchARef.current, glitchBRef.current], { opacity: 0, x: 0 })
      // Slice A shifts left with top slice
      .to(glitchARef.current, {
        opacity: 1,
        x: -4,
        clipPath: 'inset(15% 0 60% 0)',
        duration: 0.04,
        ease: 'none',
      })
      // Slice B shifts right with bottom slice
      .to(
        glitchBRef.current,
        {
          opacity: 1,
          x: 5,
          clipPath: 'inset(55% 0 20% 0)',
          duration: 0.04,
          ease: 'none',
        },
        '<'
      )
      // Brief hold
      .to({}, { duration: 0.06 })
      // Shift in opposite direction
      .to(glitchARef.current, {
        x: 3,
        clipPath: 'inset(40% 0 35% 0)',
        duration: 0.03,
        ease: 'none',
      })
      .to(
        glitchBRef.current,
        {
          x: -3,
          clipPath: 'inset(70% 0 5% 0)',
          duration: 0.03,
          ease: 'none',
        },
        '<'
      )
      // Resolve back to clean
      .to([glitchARef.current, glitchBRef.current], {
        x: 0,
        opacity: 0,
        duration: 0.05,
        ease: 'power2.out',
      });
  };

  const triggerGlitchOut = () => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    // Reverse direction glitch on exit
    tl
      .set([glitchARef.current, glitchBRef.current], { opacity: 0, x: 0 })
      // Slice A shifts right
      .to(glitchARef.current, {
        opacity: 1,
        x: 5,
        clipPath: 'inset(25% 0 50% 0)',
        duration: 0.04,
        ease: 'none',
      })
      // Slice B shifts left
      .to(
        glitchBRef.current,
        {
          opacity: 1,
          x: -4,
          clipPath: 'inset(60% 0 15% 0)',
          duration: 0.04,
          ease: 'none',
        },
        '<'
      )
      // Brief hold
      .to({}, { duration: 0.05 })
      // Resolve
      .to([glitchARef.current, glitchBRef.current], {
        x: 0,
        opacity: 0,
        duration: 0.05,
        ease: 'power2.out',
      });
  };

  return (
    <footer className="snap-section reveal-section relative flex flex-col items-center justify-center px-6 border-t border-zinc-800 overflow-hidden">
      {/* Video backdrop */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
          ref={(el) => {
            if (el) {
              el.currentTime = 7;
            }
          }}
        >
          <source src="/binary-25s.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Binary 1702 name with glitch effect */}
        <a
          ref={glitchContainerRef}
          href="https://binary1702.com"
          target="_blank"
          rel="noopener noreferrer"
          className="relative inline-flex items-center gap-4 hover:opacity-80 transition-opacity mb-12"
          onMouseEnter={triggerGlitch}
          onMouseLeave={triggerGlitchOut}
        >
          {/* Logo */}
          <Image
            src="/logos/b1702.webp"
            alt="Binary 1702"
            width={48}
            height={48}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full"
          />

          {/* Main text - matching binary1702.com style */}
          <span
            className="relative z-10 uppercase tracking-[0.25em] font-normal"
            style={{ fontSize: 'clamp(20px, 3.5vw, 32px)' }}
          >
            <span className="text-[#7C3AED]">Binary</span>
            <span className="text-foreground">1702</span>
          </span>

          {/* Glitch copy A - dark purple/violet */}
          <span
            ref={glitchARef}
            aria-hidden="true"
            className="absolute left-14 md:left-16 opacity-0 uppercase tracking-[0.25em] font-normal"
            style={{ clipPath: 'inset(0 0 0 0)', fontSize: 'clamp(20px, 3.5vw, 32px)' }}
          >
            <span style={{ color: '#8B5CF6' }}>Binary</span>
            <span style={{ color: '#A78BFA' }}>1702</span>
          </span>

          {/* Glitch copy B - deeper purple */}
          <span
            ref={glitchBRef}
            aria-hidden="true"
            className="absolute left-14 md:left-16 opacity-0 uppercase tracking-[0.25em] font-normal"
            style={{ clipPath: 'inset(0 0 0 0)', fontSize: 'clamp(20px, 3.5vw, 32px)' }}
          >
            <span style={{ color: '#A78BFA' }}>Binary</span>
            <span style={{ color: '#7C3AED' }}>1702</span>
          </span>
        </a>

        {/* Main statement - second biggest typography */}
        <div className="mb-12">
          <p className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight tracking-tight">
            Complex information
          </p>
          <p className="text-3xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight tracking-tight">
            should <span className="feel-text">feel</span> simple.
          </p>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-muted max-w-lg mx-auto mb-16 font-light">
          We build systems that make complexity easier to understand.
        </p>

        {/* CTAs - quiet signature */}
        <div className="flex items-center justify-center gap-4 text-sm">
          <a
            href="https://binary1702.com/lets-talk"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase tracking-widest text-foreground hover:text-accent transition-colors"
          >
            Contact
          </a>
          <span className="text-muted">·</span>
          <a
            href="https://binary1702.com"
            target="_blank"
            rel="noopener noreferrer"
            className="uppercase tracking-widest text-foreground hover:text-accent transition-colors"
          >
            Binary1702.com
          </a>
        </div>
      </div>
    </footer>
  );
}
