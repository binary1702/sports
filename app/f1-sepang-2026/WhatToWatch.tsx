'use client';

const WATCH_ITEMS = [
  {
    number: '01',
    headline: 'Antonelli vs Russell',
    body: 'The 66-point gap shrank by 15 points at Baku. Russell is the only driver who can realistically catch Antonelli, and he needs to start now. Same car, same upgrades, same conditions. Sepang removes excuses.',
  },
  {
    number: '02',
    headline: 'Does the upgrade work?',
    body: 'Seven changes to the W17. Mercedes has momentum but Sepang is a different test. The upgrade either confirms their trajectory or exposes a gap between simulation and reality.',
  },
  {
    number: '03',
    headline: 'Tyres and weather',
    body: 'Pirelli brought the aggressive C2-C4 compounds. Sepang heat destroys tyres. Afternoon rain is always possible. Strategy will matter more here than at most circuits.',
  },
];

export function WhatToWatch() {
  return (
    <section className="snap-section reveal-section relative min-h-dvh border-t border-zinc-800 bg-black overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://www.youtube.com/embed/EovCWKPtkC0?autoplay=1&mute=1&loop=1&playlist=EovCWKPtkC0&controls=0&showinfo=0&rel=0&modestbranding=1&start=0"
          allow="autoplay; encrypted-media"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ border: 'none' }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-6 py-10 md:px-12 md:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto w-full max-w-3xl">

          {/* Header */}
          <div className="mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-red-500">
              Closing
            </span>
            <h2 className="text-2xl md:text-3xl font-light text-foreground mt-2">
              What to Watch
            </h2>
          </div>

          {/* Watch Items */}
          <div className="space-y-10">
            {WATCH_ITEMS.map((item) => (
              <div key={item.number} className="flex gap-6">
                {/* Number */}
                <div className="text-3xl md:text-4xl font-light text-red-500/40">
                  {item.number}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {item.headline}
                  </h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing line */}
          <div className="mt-16 pt-8 border-t border-zinc-800 text-center">
            <p className="text-sm text-foreground/40 italic">
              Can Sepang change the shape of the 2026 championship?
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
