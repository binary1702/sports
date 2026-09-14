'use client';

import Image from 'next/image';
import {
  computePlayerStats,
  getPlayer,
  getFinal,
  ZVEREV_ID,
  SHELTON_ID
} from '@/lib/data/provider';

const FLAGS: Record<string, string> = {
  Germany: '🇩🇪',
  USA: '🇺🇸',
};

// Centered comparison bar - bars grow from center outward
function ComparisonBar({ label, zValue, sValue, maxValue }: {
  label: string;
  zValue: number;
  sValue: number;
  maxValue: number;
}) {
  const zWidth = (zValue / maxValue) * 100;
  const sWidth = (sValue / maxValue) * 100;
  const zWins = zValue > sValue;
  const sWins = sValue > zValue;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 mb-2 md:mb-3">
      {/* Zverev side - bar grows right-to-left */}
      <div className="flex items-center justify-end gap-2 md:gap-3">
        <div className="flex-1 h-1 md:h-1.5 bg-zinc-900/50 rounded-full overflow-hidden flex justify-end">
          <div
            className={`h-full rounded-full ${zWins ? 'bg-us-open-yellow' : 'bg-zinc-700'}`}
            style={{ width: `${zWidth}%` }}
          />
        </div>
        <span className={`font-mono text-sm md:text-xl w-5 md:w-6 text-right ${zWins ? 'text-us-open-yellow' : 'text-foreground'}`}>{zValue}</span>
      </div>

      {/* Center label */}
      <div className="text-[10px] md:text-sm text-muted uppercase tracking-wider w-14 md:w-20 text-center">
        {label}
      </div>

      {/* Shelton side - bar grows left-to-right */}
      <div className="flex items-center gap-2 md:gap-3">
        <span className={`font-mono text-sm md:text-xl w-5 md:w-6 ${sWins ? 'text-accent' : 'text-foreground/50'}`}>{sValue}</span>
        <div className="flex-1 h-1 md:h-1.5 bg-zinc-900/50 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${sWins ? 'bg-accent' : 'bg-zinc-700'}`}
            style={{ width: `${sWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function FinalsShowdown() {
  const zverevStats = computePlayerStats(ZVEREV_ID);
  const sheltonStats = computePlayerStats(SHELTON_ID);
  const zverev = getPlayer(ZVEREV_ID)!;
  const shelton = getPlayer(SHELTON_ID)!;

  const final = getFinal();
  const sets = final.sets.map((set, i) => {
    const zverevGames = final.player1.id === ZVEREV_ID ? set.player1Games : set.player2Games;
    const sheltonGames = final.player1.id === SHELTON_ID ? set.player1Games : set.player2Games;
    const zverevWon = (set.winner === 1 && final.player1.id === ZVEREV_ID) ||
                      (set.winner === 2 && final.player2.id === ZVEREV_ID);

    return { number: i + 1, zverevGames, sheltonGames, zverevWon };
  });

  const zverevSetsWon = sets.filter(s => s.zverevWon).length;
  const sheltonSetsWon = sets.filter(s => !s.zverevWon).length;

  const formatSetScore = (set: typeof sets[0]) => {
    return `${set.zverevGames}-${set.sheltonGames}`;
  };

  return (
    <section className="snap-section reveal-section relative flex flex-col justify-center px-6 md:px-12 border-t border-zinc-800 bg-background overflow-hidden">

      {/* Background layers */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Photo layer */}
        <Image
          src="/shelton-zverev.avif"
          alt=""
          fill
          className="opacity-60 object-cover object-[100%_top] md:object-top"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

        {/* Court geometry - subtle lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          {/* Center line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white" />
          {/* Horizontal lines */}
          <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
          <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
          {/* Service boxes */}
          <div className="absolute top-1/3 bottom-1/3 left-1/4 right-1/4 border border-white" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto w-full">

        {/* BAND 1: Final Result */}
        <div className="text-center mb-8">
          <span className="text-sm md:text-base text-foreground/80 uppercase tracking-widest">01 &middot; The Final</span>
        </div>

        {/* Two-line title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-light text-muted tracking-wide">TWO PATHS.</h2>
          <h2 className="text-4xl md:text-6xl font-light text-foreground tracking-wide">ONE CHAMPIONSHIP.</h2>
        </div>

        {/* Player names + score - stacked on mobile, grid on desktop */}
        {/* Mobile layout */}
        <div className="md:hidden flex flex-col items-center gap-4 mb-6">
          {/* Score */}
          <div className="flex items-center gap-4">
            <span className="text-7xl font-light text-us-open-yellow">{zverevSetsWon}</span>
            <span className="text-3xl font-light text-zinc-600">&mdash;</span>
            <span className="text-7xl font-light text-accent">{sheltonSetsWon}</span>
          </div>

          {/* Players */}
          <div className="flex items-center justify-center gap-6 w-full">
            <div className="text-center">
              <div className="text-sm text-foreground/60 mb-1">{FLAGS[zverev.country]}</div>
              <a
                href="https://www.espn.com/tennis/player/_/id/2879/alexander-zverev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-light text-us-open-yellow hover:opacity-80 transition-opacity"
              >
                ZVEREV
              </a>
            </div>

            <div className="text-zinc-600 text-lg">vs</div>

            <div className="text-center">
              <div className="text-sm text-foreground/60 mb-1">{FLAGS[shelton.country]}</div>
              <a
                href="https://www.espn.com/tennis/player/_/id/4919102/ben-shelton"
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-light text-accent hover:opacity-80 transition-opacity"
              >
                SHELTON
              </a>
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-8 md:gap-12 mb-6">
          <div className="text-right">
            <div className="text-base md:text-lg text-foreground/60 mb-2">{FLAGS[zverev.country]} {zverev.country}</div>
            <a
              href="https://www.espn.com/tennis/player/_/id/2879/alexander-zverev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl md:text-6xl font-light tracking-tight whitespace-nowrap text-us-open-yellow hover:opacity-80 transition-opacity"
            >
              {zverev.shortName.toUpperCase()}
            </a>
            <div className="text-sm md:text-base text-us-open-yellow/70 uppercase tracking-widest mt-2">Champion</div>
          </div>

          <div className="flex items-center gap-5 md:gap-8">
            <span className="text-7xl md:text-9xl font-light text-us-open-yellow">{zverevSetsWon}</span>
            <span className="text-4xl md:text-6xl font-light text-zinc-600">&mdash;</span>
            <span className="text-7xl md:text-9xl font-light text-accent">{sheltonSetsWon}</span>
          </div>

          <div className="text-left">
            <div className="text-base md:text-lg text-foreground/60 mb-2">{FLAGS[shelton.country]} {shelton.country}</div>
            <a
              href="https://www.espn.com/tennis/player/_/id/4919102/ben-shelton"
              target="_blank"
              rel="noopener noreferrer"
              className="text-4xl md:text-6xl font-light tracking-tight text-accent whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {shelton.shortName.toUpperCase()}
            </a>
          </div>
        </div>

        {/* Set scores */}
        <div className="flex items-center justify-center gap-6 md:gap-10 font-mono text-xl md:text-2xl mb-10">
          {sets.map((set, i) => (
            <span
              key={i}
              className={set.zverevWon ? 'text-us-open-yellow' : 'text-accent'}
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
            >
              {formatSetScore(set)}
            </span>
          ))}
        </div>

        {/* Hairline */}
        <div className="w-full h-px bg-zinc-800/50 mb-6" />


        {/* Player headers for bars */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-6 mb-2 md:mb-3">
          <div className="text-right text-xs md:text-sm text-us-open-yellow">{zverev.shortName}</div>
          <div className="w-14 md:w-20" />
          <div className="text-left text-xs md:text-sm text-accent">{shelton.shortName}</div>
        </div>

        <ComparisonBar label="Matches" zValue={zverevStats.matchesWon} sValue={sheltonStats.matchesWon} maxValue={7} />
        <ComparisonBar label="Sets" zValue={zverevStats.setsWon} sValue={sheltonStats.setsWon} maxValue={Math.max(zverevStats.setsWon, sheltonStats.setsWon)} />
        <ComparisonBar label="Lost" zValue={zverevStats.setsLost} sValue={sheltonStats.setsLost} maxValue={Math.max(zverevStats.setsLost, sheltonStats.setsLost)} />
        <ComparisonBar label="Tiebreaks" zValue={zverevStats.tiebreaksWon} sValue={sheltonStats.tiebreaksWon} maxValue={Math.max(zverevStats.tiebreaksWon, sheltonStats.tiebreaksWon, 1)} />

      </div>

      {/* Venue info - bottom right (hidden on mobile) */}
      <div className="hidden md:block absolute bottom-12 right-12 z-10 text-right">
        <div className="text-xl text-foreground/90 font-light tracking-wide">
          NYC, Arthur Ashe Stadium
        </div>
        <div className="text-base text-muted/70 tracking-wider">
          September 13, 2026
        </div>
      </div>
    </section>
  );
}
