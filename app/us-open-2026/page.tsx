import {
  Hero,
  Editorial01,
  FinalsShowdown,
  Editorial02,
  RoadToTitle,
  Attribution,
  RevealObserver
} from '@/components';

export default function USOpen2026() {
  return (
    <main className="snap-container">
      <RevealObserver />
      <Hero />
      <Editorial01 />
      <FinalsShowdown />
      <RoadToTitle />
      <Editorial02 />
      <Attribution />
    </main>
  );
}
