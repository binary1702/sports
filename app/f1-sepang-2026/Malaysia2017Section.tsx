'use client';

import resultsData from '@/data/historical/2017/malaysia-results.json';

const raceData = resultsData.MRData.RaceTable.Races[0];
const results = raceData.Results;

// Podium finishers
const podium = results.slice(0, 3);

// Map driverId to F1.com URL slug
const driverUrlMap: Record<string, string> = {
  max_verstappen: 'max-verstappen',
  hamilton: 'lewis-hamilton',
  ricciardo: 'daniel-ricciardo',
  vettel: 'sebastian-vettel',
  bottas: 'valtteri-bottas',
  perez: 'sergio-perez',
  raikkonen: 'kimi-raikkonen',
  ocon: 'esteban-ocon',
  stroll: 'lance-stroll',
  hulkenberg: 'nico-hulkenberg',
  gasly: 'pierre-gasly',
  alonso: 'fernando-alonso',
  sainz: 'carlos-sainz',
};

const getDriverUrl = (driverId: string) => {
  const slug = driverUrlMap[driverId] || driverId.replace('_', '-');
  return `https://www.formula1.com/en/drivers/${slug}`;
};

// Key moments from the race
const KEY_MOMENTS = [
  {
    driver: 'Verstappen',
    driverId: 'max_verstappen',
    detail: 'Won the day after turning 20, passing Hamilton for the lead',
  },
  {
    driver: 'Vettel',
    driverId: 'vettel',
    detail: 'Started P20, finished P4, set fastest lap (1:34.080)',
  },
  {
    driver: 'Räikkönen',
    driverId: 'raikkonen',
    detail: 'DNF on lap 0 with battery failure',
  },
];

// 2026 Team colors
const TEAM_COLORS: Record<string, string> = {
  'Aston Martin': '#229971',
  'Ferrari': '#E8002D',
  'Red Bull': '#3671C6',
  'Cadillac': '#E8E8E8',
  'Audi': '#C0C0C0',
  'McLaren': '#FF8700',
  'Haas': '#B6BABD',
  'Alpine': '#FF87BC',
  'Williams': '#64C4FF',
};

// Drivers on 2026 grid with Sepang F1 experience
const SEPANG_EXPERIENCE = [
  { name: 'Alonso', driverId: 'alonso', starts: 16, firstYear: 2001, team2026: 'Aston Martin', note: 'Won 2005, 2007, 2012' },
  { name: 'Hamilton', driverId: 'hamilton', starts: 11, firstYear: 2007, team2026: 'Ferrari', note: 'Won 2014' },
  { name: 'Pérez', driverId: 'perez', starts: 7, firstYear: 2011, team2026: 'Cadillac', note: '' },
  { name: 'Hülkenberg', driverId: 'hulkenberg', starts: 7, firstYear: 2010, team2026: 'Audi', note: '' },
  { name: 'Bottas', driverId: 'bottas', starts: 5, firstYear: 2013, team2026: 'Cadillac', note: '' },
  { name: 'Verstappen', driverId: 'max_verstappen', starts: 3, firstYear: 2015, team2026: 'Red Bull', note: 'Won 2017' },
  { name: 'Sainz', driverId: 'sainz', starts: 3, firstYear: 2015, team2026: 'Williams', note: '' },
  { name: 'Ocon', driverId: 'ocon', starts: 2, firstYear: 2016, team2026: 'Haas', note: '' },
  { name: 'Stroll', driverId: 'stroll', starts: 1, firstYear: 2017, team2026: 'Aston Martin', note: '' },
  { name: 'Gasly', driverId: 'gasly', starts: 1, firstYear: 2017, team2026: 'Alpine', note: 'F1 debut' },
];

const maxStarts = 16; // Alonso's count for scaling

