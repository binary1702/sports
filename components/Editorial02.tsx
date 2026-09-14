'use client';

import { useState, useRef } from 'react';
import { gsap } from '@/lib/gsap';

const tournaments = [
  {
    id: 'ao',
    number: '01',
    name: 'Australian Open',
    details: 'January · Melbourne · Hard',
    highlight: false,
    facts: {
      founded: '1905',
      surface: 'Hard (GreenSet)',
      stadium: 'Rod Laver Arena',
      capacity: '14,820',
      champions: 'Djokovic (10), Federer (6), Agassi (4)',
      description: 'The Australian Open kicks off the Grand Slam season in the southern hemisphere summer. Known for extreme heat and late-night matches, it has been held at Melbourne Park since 1988. The tournament introduced the tiebreak and was the first Grand Slam to feature a retractable roof.',
    },
  },
  {
    id: 'rg',
    number: '02',
    name: 'French Open',
    details: 'May/June · Paris · Clay',
    highlight: false,
    facts: {
      founded: '1891',
      surface: 'Clay (terre battue)',
      stadium: 'Court Philippe-Chatrier',
      capacity: '15,225',
      champions: 'Nadal (14), Borg (6), Djokovic (3)',
      description: 'The French Open is the premier clay court championship in the world. The red terre battue slows the ball and produces longer rallies, favoring players with exceptional endurance and topspin. Rafael Nadal\'s 14 titles here remain the most dominant performance at any single Grand Slam.',
    },
  },
  {
    id: 'wim',
    number: '03',
    name: 'Wimbledon',
    details: 'June/July · London · Grass',
    highlight: false,
    facts: {
      founded: '1877',
      surface: 'Grass',
      stadium: 'Centre Court',
      capacity: '14,979',
      champions: 'Federer (8), Djokovic (7), Sampras (7)',
      description: 'The oldest tennis tournament in the world, Wimbledon is the only Grand Slam still played on grass. The All England Club enforces a strict all-white dress code. The grass surface produces low bounces and rewards aggressive, serve-and-volley play.',
    },
  },
  {
    id: 'uso',
    number: '04',
    name: 'US Open',
    details: 'Aug/Sep · New York · Hard',
    highlight: true,
    facts: {
      founded: '1881',
      surface: 'Hard (DecoTurf)',
      stadium: 'Arthur Ashe Stadium',
      capacity: '23,771',
      champions: 'Federer (5), Connors (5), Sampras (5)',
      description: 'The US Open is the loudest Grand Slam, held in New York with night sessions under the lights. Arthur Ashe Stadium is the largest tennis venue in the world. The tournament was the first to use tiebreaks in every set and the first to offer equal prize money.',
    },
  },
];

