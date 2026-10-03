'use client';

export function MercedesUpgrade() {
  return (
    <section className="snap-section reveal-section relative h-dvh border-t border-zinc-800 bg-black overflow-hidden">
      {/* Background video - zoomed on mobile for vertical crop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://www.youtube.com/embed/w_wmW0Mj3Ak?autoplay=1&mute=1&loop=1&playlist=w_wmW0Mj3Ak&controls=0&showinfo=0&rel=0&modestbranding=1&start=0"
          allow="autoplay; encrypted-media"
          className="absolute pointer-events-none w-[450%] h-[250%] md:w-[120%] md:h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ border: 'none' }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center px-4 py-6 md:px-12 lg:px-16 overflow-y-auto">
        <div className="mx-auto w-full max-w-5xl">

          {/* Header */}
          <div className="mb-8">
            <span className="text-xs uppercase tracking-[0.3em] text-red-500">
              Technical
            </span>
            <h2 className="text-xl md:text-2xl font-light text-foreground mt-1">
              Mercedes Upgrade
            </h2>
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

            {/* Left column: What Changed + Target */}
            <div className="space-y-6">
              {/* What Changed */}
              <div>
                <div className="text-xs uppercase tracking-widest text-foreground/30 mb-2">
                  What Changed
                </div>
                <div className="text-foreground/80 text-sm leading-relaxed space-y-2">
                  <p>
                    Mercedes brought seven declared aerodynamic changes to the W17 at Sepang, concentrated around the floor and rear of the car: the floor board, leading edge, floor corner, floor body, rear suspension fairings, rear corner and rear bodywork.
                    {' '}<a href="https://grandepremio.com/en/f1/mercedes-brings-seven-sepang-upgrades-as-seven-f1-teams-reveal-changes/" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 transition-colors">[source]</a>
                  </p>
                  <p>
                    Rather than seven separate ideas, they work as one aerodynamic package — controlling airflow through the floor and toward the rear of the car.
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-foreground/20">↓</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {/* Target Behavior */}
              <div>
                <div className="text-xs uppercase tracking-widest text-foreground/30 mb-2">
                  Target Behavior
                </div>
                <div className="text-foreground/80 text-sm leading-relaxed space-y-2">
                  <p className="text-base font-medium text-foreground">
                    More downforce. More often.
                  </p>
                  <p>
                    Mercedes is trying to generate additional aerodynamic load while making the W17 less sensitive across different cornering conditions. The revised floor is designed to keep airflow attached across a wider operating window and feed the diffuser more effectively.
                  </p>
                  <p>
                    According to Antonelli, Mercedes estimates the complete package could be worth roughly 0.3 seconds per lap.
                    {' '}<a href="https://www.grandprix.com/news/mercedes-says-sepang-upgrade-is-worth-three-tenths.html" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 transition-colors">[source]</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: Why Sepang + Championship */}
            <div className="space-y-6">
              {/* Why Sepang */}
              <div>
                <div className="text-xs uppercase tracking-widest text-foreground/30 mb-2">
                  Why Sepang
                </div>
                <div className="text-foreground/80 text-sm leading-relaxed space-y-2">
                  <p>
                    Sepang immediately stress-tests that idea.
                  </p>
                  <p>
                    Fast corners demand aerodynamic load, while the warm conditions and aggressive tarmac create high tyre degradation and overheating.
                  </p>
                  <p>
                    Friday exposed exactly that problem: Russell said he could feel the additional downforce, but the tyre overheating was effectively masking its benefit. Mercedes said it had not yet seen the step in lap time it expected from the new package.
                    {' '}<a href="https://www.formula1.com/en/latest/article/mercedes-suffer-one-of-the-toughest-fridays-of-the-season-but-russell-hopeful-of-fighting-for-pole.49cB5B7TCBoAI4ar4zOJlZ" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-foreground/60 transition-colors text-xs">F1.com ↗</a>
                  </p>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-zinc-800" />
                <span className="text-foreground/20">↓</span>
                <div className="h-px flex-1 bg-zinc-800" />
              </div>

              {/* Championship Consequence */}
              <div>
                <div className="text-xs uppercase tracking-widest text-foreground/30 mb-2">
                  Championship Consequence
                </div>
                <div className="text-foreground/80 text-sm leading-relaxed space-y-2">
                  <p>
                    Antonelli leads Russell by 66 points, but both now have the same upgraded W17 underneath them.
                    {' '}<a href="https://www.formula1.com/en/latest/article/why-theres-still-hope-for-russell-as-he-tries-to-chase-down-team-mate-antonelli-in-the-title-race.61kGTLGO0gcOuFRzwdu3XZ" target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-foreground/60 transition-colors text-xs">F1.com ↗</a>
                  </p>
                  <p>
                    If Mercedes can unlock the package, the question becomes less about which driver has the better car and more about which driver extracts more from it over the remaining rounds.
                  </p>
                  <p className="text-foreground/60 italic">
                    Does a faster Mercedes protect Antonelli's lead — or give Russell a better weapon to attack it?
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
