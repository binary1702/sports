'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { gsap, useGSAP } from '@/lib/gsap';

interface SidebarLink {
  label: string;
  href: string;
}

interface Sidebar {
  image: {
    src: string;
    alt: string;
  };
  stat?: {
    value: string;
    label: string;
    description?: string;
  };
  title?: string;
  subtitle?: string;
  links?: SidebarLink[];
}

interface Finale {
  setup: string;
  punchline: string;
}

interface Section {
  title: string;
  body: string[];
}

interface EditorialProps {
  background: {
    src: string;
    alt?: string;
    gradient?: string;
  };
  accentColor?: string;
  sidebar?: Sidebar;
  title?: string;
  body?: string[];
  sections?: Section[];
  finale?: Finale;
}

export function Editorial({
  background,
  accentColor = 'text-us-open-yellow',
  sidebar,
  title,
  body,
  sections,
  finale,
}: EditorialProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add('(prefers-reduced-motion: no-preference)', () => {
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

  const defaultGradient = 'bg-gradient-to-r from-black/85 via-black/65 to-black/35';

  return (
    <section
      ref={containerRef}
      className="snap-section reveal-section relative h-dvh border-t border-zinc-800 overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={background.src}
          alt={background.alt ?? ''}
          fill
          className="object-cover opacity-85"
        />
        <div className={`absolute inset-0 ${background.gradient ?? defaultGradient}`} />
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 flex h-full flex-col px-6 py-6 md:px-12 md:py-16 lg:px-16 lg:py-20">
        <div className="flex flex-1 items-center w-full max-w-6xl mx-auto">
          <div className={`grid grid-cols-1 ${sidebar ? 'md:grid-cols-[minmax(200px,0.6fr)_minmax(0,1.4fr)]' : ''} gap-4 md:gap-12 lg:gap-20 w-full`}>

            {/* Sidebar (optional) */}
            {sidebar && (
              <div className="flex flex-col items-start md:items-center text-center justify-center order-1 w-full">
                {/* Mobile: horizontal layout */}
                <div className="flex md:hidden items-center gap-4 w-full">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-zinc-700/60 shrink-0">
                    <Image
                      src={sidebar.image.src}
                      alt={sidebar.image.alt}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="text-left">
                    {sidebar.stat && (
                      <>
                        <div className={`text-xl font-light ${accentColor}`}>{sidebar.stat.value}</div>
                        <div className="text-[9px] tracking-widest uppercase text-foreground/70 mb-1">{sidebar.stat.label}</div>
                      </>
                    )}
                    {sidebar.links && (
                      <div className="flex gap-3">
                        {sidebar.links.map((link, i) => (
                          <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className={`text-[10px] text-foreground/50 hover:${accentColor} transition-colors`}>
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop: vertical layout */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border border-zinc-700/60">
                    <Image
                      src={sidebar.image.src}
                      alt={sidebar.image.alt}
                      width={280}
                      height={280}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  {sidebar.stat && (
                    <div className="mt-5">
                      <div className={`text-5xl lg:text-6xl font-light ${accentColor} mb-2`}>{sidebar.stat.value}</div>
                      <div className="text-xs tracking-widest uppercase text-foreground/70 mb-2">{sidebar.stat.label}</div>
                      {sidebar.stat.description && (
                        <div className="text-xs text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: sidebar.stat.description }} />
                      )}
                    </div>
                  )}

                  {(sidebar.title || sidebar.subtitle) && (
                    <div className="mt-10">
                      {sidebar.title && <div className="text-lg font-medium text-foreground mb-1">{sidebar.title}</div>}
                      {sidebar.subtitle && <div className="text-xs text-muted tracking-wide">{sidebar.subtitle}</div>}
                    </div>
                  )}

                  {sidebar.links && (
                    <div className="mt-5">
                      <div className="flex flex-row items-center gap-4">
                        {sidebar.links.map((link, i) => (
                          <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className={`text-sm text-foreground/50 hover:${accentColor} transition-colors`}>
                            {link.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Main content */}
            <div className={`flex flex-col ${sidebar ? 'order-2' : ''}`}>
              {/* Single title/body mode */}
              {title !== undefined && body !== undefined && (
                <>
                  <h2 className={`text-lg md:text-2xl lg:text-3xl font-light ${accentColor} mb-3 md:mb-6`}>
                    {title}
                  </h2>
                  <div className="space-y-2 md:space-y-4 text-xs md:text-base lg:text-lg font-light text-foreground/80 leading-relaxed max-w-3xl">
                    {body.map((paragraph, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: paragraph }} />
                    ))}
                  </div>
                </>
              )}

              {/* Multi-section mode */}
              {sections && (
                <div className="space-y-6 md:space-y-10">
                  {sections.map((section, i) => (
                    <div key={i}>
                      <h2 className={`text-base md:text-xl lg:text-2xl font-medium ${accentColor} mb-2 md:mb-4`}>
                        {section.title}
                      </h2>
                      <div className="space-y-2 md:space-y-3 text-xs md:text-sm lg:text-base font-light text-foreground/80 leading-relaxed max-w-3xl">
                        {section.body.map((paragraph, j) => (
                          <p key={j} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {finale && (
                <div className="editorial-finale mt-3 md:mt-6 pt-3 md:pt-6 border-t border-zinc-700/50">
                  <p className="finale-line text-sm md:text-xl lg:text-2xl font-light text-foreground/50 mb-1 md:mb-2">
                    {finale.setup}
                  </p>
                  <p className={`finale-line text-base md:text-2xl lg:text-3xl font-medium ${accentColor}`}>
                    {finale.punchline}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
