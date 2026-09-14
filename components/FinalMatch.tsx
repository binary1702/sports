'use client';

import { useRef } from 'react';
import { gsap, useGSAP, reveal, countAll } from '@/lib/gsap';
import { getFinal, getPlayer, ZVEREV_ID, SHELTON_ID } from '@/lib/data/provider';

function SetVisualization({
  setNumber,
  zverevGames,
  sheltonGames,
  tiebreak,
  zverevWon,
}: {
  setNumber: number;
  zverevGames: number;
  sheltonGames: number;
  tiebreak?: { zverev: number; shelton: number };
  zverevWon: boolean;
}) {
  return (
    <div className="fm-set flex flex-col items-center">
      {/* Set number */}
      <div className="text-caption mb-4">Set {setNumber}</div>

      {/* Visual bar representation — final heights are static; GSAP animates scaleY */}
      <div className="relative h-40 w-full max-w-[80px] mb-4">
        {/* Zverev bar (from top) */}
        <div
          className={`fm-bar-top absolute top-0 left-0 right-0 rounded-t origin-top ${
            zverevWon ? 'bg-accent' : 'bg-accent/40'
          }`}
          style={{ height: `${(zverevGames / 7) * 50}%` }}
        />
        {/* Center line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-zinc-700" />
        {/* Shelton bar (from bottom) */}
        <div
          className={`fm-bar-bottom absolute bottom-0 left-0 right-0 rounded-b origin-bottom ${
            !zverevWon ? 'bg-amber-400' : 'bg-amber-400/40'
          }`}
          style={{ height: `${(sheltonGames / 7) * 50}%` }}
        />
      </div>

      {/* Score display */}
      <div className="text-center">
        <div
          className={`text-2xl md:text-3xl font-mono ${zverevWon ? 'text-accent' : 'text-muted'}`}
          data-count={zverevGames}
        >
          {zverevGames}
        </div>
        <div className="text-sm text-muted my-1">
          {tiebreak && (
            <span className="text-xs">({tiebreak.zverev}-{tiebreak.shelton})</span>
          )}
        </div>
        <div
          className={`text-2xl md:text-3xl font-mono ${!zverevWon ? 'text-amber-400' : 'text-muted'}`}
          data-count={sheltonGames}
        >
          {sheltonGames}
        </div>
      </div>
    </div>
  );
}

export function FinalMatch() {
  const containerRef = useRef<HTMLElement>(null);

  const final = getFinal();
  const zverev = getPlayer(ZVEREV_ID)!;
  const shelton = getPlayer(SHELTON_ID)!;

  // Parse set scores
  const sets = final.sets.map((set, i) => {
    const zverevGames = final.player1.id === ZVEREV_ID ? set.player1Games : set.player2Games;
    const sheltonGames = final.player1.id === SHELTON_ID ? set.player1Games : set.player2Games;
    const zverevWon = (set.winner === 1 && final.player1.id === ZVEREV_ID) ||
                      (set.winner === 2 && final.player2.id === ZVEREV_ID);

    let tiebreak = undefined;
    if (set.player1Tiebreak !== undefined || set.player2Tiebreak !== undefined) {
      tiebreak = {
        zverev: final.player1.id === ZVEREV_ID ? (set.player1Tiebreak || 0) : (set.player2Tiebreak || 0),
        shelton: final.player1.id === SHELTON_ID ? (set.player1Tiebreak || 0) : (set.player2Tiebreak || 0),
      };
    }

    return {
      number: i + 1,
      zverevGames,
      sheltonGames,
      tiebreak,
      zverevWon
    };
  });

  const zverevSetsWon = sets.filter(s => s.zverevWon).length;
  const sheltonSetsWon = sets.filter(s => !s.zverevWon).length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        reveal('.fm-header');
        reveal('.fm-banner');
        reveal('.fm-legend');
        reveal('.fm-set', '.fm-sets');
        gsap.from('.fm-bar-top, .fm-bar-bottom', {
          scaleY: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.05,
          scrollTrigger: { trigger: '.fm-sets', start: 'top 85%', toggleActions: 'play none none none' },
        });
        countAll(containerRef.current!);
        reveal('.fm-narrative');
      });
      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-28 px-6 md:px-12 border-t border-zinc-800 bg-zinc-900/50">
      {/* Section header */}
      <div className="fm-header text-center mb-16 max-w-3xl mx-auto">
        <span className="text-caption block mb-4">04 &middot; The Final &middot; September 13, 2026</span>
        <h2 className="text-headline mb-4">The Championship Match</h2>
        <p className="text-body">
          Arthur Ashe Stadium. The world&apos;s largest tennis arena. 23,000 fans witnessed
          Alexander Zverev claim his second Grand Slam title.
        </p>
      </div>

      {/* Final score banner */}
      <div className="fm-banner max-w-4xl mx-auto mb-16">
        <div className="flex items-center justify-center gap-8 md:gap-16 p-8 rounded-lg border border-zinc-800 bg-zinc-900">
          {/* Zverev */}
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 md:w-10 md:h-10 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="text-xs text-muted mb-1">(1) {zverev.country}</div>
            <div className="text-lg md:text-xl font-medium">{zverev.name}</div>
            <div className="text-4xl md:text-5xl font-light mt-2 text-accent" data-count={zverevSetsWon}>{zverevSetsWon}</div>
          </div>

          {/* Score separator */}
          <div className="text-3xl md:text-4xl font-light text-muted">:</div>

          {/* Shelton */}
          <div className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl md:text-3xl text-muted">2</span>
            </div>
            <div className="text-xs text-muted mb-1">(8) {shelton.country}</div>
            <div className="text-lg md:text-xl font-medium text-muted">{shelton.name}</div>
            <div className="text-4xl md:text-5xl font-light mt-2 text-muted" data-count={sheltonSetsWon}>{sheltonSetsWon}</div>
          </div>
        </div>
      </div>

      {/* Set-by-set visualization */}
      <div className="max-w-3xl mx-auto">
        <div className="fm-legend flex justify-between items-end mb-8">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent" />
            <span className="text-sm text-muted">Zverev</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-400" />
            <span className="text-sm text-muted">Shelton</span>
          </div>
        </div>

        <div className="fm-sets grid grid-cols-4 gap-4 md:gap-8">
          {sets.map((set, i) => (
            <SetVisualization
              key={i}
              setNumber={set.number}
              zverevGames={set.zverevGames}
              sheltonGames={set.sheltonGames}
              tiebreak={set.tiebreak}
              zverevWon={set.zverevWon}
            />
          ))}
        </div>
      </div>

      {/* Match narrative */}
      <div className="fm-narrative max-w-2xl mx-auto mt-16 text-center">
        <p className="text-body leading-relaxed">
          Zverev controlled the match from the start, winning the first set 6-3 and
          taking a tight second set in a tiebreak 7-6(2). Shelton fought back to
          claim the third set 7-5, but Zverev closed out the championship with a
          dominant 6-2 fourth set, sealing his legacy as a two-time Grand Slam champion.
        </p>
      </div>
    </section>
  );
}
