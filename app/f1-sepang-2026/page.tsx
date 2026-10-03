import {
  Hero,
  Opening,
  RevealObserver,
  Attribution
} from '@/components';
import { ChampionshipSection } from './ChampionshipSection';
import { Malaysia2017Section } from './Malaysia2017Section';
import { MercedesUpgrade } from './MercedesUpgrade';
import { WhatToWatch } from './WhatToWatch';

export const metadata = {
  title: 'F1 Sepang GP 2026',
};

const SourceLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-400 hover:text-blue-300 transition-colors"
  >
    {children}
  </a>
);

const openingConfig = {
  headline: 'Sepang: Nine years later',
  body: [
    "Formula 1 knows Sepang. It just doesn't know this Sepang.",
    <span key="2017">The championship last raced here in <SourceLink href="https://www.formula1.com/en/results/2017/races/973/malaysia/race-result">October 2017</SourceLink>. Max Verstappen had turned 20 the day before the race; on Sunday, he passed Lewis Hamilton for the lead and won. Sebastian Vettel started last and finished fourth. The fastest race lap was a 1:34.080.</span>,
    "Nine years later, those numbers tell us surprisingly little about what will happen this weekend.",
    "The cars now generate their performance differently. The tyres are different. The regulations are different. Much of today's grid has never raced a Formula 1 car at Sepang. Even the teams that know the circuit are returning without the recent race data they normally accumulate year after year.",
    <span key="circuit">And Sepang is not an easy circuit to model in isolation. Its 5.543 kilometres combine long straights with sustained, loaded corners. The asphalt is abrasive. Heat changes the tyres. Tropical rain can change the track before strategy has time to catch up. <SourceLink href="https://www.formula1.com/en/latest/article/circuit-guide-everything-you-need-to-know-about-the-sepang-international-circuit.2KTLvyxBXmwVftSJxmYeZ2">Circuit guide ↗</SourceLink></span>,
    "That creates an unusual weekend.",
    <span key="setup">Mercedes arrives with seven newly declared changes to its car. <SourceLink href="https://grandepremio.com/en/f1/mercedes-brings-seven-sepang-upgrades-as-seven-f1-teams-reveal-changes/">[source]</SourceLink> Antonelli arrives with a 66-point championship lead — down from 81 before Baku. <SourceLink href="https://www.formula1.com/en/latest/article/why-theres-still-hope-for-russell-as-he-tries-to-chase-down-team-mate-antonelli-in-the-title-race.61kGTLGO0gcOuFRzwdu3XZ">F1.com ↗</SourceLink> Pirelli has brought the C2, C3 and C4 compounds. And three drivers already carry grid penalties into the weekend. <SourceLink href="https://www.formula1.com/en/latest/article/colapinto-hit-with-five-place-grid-penalty-for-bahrain-gp-in-malaysia-after-baku-collision.3gWVfzDMMr5hReiwTt1fPD">F1.com ↗</SourceLink></span>,
    "Each fact means something on its own.",
  ],
  closing: {
    line1: 'Sepang is where they begin interacting.',
    line2: '',
  },
  accentColor: 'text-red-500',
  video: { id: '3ES6IGr0NoE', start: 0 },
};

const heroConfig = {
  video: { id: '1lKgfAgwVL0', start: 0 },
  badge: { type: 'emoji' as const, emoji: '🇲🇾' },
  title: { line1: 'SEPANG', line2: 'GRAND PRIX' },
  subtitle: 'F1 MALAYSIA 2026',
  logos: [
    { src: '/logos/f1.svg', alt: 'F1', href: 'https://www.formula1.com', wide: true },
    { src: '/logos/b1702.webp', alt: 'Binary 1702', href: 'https://binary1702.com' },
  ],
  animation: {
    corners: { delay: 0, duration: 0.4, ease: 'power4.out', from: { opacity: 0, scale: 0.3 }, stagger: 0.05 },
    bgLines: { delay: 0.2, duration: 0.6, ease: 'power4.inOut', from: { scaleX: 0 } },
    accentLine: { delay: 0.4, duration: 0.5, ease: 'power4.inOut', from: { scaleX: 0, opacity: 0 } },
    badge: { delay: 0.6, duration: 0.4, ease: 'back.out(1.7)', from: { opacity: 0, scale: 0.5 } },
    title: { delay: 0.8, duration: 0.6, ease: 'power4.out', from: { opacity: 0, x: -100 } },
    subtitle: { delay: 1.2, duration: 0.5, ease: 'power3.out', from: { opacity: 0, y: 20 } },
    logos: { delay: 1.5, duration: 0.4, ease: 'power3.out', from: { opacity: 0, y: 30 } },
    credit: { delay: 1.7, duration: 0.3, ease: 'power2.out', from: { opacity: 0 } },
  },
};

export default function SepangGP2026() {
  return (
    <main className="snap-container">
      <RevealObserver />
      <Hero {...heroConfig} />
      <Opening {...openingConfig} />
      <Malaysia2017Section />
      <ChampionshipSection />
      <MercedesUpgrade />
      <WhatToWatch />
      <Attribution />
    </main>
  );
}
