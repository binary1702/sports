// Script to fetch all US Open 2026 matches from ESPN API
// Run with: npx tsx scripts/fetch-espn-data.ts

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/tennis/atp/scoreboard';

// US Open 2026 dates: Aug 24 - Sep 13
const START_DATE = new Date('2026-08-24');
const END_DATE = new Date('2026-09-13');

interface ESPNMatch {
  id: string;
  date: string;
  status: {
    type: { name: string; state: string };
  };
  competitors: Array<{
    id: string;
    winner: boolean;
    linescores: Array<{
      value: number;
      tiebreak?: number;
      winner: boolean;
    }>;
    athlete: {
      displayName: string;
      fullName: string;
      flag?: { alt: string };
    };
  }>;
  round: { id: string; displayName: string };
  notes?: Array<{ text: string }>;
}

async function fetchDay(date: Date): Promise<any> {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const url = `${BASE_URL}?dates=${dateStr}`;
  console.log(`Fetching ${dateStr}...`);
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${dateStr}: ${res.status}`);
  return res.json();
}

async function main() {
  const allMatches: ESPNMatch[] = [];
  const seenMatchIds = new Set<string>();
  
  // Iterate through each day
  let current = new Date(START_DATE);
  while (current <= END_DATE) {
    try {
      const data = await fetchDay(current);
      
      // Find US Open event
      const usOpen = data.events?.find((e: any) => e.id === '189-2026');
      if (usOpen) {
        // Find Men's Singles grouping
        const mensSingles = usOpen.groupings?.find(
          (g: any) => g.grouping?.slug === 'mens-singles'
        );
        
        if (mensSingles?.competitions) {
          for (const match of mensSingles.competitions) {
            if (!seenMatchIds.has(match.id)) {
              seenMatchIds.add(match.id);
              allMatches.push(match);
            }
          }
        }
      }
    } catch (err) {
      console.error(`Error fetching ${current.toISOString().slice(0, 10)}:`, err);
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  console.log(`\nTotal unique matches: ${allMatches.length}`);
  
  // Sort by date
  allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group by round
  const byRound: Record<string, number> = {};
  for (const m of allMatches) {
    const round = m.round?.displayName || 'Unknown';
    byRound[round] = (byRound[round] || 0) + 1;
  }
  console.log('Matches by round:', byRound);
  
  // Write to file
  const output = {
    tournament: {
      id: '189-2026',
      name: 'US Open',
      year: 2026,
      surface: 'Hard',
      location: 'New York, USA',
      startDate: '2026-08-24',
      endDate: '2026-09-13'
    },
    fetchedAt: new Date().toISOString(),
    matchCount: allMatches.length,
    matches: allMatches
  };
  
  const fs = await import('fs');
  fs.writeFileSync(
    './lib/data/espn-us-open-2026.json',
    JSON.stringify(output, null, 2)
  );
  console.log('\nSaved to lib/data/espn-us-open-2026.json');
}

main().catch(console.error);
