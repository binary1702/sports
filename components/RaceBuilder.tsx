'use client';

import { useState } from 'react';

// F1 points system (top 10)
const POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1] as const;

// Team colors (official F1 2026 colors)
const TEAM_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Mercedes': { bg: 'bg-teal-500/20', border: 'border-teal-500/50', text: 'text-teal-400' },
  'Ferrari': { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-500' },
  'McLaren': { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
  'Red Bull': { bg: 'bg-blue-600/20', border: 'border-blue-600/50', text: 'text-blue-400' },
  'RB': { bg: 'bg-blue-400/20', border: 'border-blue-400/50', text: 'text-blue-300' },
  'Alpine': { bg: 'bg-pink-500/20', border: 'border-pink-500/50', text: 'text-pink-400' },
  'Haas': { bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-300' },
  'Audi': { bg: 'bg-gray-400/20', border: 'border-gray-400/50', text: 'text-gray-300' },
  'Williams': { bg: 'bg-sky-500/20', border: 'border-sky-500/50', text: 'text-sky-400' },
  'Aston Martin': { bg: 'bg-emerald-600/20', border: 'border-emerald-600/50', text: 'text-emerald-400' },
  'Cadillac': { bg: 'bg-slate-200/20', border: 'border-slate-200/50', text: 'text-slate-200' },
};

// Teams in constructor order
const TEAMS = [
  { name: 'Mercedes' },
  { name: 'Ferrari' },
  { name: 'McLaren' },
  { name: 'Red Bull' },
  { name: 'RB' },
  { name: 'Alpine' },
  { name: 'Haas' },
  { name: 'Audi' },
  { name: 'Williams' },
  { name: 'Aston Martin' },
  { name: 'Cadillac' },
] as const;

// Championship standings data
const DRIVERS = [
  { short: 'Antonelli', team: 'Mercedes', points: 302 },
  { short: 'Russell', team: 'Mercedes', points: 236 },
  { short: 'Hamilton', team: 'Ferrari', points: 199 },
  { short: 'Norris', team: 'McLaren', points: 186 },
  { short: 'Leclerc', team: 'Ferrari', points: 179 },
  { short: 'Verstappen', team: 'Red Bull', points: 163 },
  { short: 'Piastri', team: 'McLaren', points: 120 },
  { short: 'Hadjar', team: 'Red Bull', points: 86 },
  { short: 'Lawson', team: 'RB', points: 59 },
  { short: 'Gasly', team: 'Alpine', points: 41 },
  { short: 'Lindblad', team: 'RB', points: 37 },
  { short: 'Colapinto', team: 'Alpine', points: 27 },
  { short: 'Bearman', team: 'Haas', points: 20 },
  { short: 'Bortoleto', team: 'Audi', points: 10 },
  { short: 'Hulkenberg', team: 'Audi', points: 7 },
  { short: 'Ocon', team: 'Haas', points: 7 },
  { short: 'Sainz', team: 'Williams', points: 7 },
  { short: 'Albon', team: 'Williams', points: 5 },
  { short: 'Alonso', team: 'Aston Martin', points: 3 },
  { short: 'Stroll', team: 'Aston Martin', points: 0 },
  { short: 'Bottas', team: 'Cadillac', points: 0 },
  { short: 'Pérez', team: 'Cadillac', points: 0 },
] as const;

type Driver = typeof DRIVERS[number];
type Placements = (Driver | null)[];

export function RaceBuilder() {
  const [placements, setPlacements] = useState<Placements>(Array(10).fill(null));
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showResults, setShowResults] = useState(false);

  const placedDrivers = new Set(placements.filter(Boolean).map(d => d!.short));
  const hasAnyPlacement = placements.some(p => p !== null);

  // Calculate championship results
  const getResults = () => {
    const racePointsMap = new Map<string, number>();
    placements.forEach((driver, index) => {
      if (driver) {
        racePointsMap.set(driver.short, POINTS[index]);
      }
    });

    return DRIVERS.map((driver, oldPos) => {
      const racePoints = racePointsMap.get(driver.short) || 0;
      const newTotal = driver.points + racePoints;
      return { driver, racePoints, oldTotal: driver.points, newTotal, oldPos };
    }).sort((a, b) => b.newTotal - a.newTotal)
      .map((r, newPos) => ({ ...r, newPos, change: r.oldPos - newPos }));
  };

  const handleDriverClick = (driver: Driver) => {
    if (showResults) return;
    setSelectedDriver(selectedDriver?.short === driver.short ? null : driver);
  };

  const handleSlotClick = (slotIndex: number) => {
    if (showResults) return;
    if (!selectedDriver) {
      const occupant = placements[slotIndex];
      if (occupant) {
        const newPlacements = [...placements];
        newPlacements[slotIndex] = null;
        setPlacements(newPlacements);
        setSelectedDriver(occupant);
      }
      return;
    }
    const newPlacements = [...placements];
    newPlacements[slotIndex] = selectedDriver;
    setPlacements(newPlacements);
    setSelectedDriver(null);
  };

  const handleClearSlot = (slotIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPlacements = [...placements];
    newPlacements[slotIndex] = null;
    setPlacements(newPlacements);
  };

  const handleRandomize = () => {
    const weights = DRIVERS.map((_, index) => {
      if (index < 3) return 10;
      if (index < 6) return 7;
      if (index < 10) return 4;
      if (index < 15) return 2;
      return 1;
    });

    const availableIndices = DRIVERS.map((_, i) => i);
    const result: (Driver | null)[] = [];

    for (let pos = 0; pos < 10; pos++) {
      const positionMultiplier = 10 - pos;
      const weightedPool: number[] = [];
      availableIndices.forEach(driverIndex => {
        const driverWeight = weights[driverIndex] * positionMultiplier;
        for (let i = 0; i < driverWeight; i++) {
          weightedPool.push(driverIndex);
        }
      });

      const pickedIndex = weightedPool[Math.floor(Math.random() * weightedPool.length)];
      result.push(DRIVERS[pickedIndex]);
      availableIndices.splice(availableIndices.indexOf(pickedIndex), 1);
    }

    setPlacements(result);
    setSelectedDriver(null);
    setShowResults(false);
  };

  const handleReset = () => {
    setPlacements(Array(10).fill(null));
    setSelectedDriver(null);
    setShowResults(false);
  };

  const results = getResults();

  return (
    <section className="snap-section reveal-section relative h-dvh border-t border-zinc-800 bg-black overflow-hidden">
      {/* Background video - zoomed on mobile for vertical crop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/9fWkhYaT-0c?autoplay=1&mute=1&loop=1&playlist=9fWkhYaT-0c&controls=0&showinfo=0&rel=0&modestbranding=1&start=0"
          allow="autoplay; encrypted-media"
          className="absolute pointer-events-none w-[450%] h-[250%] md:w-[120%] md:h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ border: 'none' }}
        />
        <div className="absolute inset-0 bg-black/85" />
      </div>

      <div className="relative z-10 h-full flex flex-col px-4 py-6 md:px-10 md:py-8 lg:px-12 lg:py-10">
        <div className="mx-auto w-full max-w-3xl flex flex-col h-full">

          <div className="mb-4">
            <span className="text-xs uppercase tracking-[0.3em] text-red-500">
              What Does Sepang Change?
            </span>
            <h2 className="text-lg md:text-xl font-medium text-foreground mt-1">
              Build Your Top 10
            </h2>
            <p className="text-xs text-foreground/50 mt-1">
              {selectedDriver ? `Click a position for ${selectedDriver.short}` : 'Click a driver, then click a position'}
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4 lg:gap-6">

            {/* Position Slots */}
            <div className="flex flex-col h-full">
              <div className="text-xs uppercase tracking-widest text-foreground/30 mb-3">
                Sepang Finish
              </div>
              <div className="flex-1 flex flex-col justify-evenly">
                {POINTS.map((points, index) => {
                  const occupant = placements[index];
                  const isHighlighted = selectedDriver !== null;
                  const teamColor = selectedDriver ? TEAM_COLORS[selectedDriver.team] : null;
                  const occupantColor = occupant ? TEAM_COLORS[occupant.team] : null;

                  return (
                    <div
                      key={index}
                      onClick={() => handleSlotClick(index)}
                      className={`
                        w-full flex items-center gap-2 px-3 py-1.5 rounded transition-all duration-200 cursor-pointer
                        ${occupant
                          ? `${occupantColor?.bg} border ${occupantColor?.border}`
                          : isHighlighted && teamColor
                            ? `${teamColor.bg} border ${teamColor.border}`
                            : 'border border-zinc-800 hover:border-zinc-700'
                        }
                      `}
                    >
                      <div className="w-7 text-xs font-medium text-foreground/50">P{index + 1}</div>
                      <div className="flex-1 text-left">
                        {occupant ? (
                          <span className="text-xs font-medium text-foreground">{occupant.short}</span>
                        ) : (
                          <span className="text-xs text-foreground/20">—</span>
                        )}
                      </div>
                      <div className="text-xs text-foreground/40">+{points}</div>
                      {occupant && (
                        <button
                          onClick={(e) => handleClearSlot(index, e)}
                          className="w-4 h-4 flex items-center justify-center text-foreground/30 hover:text-foreground/60 text-xs"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Driver Pool by Team */}
            <div className="flex flex-col justify-evenly h-full">
              {TEAMS.map((team) => {
                const teamDrivers = DRIVERS.filter(d => d.team === team.name);
                return (
                  <div key={team.name}>
                    <div className="text-[10px] uppercase tracking-widest text-foreground/30 mb-1">{team.name}</div>
                    <div className="grid grid-cols-2 gap-0.5">
                      {teamDrivers.map((driver) => {
                        const isPlaced = placedDrivers.has(driver.short);
                        const isSelected = selectedDriver?.short === driver.short;
                        const driverTeamColor = TEAM_COLORS[driver.team];

                        return (
                          <button
                            key={driver.short}
                            onClick={() => handleDriverClick(driver)}
                            disabled={isPlaced}
                            className={`
                              flex items-center justify-between px-2 py-1 rounded text-left text-xs transition-all duration-200
                              ${isPlaced
                                ? 'text-foreground/20 cursor-default'
                                : isSelected
                                  ? `${driverTeamColor.bg} border ${driverTeamColor.border} ${driverTeamColor.text}`
                                  : 'hover:bg-zinc-800/50 text-foreground/80 hover:text-foreground'
                              }
                            `}
                          >
                            <span className={isPlaced ? 'line-through' : ''}>{driver.short}</span>
                            <span className="text-[10px] text-foreground/40">{driver.points}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={handleReset}
              className={`text-xs text-foreground/30 hover:text-foreground/60 transition-colors ${hasAnyPlacement ? 'visible' : 'invisible'}`}
            >
              Reset
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRandomize}
                className="px-4 py-2 rounded text-xs font-medium uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-all"
              >
                Randomize
              </button>
              <button
                onClick={() => setShowResults(true)}
                disabled={!hasAnyPlacement}
                className={`px-4 py-2 rounded text-xs font-medium uppercase tracking-widest transition-all ${
                  hasAnyPlacement ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-zinc-800 text-foreground/30 cursor-not-allowed'
                }`}
              >
                See Championship
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Results Modal */}
      {showResults && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-md w-full mx-6 max-h-[80vh] flex flex-col">

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-zinc-800">
              <span className="text-xs uppercase tracking-[0.3em] text-red-500">
                Your Championship
              </span>
              <h3 className="text-lg font-medium text-foreground mt-1">
                After Sepang
              </h3>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-[1.5rem_1fr_2.5rem_2.5rem_2.5rem_1.5rem] gap-1 text-[10px] uppercase tracking-widest text-foreground/30 mb-2">
                <div></div>
                <div>Driver</div>
                <div className="text-right">Was</div>
                <div className="text-right">+</div>
                <div className="text-right">Now</div>
                <div></div>
              </div>

              {results.slice(0, 12).map((r, index) => (
                <div
                  key={r.driver.short}
                  className="grid grid-cols-[1.5rem_1fr_2.5rem_2.5rem_2.5rem_1.5rem] gap-1 py-1.5 border-b border-zinc-800/30"
                >
                  <div className="text-xs text-foreground/50">{index + 1}</div>
                  <div className={`text-xs font-medium ${index === 0 ? 'text-red-500' : 'text-foreground'}`}>
                    {r.driver.short}
                  </div>
                  <div className="text-right text-xs text-foreground/40">{r.oldTotal}</div>
                  <div className={`text-right text-xs ${r.racePoints > 0 ? 'text-green-500' : 'text-foreground/20'}`}>
                    {r.racePoints > 0 ? `+${r.racePoints}` : '—'}
                  </div>
                  <div className="text-right text-xs font-medium text-foreground">{r.newTotal}</div>
                  <div className={`text-xs ${r.change > 0 ? 'text-green-500' : r.change < 0 ? 'text-red-400' : 'text-foreground/20'}`}>
                    {r.change > 0 ? `↑${r.change}` : r.change < 0 ? `↓${Math.abs(r.change)}` : ''}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 rounded text-xs font-medium uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => { handleRandomize(); setShowResults(true); }}
                className="px-4 py-2 rounded text-xs font-medium uppercase tracking-widest border border-foreground/20 text-foreground/60 hover:text-foreground transition-all"
              >
                Try Another
              </button>
              <button
                onClick={() => setShowResults(false)}
                className="px-4 py-2 rounded text-xs font-medium uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}

export { DRIVERS };
export type { Driver, Placements };
