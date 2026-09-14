import Link from 'next/link';

const stories = [
  {
    slug: 'us-open-2026',
    title: '2026 US Open',
    date: 'Sep 14, 2026',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24">
      <header className="mb-12">
        <h1 className="text-caption">Sports</h1>
      </header>
      <nav>
        {stories.map((story) => (
          <Link
            key={story.slug}
            href={`/${story.slug}`}
            className="group block"
          >
            <p className="text-caption mb-2 group-hover:text-foreground transition-colors duration-300">
              {story.date}
            </p>
            <h2 className="text-display text-muted group-hover:text-foreground transition-colors duration-300">
              {story.title}
            </h2>
          </Link>
        ))}
      </nav>
    </main>
  );
}
