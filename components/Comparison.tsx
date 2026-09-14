'use client';

import { useRef } from 'react';
import { gsap, useGSAP, reveal, countAll } from '@/lib/gsap';
import {
  getPlayerPath,
  computePlayerStats,
  getPlayer,
  ZVEREV_ID,
  SHELTON_ID
} from '@/lib/data/provider';

interface StatRowProps {
  label: string;
  zverevValue: string | number;
  sheltonValue: string | number;
  highlight?: 'zverev' | 'shelton' | 'none';
}

/** Numeric values get a data-count attribute so GSAP can count them up; strings render as-is. */
function StatValue({ value, className }: { value: string | number; className: string }) {
  const numeric = typeof value === 'number';
  return (
    <div className={className} data-count={numeric ? value : undefined}>
      {value}
    </div>
  );
}

function StatRow({ label, zverevValue, sheltonValue, highlight = 'none' }: StatRowProps) {
  return (
    <div className="cmp-row grid grid-cols-3 items-center py-4 border-b border-zinc-800/50">
      <StatValue
        value={zverevValue}
        className={`text-right pr-6 font-mono text-xl md:text-2xl ${
          highlight === 'zverev' ? 'text-accent' : 'text-foreground'
        }`}
      />
      <div className="text-center text-sm text-muted uppercase tracking-wider">
        {label}
      </div>
      <StatValue
        value={sheltonValue}
        className={`text-left pl-6 font-mono text-xl md:text-2xl ${
          highlight === 'shelton' ? 'text-amber-400' : 'text-foreground'
        }`}
      />
    </div>
  );
}

export function Comparison() {
  const containerRef = useRef<HTMLElement>(null);

  const zverevStats = computePlayerStats(ZVEREV_ID);
  const sheltonStats = computePlayerStats(SHELTON_ID);

  const zverev = getPlayer(ZVEREV_ID)!;
  const shelton = getPlayer(SHELTON_ID)!;

  const zverevPath = getPlayerPath(ZVEREV_ID);
  const sheltonPath = getPlayerPath(SHELTON_ID);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        reveal('.cmp-header');
        reveal('.cmp-head-left, .cmp-vs, .cmp-head-right', '.cmp-heads');
        gsap.utils.toArray<HTMLElement>('.cmp-row').forEach(row => reveal(row));
        countAll(containerRef.current!);
        reveal('.cmp-path', '.cmp-paths');
      });
      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-28 px-6 md:px-12 border-t border-zinc-800">
      {/* Section header */}
      <div className="cmp-header text-center mb-20 max-w-3xl mx-auto">
        <span className="text-caption block mb-4">03 &middot; The Finalists</span>
        <h2 className="text-headline mb-6">Two Paths to the Final</h2>
        <p className="text-body">
          Both players navigated through seven rounds, but their journeys told different stories.
          Zverev powered through with dominant serving while Shelton pulled off the upset of the tournament.
        </p>
      </div>

      {/* Player headers */}
      <div className="cmp-heads max-w-3xl mx-auto mb-8">
        <div className="grid grid-cols-3 items-end">
          <div className="cmp-head-left text-right pr-6">
            <div className="text-caption mb-1">{zverev.country}</div>
            <div className="text-title">{zverev.name}</div>
            <div className="flex items-center justify-end gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded bg-accent/20 text-accent">
                (1) Champion
              </span>
            </div>
          </div>

          <div className="cmp-vs text-center">
            <span className="text-2xl md:text-3xl font-light text-muted">vs</span>
          </div>

          <div className="cmp-head-right text-left pl-6">
            <div className="text-caption mb-1">{shelton.country}</div>
            <div className="text-title">{shelton.name}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-400">
                (8) Finalist
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats comparison */}
      <div className="max-w-3xl mx-auto">
        <StatRow
          label="Matches Won"
          zverevValue={zverevStats.matchesWon}
          sheltonValue={sheltonStats.matchesWon}
          highlight="zverev"
        />
        <StatRow
          label="Sets Won"
          zverevValue={zverevStats.setsWon}
          sheltonValue={sheltonStats.setsWon}
          highlight={zverevStats.setsWon > sheltonStats.setsWon ? 'zverev' : 'shelton'}
        />
        <StatRow
          label="Sets Lost"
          zverevValue={zverevStats.setsLost}
          sheltonValue={sheltonStats.setsLost}
          highlight={zverevStats.setsLost < sheltonStats.setsLost ? 'zverev' : 'shelton'}
        />
        <StatRow
          label="Games Won"
          zverevValue={zverevStats.gamesWon}
          sheltonValue={sheltonStats.gamesWon}
        />
        <StatRow
          label="Games Lost"
          zverevValue={zverevStats.gamesLost}
          sheltonValue={sheltonStats.gamesLost}
          highlight={zverevStats.gamesLost < sheltonStats.gamesLost ? 'zverev' : 'shelton'}
        />
        <StatRow
          label="Five-Set Matches"
          zverevValue={zverevStats.fiveSetMatches}
          sheltonValue={sheltonStats.fiveSetMatches}
        />
        <StatRow
          label="Tiebreaks Won"
          zverevValue={`${zverevStats.tiebreaksWon}/${zverevStats.tiebreaksPlayed}`}
          sheltonValue={`${sheltonStats.tiebreaksWon}/${sheltonStats.tiebreaksPlayed}`}
        />
        <StatRow
          label="Seeded Opponents Beaten"
          zverevValue={zverevStats.seededOpponentsDefeated}
          sheltonValue={sheltonStats.seededOpponentsDefeated}
          highlight={zverevStats.seededOpponentsDefeated > sheltonStats.seededOpponentsDefeated ? 'zverev' : 'shelton'}
        />
      </div>

      {/* Path highlights */}
      <div className="cmp-paths max-w-4xl mx-auto mt-16 grid md:grid-cols-2 gap-8">
        {/* Zverev highlight */}
        <div className="cmp-path p-6 rounded-lg border border-accent/30 bg-accent/5">
          <h3 className="text-title mb-4 text-accent">Zverev&apos;s Path</h3>
          <p className="text-sm text-muted mb-4">
            Started with two grueling five-set matches against Sonego and Halys,
            then found his rhythm with increasingly dominant performances through the later rounds.
          </p>
          <div className="space-y-2">
            {zverevPath.slice(0, 3).map((match) => (
              <div key={match.id} className="flex justify-between text-sm">
                <span className="text-muted">{match.loser.shortName}</span>
                <span className="font-mono">{match.score}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shelton highlight */}
        <div className="cmp-path p-6 rounded-lg border border-amber-400/30 bg-amber-400/5">
          <h3 className="text-title mb-4 text-amber-400">Shelton&apos;s Path</h3>
          <p className="text-sm text-muted mb-4">
            The story of the tournament: defeated world No. 2 Carlos Alcaraz in a dramatic
            five-set quarterfinal (7-6 in the fifth) to reach his first Grand Slam final.
          </p>
          <div className="space-y-2">
            {sheltonPath.filter(m => m.loser.seed && m.loser.seed <= 10).map(match => (
              <div key={match.id} className="flex justify-between text-sm">
                <span className="text-muted">({match.loser.seed}) {match.loser.shortName}</span>
                <span className="font-mono">{match.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
