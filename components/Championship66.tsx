'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap';

// Team colors (official F1 2026 colors)
const TEAM_COLORS: Record<string, { bg: string; bar: string; text: string; dot: string }> = {
  'Mercedes': { bg: 'bg-teal-500/20', bar: 'bg-teal-500/30', text: 'text-teal-400', dot: 'bg-teal-500' },
  'Ferrari': { bg: 'bg-red-500/20', bar: 'bg-red-500/30', text: 'text-red-500', dot: 'bg-red-500' },
  'McLaren': { bg: 'bg-orange-500/20', bar: 'bg-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' },
  'Red Bull': { bg: 'bg-blue-600/20', bar: 'bg-blue-600/30', text: 'text-blue-400', dot: 'bg-blue-500' },
  'RB': { bg: 'bg-blue-400/20', bar: 'bg-blue-400/30', text: 'text-blue-300', dot: 'bg-blue-400' },
  'Alpine': { bg: 'bg-pink-500/20', bar: 'bg-pink-500/30', text: 'text-pink-400', dot: 'bg-pink-500' },
  'Haas': { bg: 'bg-gray-400/20', bar: 'bg-gray-400/30', text: 'text-gray-300', dot: 'bg-gray-400' },
  'Audi': { bg: 'bg-gray-400/20', bar: 'bg-gray-400/30', text: 'text-gray-300', dot: 'bg-gray-400' },
  'Williams': { bg: 'bg-sky-500/20', bar: 'bg-sky-500/30', text: 'text-sky-400', dot: 'bg-sky-500' },
  'Aston Martin': { bg: 'bg-emerald-600/20', bar: 'bg-emerald-600/30', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  'Cadillac': { bg: 'bg-slate-200/20', bar: 'bg-slate-200/30', text: 'text-slate-200', dot: 'bg-slate-200' },
};

// Championship standings data (verified)
const STANDINGS = [
  { driver: 'Kimi Antonelli', short: 'Antonelli', team: 'Mercedes', points: 302, wins: 8, podiums: 12 },
  { driver: 'George Russell', short: 'Russell', team: 'Mercedes', points: 236, wins: 3, podiums: 8 },
  { driver: 'Lewis Hamilton', short: 'Hamilton', team: 'Ferrari', points: 199, wins: 1, podiums: 5 },
  { driver: 'Lando Norris', short: 'Norris', team: 'McLaren', points: 186, wins: 2, podiums: 5 },
  { driver: 'Charles Leclerc', short: 'Leclerc', team: 'Ferrari', points: 179, wins: 1, podiums: 4 },
  { driver: 'Max Verstappen', short: 'Verstappen', team: 'Red Bull', points: 163, wins: 0, podiums: 7 },
  { driver: 'Oscar Piastri', short: 'Piastri', team: 'McLaren', points: 120, wins: 0, podiums: 2 },
  { driver: 'Isack Hadjar', short: 'Hadjar', team: 'Red Bull', points: 86, wins: 0, podiums: 2 },
  { driver: 'Liam Lawson', short: 'Lawson', team: 'RB', points: 59, wins: 0, podiums: 0 },
  { driver: 'Pierre Gasly', short: 'Gasly', team: 'Alpine', points: 41, wins: 0, podiums: 0 },
  { driver: 'Arvid Lindblad', short: 'Lindblad', team: 'RB', points: 37, wins: 0, podiums: 0 },
  { driver: 'Franco Colapinto', short: 'Colapinto', team: 'Alpine', points: 27, wins: 0, podiums: 0 },
  { driver: 'Oliver Bearman', short: 'Bearman', team: 'Haas', points: 20, wins: 0, podiums: 0 },
  { driver: 'Gabriel Bortoleto', short: 'Bortoleto', team: 'Audi', points: 10, wins: 0, podiums: 0 },
  { driver: 'Nico Hulkenberg', short: 'Hulkenberg', team: 'Audi', points: 7, wins: 0, podiums: 0 },
  { driver: 'Esteban Ocon', short: 'Ocon', team: 'Haas', points: 7, wins: 0, podiums: 0 },
  { driver: 'Carlos Sainz Jr.', short: 'Sainz', team: 'Williams', points: 7, wins: 0, podiums: 0 },
  { driver: 'Alex Albon', short: 'Albon', team: 'Williams', points: 5, wins: 0, podiums: 0 },
  { driver: 'Fernando Alonso', short: 'Alonso', team: 'Aston Martin', points: 3, wins: 0, podiums: 0 },
  { driver: 'Lance Stroll', short: 'Stroll', team: 'Aston Martin', points: 0, wins: 0, podiums: 0 },
  { driver: 'Valtteri Bottas', short: 'Bottas', team: 'Cadillac', points: 0, wins: 0, podiums: 0 },
  { driver: 'Sergio Pérez', short: 'Pérez', team: 'Cadillac', points: 0, wins: 0, podiums: 0 },
] as const;

const ANTONELLI = STANDINGS[0];
const REMAINING_ROUNDS = 8;

interface Championship66Props {
  video?: {
    id: string;
    start?: number;
  };
}

export function Championship66({ video }: Championship66Props = {}) {
  const [selectedIndex, setSelectedIndex] = useState(1); // Default: Russell
  const gapNumberRef = useRef<HTMLSpanElement>(null);
  const prevGapRef = useRef<number>(66);

  const selectedDriver = STANDINGS[selectedIndex];
  const currentGap = ANTONELLI.points - selectedDriver.points;

  // Animate gap number when driver changes
  useEffect(() => {
    if (!gapNumberRef.current) return;

    const prevGap = prevGapRef.current;
    if (prevGap === currentGap) return;

    gsap.fromTo(
      gapNumberRef.current,
      { innerText: prevGap },
      {
        innerText: currentGap,
        duration: 0.5,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate: function () {
          if (gapNumberRef.current) {
            gapNumberRef.current.textContent = String(
              Math.round(Number(gapNumberRef.current.innerText))
            );
          }
        },
      }
    );

    prevGapRef.current = currentGap;
  }, [currentGap]);

  // Points bar width (Antonelli = 100%)
  const getBarWidth = (points: number) => (points / ANTONELLI.points) * 100;

  return (
    <section className="snap-section reveal-section relative h-dvh border-t border-zinc-800 bg-black overflow-hidden">
      {/* Background video - zoomed on mobile for vertical crop */}
      {video && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&showinfo=0&rel=0&modestbranding=1&start=${video.start || 0}`}
            allow="autoplay; encrypted-media"
            className="absolute pointer-events-none w-[450%] h-[250%] md:w-[120%] md:h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ border: 'none' }}
          />
          <div className="absolute inset-0 bg-black/85" />
        </div>
      )}

      <div className="relative z-10 flex h-full flex-col px-4 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-5xl flex flex-col h-full">

          {/* Header */}
          <div className="mb-6 md:mb-8 flex items-baseline justify-between">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-red-500">
                The Championship
              </span>
              <h2 className="text-lg md:text-xl font-medium text-foreground mt-1">
                2026 Drivers' Standings
              </h2>
            </div>
            <div className="text-right">
              <span className="text-2xl md:text-3xl font-light text-foreground">{REMAINING_ROUNDS}</span>
              <span className="text-xs uppercase tracking-widest text-foreground/40 ml-2">rounds left</span>
            </div>
          </div>

          {/* Leaderboard - Two columns (always, even on mobile) */}
          <div className="flex-1 min-h-0 grid grid-cols-2 gap-2 md:gap-4">
            {/* Left column: 1-12 */}
            <div className="flex flex-col min-h-0">
              {/* Column headers */}
              <div className="grid grid-cols-[1.25rem_1fr_2.5rem] gap-1 text-[10px] uppercase tracking-widest text-foreground/30 mb-1 px-1">
                <div></div>
                <div>Driver</div>
                <div className="text-right">Pts</div>
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-0">
                {STANDINGS.slice(0, 12).map((driver, index) => {
                  const isAntonelli = index === 0;
                  const isSelected = index === selectedIndex;
                  const barWidth = getBarWidth(driver.points);
                  const teamColor = TEAM_COLORS[driver.team];

                  return (
                    <button
                      key={driver.driver}
                      onClick={() => !isAntonelli && setSelectedIndex(index)}
                      disabled={isAntonelli}
                      className={`
                        relative w-full text-left transition-all duration-300
                        ${isAntonelli ? 'cursor-default' : 'cursor-pointer'}
                        ${isSelected && !isAntonelli ? 'z-10' : ''}
                      `}
                    >
                      {/* Points bar background */}
                      <div
                        className={`
                          absolute inset-0 transition-all duration-500 ease-out rounded
                          ${isAntonelli ? teamColor.bar : isSelected ? teamColor.bar : 'bg-zinc-800/50'}
                        `}
                        style={{ width: `${barWidth}%` }}
                      />

                      {/* Row content */}
                      <div className={`
                        relative grid grid-cols-[1.25rem_1fr_2.5rem] gap-1
                        py-0.5 px-1 rounded
                        transition-colors duration-200
                        ${!isAntonelli && !isSelected ? 'hover:bg-zinc-800/30' : ''}
                      `}>
                        {/* Rank */}
                        <div className={`
                          text-xs font-medium
                          ${isAntonelli ? teamColor.text : isSelected ? teamColor.text : 'text-foreground/50'}
                        `}>
                          {index + 1}
                        </div>

                        {/* Driver & Team */}
                        <div className="flex items-center gap-1.5">
                          <span className={`
                            text-xs font-medium
                            ${isAntonelli ? teamColor.text : isSelected ? teamColor.text : 'text-foreground/80'}
                          `}>
                            {driver.short}
                          </span>
                          <span className="text-[9px] text-foreground/30">
                            {driver.team}
                          </span>
                        </div>

                        {/* Points */}
                        <div className={`
                          text-right text-xs font-light
                          ${isAntonelli ? teamColor.text : isSelected ? teamColor.text : 'text-foreground/70'}
                        `}>
                          {driver.points}
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {isSelected && !isAntonelli && (
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 ${teamColor.dot} rounded-r`} />
                      )}
                      {isAntonelli && (
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 ${teamColor.dot} rounded-r`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right column: 13-23 */}
            <div className="flex flex-col min-h-0">
              {/* Column headers */}
              <div className="grid grid-cols-[1.25rem_1fr_2.5rem] gap-1 text-[10px] uppercase tracking-widest text-foreground/30 mb-1 px-1">
                <div></div>
                <div>Driver</div>
                <div className="text-right">Pts</div>
              </div>
              <div className="flex-1 flex flex-col justify-between min-h-0">
                {STANDINGS.slice(12).map((driver, index) => {
                  const actualIndex = index + 12;
                  const isSelected = actualIndex === selectedIndex;
                  const barWidth = getBarWidth(driver.points);
                  const teamColor = TEAM_COLORS[driver.team];

                  return (
                    <button
                      key={driver.driver}
                      onClick={() => setSelectedIndex(actualIndex)}
                      className={`
                        relative w-full text-left transition-all duration-300 cursor-pointer
                        ${isSelected ? 'z-10' : ''}
                      `}
                    >
                      {/* Points bar background */}
                      <div
                        className={`
                          absolute inset-0 transition-all duration-500 ease-out rounded
                          ${isSelected ? teamColor.bar : 'bg-zinc-800/50'}
                        `}
                        style={{ width: `${barWidth}%` }}
                      />

                      {/* Row content */}
                      <div className={`
                        relative grid grid-cols-[1.25rem_1fr_2.5rem] gap-1
                        py-0.5 px-1 rounded
                        transition-colors duration-200
                        ${!isSelected ? 'hover:bg-zinc-800/30' : ''}
                      `}>
                        {/* Rank */}
                        <div className={`
                          text-xs font-medium
                          ${isSelected ? teamColor.text : 'text-foreground/50'}
                        `}>
                          {actualIndex + 1}
                        </div>

                        {/* Driver & Team */}
                        <div className="flex items-center gap-1.5">
                          <span className={`
                            text-xs font-medium
                            ${isSelected ? teamColor.text : 'text-foreground/80'}
                          `}>
                            {driver.short}
                          </span>
                          <span className="text-[9px] text-foreground/30">
                            {driver.team}
                          </span>
                        </div>

                        {/* Points */}
                        <div className={`
                          text-right text-xs font-light
                          ${isSelected ? teamColor.text : 'text-foreground/70'}
                        `}>
                          {driver.points}
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 ${teamColor.dot} rounded-r`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* The Gap */}
          {(() => {
            const antonelliColor = TEAM_COLORS[ANTONELLI.team];
            const selectedColor = TEAM_COLORS[selectedDriver.team];
            return (
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  {/* Antonelli */}
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${antonelliColor.dot}`} />
                    <div>
                      <div className={`text-base md:text-lg font-medium ${antonelliColor.text}`}>
                        {ANTONELLI.short}
                      </div>
                      <div className="text-xl md:text-2xl font-light text-foreground">
                        {ANTONELLI.points}
                      </div>
                    </div>
                  </div>

                  {/* Gap */}
                  <div className="flex-1 mx-6 md:mx-10 relative">
                    <div className={`h-px bg-gradient-to-r from-teal-500/60 via-foreground/20 to-${selectedColor.dot.replace('bg-', '')}/40`} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4">
                      <span
                        ref={gapNumberRef}
                        className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground/80"
                      >
                        {currentGap}
                      </span>
                    </div>
                  </div>

                  {/* Selected Driver */}
                  <div className="flex items-center gap-3">
                    <div>
                      <div className={`text-base md:text-lg font-medium ${selectedColor.text} text-right`}>
                        {selectedDriver.short}
                      </div>
                      <div className="text-xl md:text-2xl font-light text-foreground text-right">
                        {selectedDriver.points}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${selectedColor.dot}`} />
                  </div>
                </div>

                <div className="text-center mt-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-foreground/30">
                    points apart
                  </span>
                </div>

              </div>
            );
          })()}

        </div>
      </div>
    </section>
  );
}
