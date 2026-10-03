import {
  Hero,
  Editorial01,
  FinalsShowdown,
  Editorial02,
  RoadToTitle,
  Attribution,
  RevealObserver
} from '@/components';

export const metadata = {
  title: 'US Open 2026',
};

const heroConfig = {
  video: { id: '5xvs0FC_A-M', start: 828, end: 930 },
  badge: { type: 'emoji' as const, emoji: '🇩🇪' },
  title: { line1: 'ALEXANDER', line2: 'ZVEREV' },
  subtitle: '2026 US OPEN CHAMPION',
  logos: [
    { src: '/logos/us-open.webp', alt: 'US Open', href: 'https://www.usopen.org' },
    { src: '/logos/espn.webp', alt: 'ESPN', href: 'https://www.espn.com', bgColor: 'bg-red-600', padding: 'p-1.5' },
    { src: '/logos/b1702.webp', alt: 'Binary 1702', href: 'https://binary1702.com' },
  ],
};

export default function USOpen2026() {
  return (
    <main className="snap-container">
      <RevealObserver />
      <Hero {...heroConfig} />
      <Editorial01 />
      <FinalsShowdown />
      <RoadToTitle />
      <Editorial02 />
      <Attribution />
    </main>
  );
}