export function Malaysia2017Section() {
  return (
    <section className="snap-section reveal-section relative min-h-dvh border-t border-zinc-800 bg-black overflow-hidden">
      {/* Background video - zoomed on mobile for vertical crop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/3ES6IGr0NoE?autoplay=1&mute=1&loop=1&playlist=3ES6IGr0NoE&controls=0&showinfo=0&rel=0&modestbranding=1&start=30"
          allow="autoplay; encrypted-media"
          className="absolute pointer-events-none w-[450%] h-[250%] md:w-[120%] md:h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ border: 'none' }}
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-3 py-4 md:px-12 md:py-12 lg:px-16 lg:py-16 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl">

          {/* Header */}
          <div className="mb-3 md:mb-10">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-red-500">
              Last F1 race at Sepang: 2017
            </span>
            <h2 className="text-lg md:text-3xl font-light text-foreground mt-1">
              Malaysia 2017
            </h2>
            <p className="text-[10px] md:text-sm text-foreground/50 mt-1">
              Oct 1, 2017 · Sepang · 56 laps
            </p>
          </div>

          {/* Two-column layout - always 2 cols on mobile too */}
          <div className="grid grid-cols-2 gap-3 md:gap-10">

            {/* Left: Key Moments + Podium + Fastest Lap */}
            <div className="space-y-3 md:space-y-8">

              {/* Key Moments */}
              <div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/30 mb-2 md:mb-4">
                  Key Moments
                </div>
                <div className="space-y-2 md:space-y-5">
                  {KEY_MOMENTS.map((moment, idx) => (
                    <div key={idx} className="flex gap-2 md:gap-4">
                      <div className="text-base md:text-2xl font-light text-red-500/30">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <a
                          href={getDriverUrl(moment.driverId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] md:text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                        >
                          {moment.driver}
                        </a>
                        <p className="text-[10px] md:text-sm text-foreground/60 leading-snug mt-0.5">
                          {moment.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Podium */}
              <div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/30 mb-2 md:mb-3">
                  Podium
                </div>
                <div className="flex items-end gap-1 md:gap-2">
                  {/* P2 */}
                  <div className="flex-1 text-center">
                    <div className="bg-zinc-800/50 border border-zinc-700 pt-2 md:pt-4 pb-1 md:pb-2 px-1 md:px-2">
                      <div className="text-[10px] md:text-xs text-foreground/40 mb-0.5">2</div>
                      <a
                        href={getDriverUrl(podium[1].Driver.driverId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                      >
                        {podium[1].Driver.familyName}
                      </a>
                      <div className="text-[9px] md:text-xs text-foreground/40 mt-0.5">{podium[1].Time?.time}</div>
                    </div>
                  </div>
                  {/* P1 */}
                  <div className="flex-1 text-center">
                    <div className="bg-zinc-800/50 border border-red-500/30 pt-3 md:pt-6 pb-1 md:pb-2 px-1 md:px-2">
                      <div className="text-[10px] md:text-xs text-red-500 mb-0.5">1</div>
                      <a
                        href={getDriverUrl(podium[0].Driver.driverId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                      >
                        {podium[0].Driver.familyName}
                      </a>
                      <div className="text-[9px] md:text-xs text-foreground/40 mt-0.5">{podium[0].Time?.time}</div>
                    </div>
                  </div>
                  {/* P3 */}
                  <div className="flex-1 text-center">
                    <div className="bg-zinc-800/50 border border-zinc-700 pt-1.5 md:pt-3 pb-1 md:pb-2 px-1 md:px-2">
                      <div className="text-[10px] md:text-xs text-foreground/40 mb-0.5">3</div>
                      <a
                        href={getDriverUrl(podium[2].Driver.driverId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] md:text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                      >
                        {podium[2].Driver.familyName}
                      </a>
                      <div className="text-[9px] md:text-xs text-foreground/40 mt-0.5">{podium[2].Time?.time}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fastest Lap */}
              <div className="pt-2 md:pt-4 border-t border-zinc-800">
                <div className="text-[10px] md:text-xs text-foreground/30 uppercase tracking-wider mb-0.5">
                  Fastest Lap
                </div>
                <div className="flex items-baseline gap-1 md:gap-2">
                  <a
                    href={getDriverUrl('vettel')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] md:text-base text-foreground font-medium hover:text-red-400 transition-colors"
                  >
                    Vettel
                  </a>
                  <span className="text-[11px] md:text-base text-red-500 tabular-nums">1:34.080</span>
                  <span className="text-foreground/40 text-[9px] md:text-xs">Lap 41</span>
                </div>
              </div>
            </div>

            {/* Right: Who Remembers Sepang */}
            <div>
              <div className="text-[10px] md:text-xs uppercase tracking-widest text-foreground/30 mb-2 md:mb-4">
                Sepang Experience
              </div>
              <p className="text-[10px] md:text-sm text-foreground/50 mb-2 md:mb-5">
                10 drivers raced here. 12 have not.
              </p>

              {/* Bar chart */}
              <div className="space-y-1 md:space-y-2">
                {SEPANG_EXPERIENCE.map((driver) => (
                  <div key={driver.driverId} className="flex items-center gap-1.5 md:gap-3">
                    {/* Name */}
                    <a
                      href={getDriverUrl(driver.driverId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 md:w-24 text-[10px] md:text-sm text-foreground hover:text-red-400 transition-colors truncate"
                    >
                      {driver.name}
                    </a>

                    {/* Bar */}
                    <div className="flex-1 h-3 md:h-4 bg-zinc-900 relative">
                      <div
                        className="h-full"
                        style={{
                          width: `${(driver.starts / maxStarts) * 100}%`,
                          backgroundColor: TEAM_COLORS[driver.team2026] || '#ef4444',
                          opacity: 0.85,
                        }}
                      />
                    </div>

                    {/* Count */}
                    <div className="w-4 md:w-6 text-[10px] md:text-sm tabular-nums text-foreground/60 text-right">
                      {driver.starts}
                    </div>
                  </div>
                ))}

                {/* 12 other drivers */}
                <div className="flex items-center gap-1.5 md:gap-3 pt-1 md:pt-2 border-t border-zinc-800 mt-1.5 md:mt-3">
                  <div className="w-16 md:w-24 text-[10px] md:text-sm text-foreground/40">
                    12 others
                  </div>
                  <div className="flex-1 h-3 md:h-4 bg-zinc-900 relative">
                    {/* empty bar */}
                  </div>
                  <div className="w-4 md:w-6 text-[10px] md:text-sm tabular-nums text-foreground/30 text-right">
                    0
                  </div>
                </div>
              </div>

              {/* Notable callouts - hidden on mobile */}
              <div className="hidden md:block mt-6 space-y-2 text-xs text-foreground/50">
                <p><span className="text-foreground/70">Alonso</span> has raced here more than some drivers have completed full seasons.</p>
                <p><span className="text-foreground/70">Gasly's</span> only previous Sepang start was his F1 debut.</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