export function Editorial02() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedTournament = tournaments.find(t => t.id === selectedId);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleSelect = (id: string | null) => {
    const isChanging = id !== selectedId;
    if (!isChanging) return;

    // Animate out
    const tl = gsap.timeline();

    if (contentRef.current) {
      tl.to(contentRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.15,
        ease: 'power2.in',
      });
    }

    if (titleRef.current) {
      tl.to(titleRef.current, {
        opacity: 0,
        duration: 0.1,
        ease: 'power2.in',
      }, '<');
    }

    tl.call(() => {
      setSelectedId(id);
    });

    // Animate in
    tl.to(contentRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.25,
      ease: 'power2.out',
    });

    tl.to(titleRef.current, {
      opacity: 1,
      duration: 0.2,
      ease: 'power2.out',
    }, '<0.05');
  };

  return (
    <section
      className="snap-section relative h-dvh overflow-hidden border-t border-zinc-800 bg-background"
    >
      {/* Video backdrop */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/tennis.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/70" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-center px-4 md:px-8 lg:px-16 py-6 md:py-8 lg:py-10">
        {/* HEADER */}
        <header className="pb-6 md:pb-8">
          <div className="text-[10px] md:text-xs uppercase tracking-[0.18em] text-us-open-yellow/70">
            03 · The Four Majors
          </div>
          <h2
            ref={titleRef}
            className="mt-2 md:mt-3 max-w-3xl text-xl md:text-3xl lg:text-[clamp(2rem,3.5vw,3.75rem)] font-light leading-[1.1] tracking-tight text-foreground"
          >
            {selectedTournament ? selectedTournament.name : 'Four tournaments define the Grand Slam season.'}
          </h2>
        </header>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-4 md:gap-8 lg:gap-20">
          {/* Left essay / tournament facts */}
          <div
            ref={contentRef}
            className="max-w-2xl space-y-3 md:space-y-[clamp(0.75rem,1.5vh,1.25rem)] text-sm md:text-base lg:text-[clamp(1rem,1.25vw,1.2rem)] leading-[1.55] font-light text-foreground/75"
          >
            {selectedTournament ? (
              <>
                {/* Tournament facts */}
                <div className="grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-2 md:gap-y-3 mb-4 md:mb-6">
                  <div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/40 mb-0.5 md:mb-1">Founded</div>
                    <div className="text-sm md:text-base text-foreground/85 font-normal">{selectedTournament.facts.founded}</div>
                  </div>
                  <div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/40 mb-0.5 md:mb-1">Surface</div>
                    <div className="text-sm md:text-base text-foreground/85 font-normal">{selectedTournament.facts.surface}</div>
                  </div>
                  <div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/40 mb-0.5 md:mb-1">Stadium</div>
                    <div className="text-sm md:text-base text-foreground/85 font-normal">{selectedTournament.facts.stadium}</div>
                  </div>
                  <div>
                    <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/40 mb-0.5 md:mb-1">Capacity</div>
                    <div className="text-sm md:text-base text-foreground/85 font-normal">{selectedTournament.facts.capacity}</div>
                  </div>
                </div>
                <div className="mb-3 md:mb-4">
                  <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-foreground/40 mb-0.5 md:mb-1">Most Titles (Open Era)</div>
                  <div className="text-sm md:text-base text-foreground/85 font-normal">{selectedTournament.facts.champions}</div>
                </div>
                <p>{selectedTournament.facts.description}</p>
                <button
                  onClick={() => handleSelect(null)}
                  className="text-sm text-us-open-yellow/70 hover:text-us-open-yellow transition-colors mt-2"
                >
                  ← Back to overview
                </button>
              </>
            ) : (
              <>
                <p>
                  <span className="font-normal text-foreground/85">Tennis has four Grand Slam tournaments, the highest-profile events in the sport.</span>{' '}
                  They are spread across the season and across four different cities: Melbourne, Paris, London, and New York.
                </p>
                <p>
                  Each has its own surface and rhythm. The Australian Open starts the year on hard courts. Roland-Garros follows on clay. Wimbledon switches to grass. The US Open closes the calendar in New York on hard courts.
                </p>
                <p>
                  That change in surface matters. Clay slows the ball and produces longer points. Grass rewards lower bounces and faster attacking play. Hard courts sit between the two, demanding both movement and aggression. For the US Open, that means the final major arrives after players have moved through three very different environments.
                </p>
              </>
            )}
          </div>

          {/* Right side: tournament list - hidden on mobile */}
          <div className="hidden md:flex flex-row lg:flex-col justify-between lg:justify-center gap-4 lg:gap-[clamp(0.8rem,2vh,1.6rem)]">
            {tournaments.map((tournament) => {
              const isSelected = selectedId === tournament.id;
              const isHighlighted = tournament.highlight || isSelected;

              return (
                <button
                  key={tournament.id}
                  onClick={() => handleSelect(isSelected ? null : tournament.id)}
                  className={`flex-1 lg:flex-none lg:grid lg:grid-cols-[28px_1fr] lg:gap-4 text-center lg:text-left transition-opacity hover:opacity-100 ${
                    selectedId && !isSelected ? 'opacity-40' : ''
                  }`}
                >
                  <span className={`hidden lg:block text-xs ${isHighlighted ? 'text-us-open-yellow/60' : 'text-foreground/25'}`}>
                    {tournament.number}
                  </span>
                  <div>
                    <div className={`text-xs md:text-sm lg:text-lg font-medium ${isHighlighted ? 'text-us-open-yellow' : 'text-foreground'}`}>
                      {tournament.name}
                    </div>
                    <div className="hidden lg:block mt-1 text-sm text-foreground/45">
                      {tournament.details}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FOOTER - Mobile: 2x2 cards, Desktop: timeline */}
        <footer className="mt-8 md:mt-0 md:pt-5">
          {/* Mobile: 2x2 grid of tournament cards */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            {[
              { name: 'Australian Open', highlight: false },
              { name: 'French Open', highlight: false },
              { name: 'Wimbledon', highlight: false },
              { name: 'US Open', highlight: true },
            ].map((t, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded border text-center text-xs font-medium ${
                  t.highlight
                    ? 'border-us-open-yellow/50 text-us-open-yellow bg-us-open-yellow/10'
                    : 'border-zinc-700 text-foreground/60'
                }`}
              >
                {t.name}
              </div>
            ))}
          </div>

          {/* Desktop: timeline */}
          <div className="hidden md:block border-t border-zinc-800 pt-5">
            <div className="relative">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-600 -translate-y-1/2" />
              <div className="flex justify-between items-center relative">
                {[
                  { num: '01', label: 'JAN', name: 'Australian Open', highlight: false },
                  { num: '02', label: 'MAY/JUN', name: 'French Open', highlight: false },
                  { num: '03', label: 'JUN/JUL', name: 'Wimbledon', highlight: false },
                  { num: '04', label: 'AUG/SEP', name: 'US Open', highlight: true },
                ].map((node, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`text-[10px] tracking-widest mb-1 ${node.highlight ? 'text-us-open-yellow/60' : 'text-foreground/25'}`}>
                      {node.num}
                    </div>
                    <div className={`w-2.5 h-2.5 rounded-full relative z-10 ${node.highlight ? 'bg-us-open-yellow' : 'bg-zinc-500'}`} />
                    <div className={`text-[10px] tracking-wide mt-1 ${node.highlight ? 'text-us-open-yellow/70' : 'text-muted'}`}>
                      {node.label}
                    </div>
                    <div className={`text-xs font-medium tracking-wide mt-0.5 whitespace-nowrap ${node.highlight ? 'text-us-open-yellow' : 'text-foreground/50'}`}>
                      {node.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
