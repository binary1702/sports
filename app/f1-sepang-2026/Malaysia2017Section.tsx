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
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://www.youtube.com/embed/3ES6IGr0NoE?autoplay=1&mute=1&loop=1&playlist=3ES6IGr0NoE&controls=0&showinfo=0&rel=0&modestbranding=1&start=30"
          allow="autoplay; encrypted-media"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ border: 'none' }}
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 py-10 md:px-12 md:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-5xl">

          {/* Header */}
          <div className="mb-10">
            <span className="text-xs uppercase tracking-[0.3em] text-red-500">
              The last time F1 raced at Sepang was in 2017
            </span>
            <h2 className="text-2xl md:text-3xl font-light text-foreground mt-2">
              Malaysia 2017
            </h2>
            <p className="text-sm text-foreground/50 mt-2">
              October 1, 2017 &middot; Sepang International Circuit &middot; 56 laps
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

            {/* Left: Key Moments + Podium + Fastest Lap */}
            <div className="space-y-8">

              {/* Key Moments */}
              <div>
                <div className="text-xs uppercase tracking-widest text-foreground/30 mb-4">
                  Key Moments
                </div>
                <div className="space-y-5">
                  {KEY_MOMENTS.map((moment, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="text-2xl font-light text-red-500/30">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <a
                          href={getDriverUrl(moment.driverId)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                        >
                          {moment.driver}
                        </a>
                        <p className="text-sm text-foreground/60 leading-relaxed mt-0.5">
                          {moment.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Podium */}
              <div>
                <div className="text-xs uppercase tracking-widest text-foreground/30 mb-3">
                  Podium
                </div>
                <div className="flex items-end gap-2">
                  {/* P2 */}
                  <div className="flex-1 text-center">
                    <div className="bg-zinc-800/50 border border-zinc-700 pt-4 pb-2 px-2">
                      <div className="text-xs text-foreground/40 mb-1">2</div>
                      <a
                        href={getDriverUrl(podium[1].Driver.driverId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                      >
                        {podium[1].Driver.familyName}
                      </a>
                      <div className="text-xs text-foreground/40 mt-0.5">{podium[1].Time?.time}</div>
                    </div>
                  </div>
                  {/* P1 */}
                  <div className="flex-1 text-center">
                    <div className="bg-zinc-800/50 border border-red-500/30 pt-6 pb-2 px-2">
                      <div className="text-xs text-red-500 mb-1">1</div>
                      <a
                        href={getDriverUrl(podium[0].Driver.driverId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                      >
                        {podium[0].Driver.familyName}
                      </a>
                      <div className="text-xs text-foreground/40 mt-0.5">{podium[0].Time?.time}</div>
                    </div>
                  </div>
                  {/* P3 */}
                  <div className="flex-1 text-center">
                    <div className="bg-zinc-800/50 border border-zinc-700 pt-3 pb-2 px-2">
                      <div className="text-xs text-foreground/40 mb-1">3</div>
                      <a
                        href={getDriverUrl(podium[2].Driver.driverId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-foreground hover:text-red-400 transition-colors"
                      >
                        {podium[2].Driver.familyName}
                      </a>
                      <div className="text-xs text-foreground/40 mt-0.5">{podium[2].Time?.time}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fastest Lap */}
              <div className="pt-4 border-t border-zinc-800">
                <div className="text-xs text-foreground/30 uppercase tracking-wider mb-1">
                  Fastest Lap
                </div>
                <div className="flex items-baseline gap-2">
                  <a
                    href={getDriverUrl('vettel')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground font-medium hover:text-red-400 transition-colors"
                  >
                    Vettel
                  </a>
                  <span className="text-red-500 tabular-nums">1:34.080</span>
                  <span className="text-foreground/40 text-xs">Lap 41</span>
                </div>
              </div>
            </div>

            {/* Right: Who Remembers Sepang */}
            <div>
              <div className="text-xs uppercase tracking-widest text-foreground/30 mb-4">
                Who Remembers Sepang?
              </div>
              <p className="text-sm text-foreground/50 mb-5">
                10 drivers have started an F1 race here. 12 have not.
              </p>

              {/* Bar chart */}
              <div className="space-y-2">
                {SEPANG_EXPERIENCE.map((driver) => (
                  <div key={driver.driverId} className="flex items-center gap-3">
                    {/* Name */}
                    <a
                      href={getDriverUrl(driver.driverId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-24 text-sm text-foreground hover:text-red-400 transition-colors truncate"
                    >
                      {driver.name}
                    </a>

                    {/* Bar */}
                    <div className="flex-1 h-4 bg-zinc-900 relative">
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
                    <div className="w-6 text-sm tabular-nums text-foreground/60 text-right">
                      {driver.starts}
                    </div>
                  </div>
                ))}

                {/* 12 other drivers */}
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-800 mt-3">
                  <div className="w-24 text-sm text-foreground/40">
                    12 others
                  </div>
                  <div className="flex-1 h-4 bg-zinc-900 relative">
                    {/* empty bar */}
                  </div>
                  <div className="w-6 text-sm tabular-nums text-foreground/30 text-right">
                    0
                  </div>
                </div>
              </div>

              {/* Notable callouts */}
              <div className="mt-6 space-y-2 text-xs text-foreground/50">
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
