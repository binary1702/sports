import espnData from './espn-us-open-2026.json';
import {
  ESPNData,
  ESPNMatch,
  ESPNCompetitor,
  Match,
  Player,
  SetScore,
  Tournament,
  Round,
  ROUND_MAP,
  ROUND_ORDER,
} from './types';

const data = espnData as ESPNData;

// Extract country code from flag URL (e.g., "usa" from ".../500/usa.png")
function extractCountryCode(flagUrl?: string): string {
  if (!flagUrl) return 'UNK';
  const match = flagUrl.match(/\/(\w+)\.png$/);
  return match ? match[1].toUpperCase() : 'UNK';
}

// Parse seed from match note (e.g., "(1) Alexander Zverev")
function extractSeed(note?: string, playerName?: string): number | undefined {
  if (!note || !playerName) return undefined;
  const regex = new RegExp(`\\((\\d+)\\)\\s*${playerName.split(' ')[0]}`);
  const match = note.match(regex);
  return match ? parseInt(match[1], 10) : undefined;
}

// Convert ESPN competitor to our Player type
function toPlayer(competitor: ESPNCompetitor, matchNote?: string): Player {
  const { athlete } = competitor;
  const seed = competitor.curatedRank?.current || extractSeed(matchNote, athlete.displayName);
  const espnLink = athlete.links?.find(l => l.rel?.includes('playercard'));

  return {
    id: competitor.id,
    name: athlete.displayName,
    shortName: athlete.shortName,
    seed,
    country: athlete.flag?.alt || 'Unknown',
    countryCode: extractCountryCode(athlete.flag?.href),
    flagUrl: athlete.flag?.href,
    espnUrl: espnLink?.href,
  };
}

// Convert ESPN linescores to our SetScore type
function toSetScores(c1: ESPNCompetitor, c2: ESPNCompetitor): SetScore[] {
  const sets: SetScore[] = [];
  const maxSets = Math.max(c1.linescores.length, c2.linescores.length);

  for (let i = 0; i < maxSets; i++) {
    const s1 = c1.linescores[i] || { value: 0, winner: false };
    const s2 = c2.linescores[i] || { value: 0, winner: false };

    sets.push({
      player1Games: s1.value,
      player2Games: s2.value,
      player1Tiebreak: s1.tiebreak,
      player2Tiebreak: s2.tiebreak,
      winner: s1.winner ? 1 : 2,
    });
  }

  return sets;
}

// Format score string from sets
function formatScore(sets: SetScore[]): string {
  return sets.map(s => {
    const base = `${s.player1Games}-${s.player2Games}`;
    if (s.player1Tiebreak !== undefined || s.player2Tiebreak !== undefined) {
      const tb1 = s.player1Tiebreak ?? 0;
      const tb2 = s.player2Tiebreak ?? 0;
      const loserTb = s.winner === 1 ? tb2 : tb1;
      return `${base}(${loserTb})`;
    }
    return base;
  }).join(' ');
}

// Convert ESPN match to our Match type
function toMatch(espnMatch: ESPNMatch): Match | null {
  const round = ROUND_MAP[espnMatch.round.displayName];
  if (!round) return null; // Skip qualifying rounds

  // ESPN uses order: 1 = top/home, 2 = bottom/away
  const c1 = espnMatch.competitors.find(c => c.order === 1)!;
  const c2 = espnMatch.competitors.find(c => c.order === 2)!;

  const matchNote = espnMatch.notes?.[0]?.text;
  const player1 = toPlayer(c1, matchNote);
  const player2 = toPlayer(c2, matchNote);
  const sets = toSetScores(c1, c2);

  const winner = c1.winner ? player1 : player2;
  const loser = c1.winner ? player2 : player1;

  return {
    id: espnMatch.id,
    round,
    date: espnMatch.date,
    court: espnMatch.venue.court,
    player1,
    player2,
    winner,
    loser,
    sets,
    score: formatScore(sets),
    isFiveSet: sets.length === 5,
    isCompleted: espnMatch.status.type.completed,
  };
}

// Cached transformed data
let cachedMatches: Match[] | null = null;
let cachedPlayers: Map<string, Player> | null = null;

export function getMainDrawMatches(): Match[] {
  if (cachedMatches) return cachedMatches;

  cachedMatches = data.matches
    .map(toMatch)
    .filter((m): m is Match => m !== null)
    .sort((a, b) => {
      const roundDiff = ROUND_ORDER.indexOf(a.round) - ROUND_ORDER.indexOf(b.round);
      if (roundDiff !== 0) return roundDiff;
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return cachedMatches;
}

export function getAllPlayers(): Map<string, Player> {
  if (cachedPlayers) return cachedPlayers;

  cachedPlayers = new Map();
  for (const match of getMainDrawMatches()) {
    cachedPlayers.set(match.player1.id, match.player1);
    cachedPlayers.set(match.player2.id, match.player2);
  }

  return cachedPlayers;
}

export function getPlayer(id: string): Player | undefined {
  return getAllPlayers().get(id);
}

export function getPlayerByName(name: string): Player | undefined {
  const players = getAllPlayers();
  for (const player of players.values()) {
    if (player.name.toLowerCase().includes(name.toLowerCase())) {
      return player;
    }
  }
  return undefined;
}

export function getMatchesByRound(round: Round): Match[] {
  return getMainDrawMatches().filter(m => m.round === round);
}

export function getPlayerPath(playerId: string): Match[] {
  return getMainDrawMatches()
    .filter(m => m.player1.id === playerId || m.player2.id === playerId)
    .filter(m => m.winner.id === playerId); // Only matches they won (their path)
}

export function getPlayerPathByName(name: string): Match[] {
  const player = getPlayerByName(name);
  if (!player) return [];
  return getPlayerPath(player.id);
}

export function getTournament(): Tournament {
  const matches = getMainDrawMatches();
  const final = matches.find(m => m.round === 'F')!;

  return {
    id: data.tournament.id,
    name: data.tournament.name,
    year: data.tournament.year,
    surface: data.tournament.surface,
    location: data.tournament.location,
    startDate: data.tournament.startDate,
    endDate: data.tournament.endDate,
    champion: final.winner,
    finalist: final.loser,
  };
}

export function getFinal(): Match {
  return getMainDrawMatches().find(m => m.round === 'F')!;
}

export function getFiveSetMatches(): Match[] {
  return getMainDrawMatches().filter(m => m.isFiveSet);
}

export function getUpsets(): Match[] {
  return getMainDrawMatches().filter(m => {
    const winnerSeed = m.winner.seed;
    const loserSeed = m.loser.seed;
    // Upset: unseeded beats seeded, or lower seed beats higher seed
    if (!loserSeed) return false;
    if (!winnerSeed) return true;
    return winnerSeed > loserSeed;
  });
}

export function getMatchById(id: string): Match | undefined {
  return getMainDrawMatches().find(m => m.id === id);
}

// Stats computation
export function computePlayerStats(playerId: string) {
  const matches = getMainDrawMatches().filter(
    m => m.player1.id === playerId || m.player2.id === playerId
  );

  let setsWon = 0, setsLost = 0;
  let gamesWon = 0, gamesLost = 0;
  let tiebreaksPlayed = 0, tiebreaksWon = 0;
  let seededOpponentsDefeated = 0;

  for (const match of matches) {
    const isPlayer1 = match.player1.id === playerId;
    const isWinner = match.winner.id === playerId;

    for (const set of match.sets) {
      const myGames = isPlayer1 ? set.player1Games : set.player2Games;
      const theirGames = isPlayer1 ? set.player2Games : set.player1Games;
      const wonSet = (set.winner === 1) === isPlayer1;

      gamesWon += myGames;
      gamesLost += theirGames;

      if (wonSet) setsWon++;
      else setsLost++;

      // Tiebreak
      if (set.player1Tiebreak !== undefined || set.player2Tiebreak !== undefined) {
        tiebreaksPlayed++;
        if (wonSet) tiebreaksWon++;
      }
    }

    if (isWinner) {
      const opponent = isPlayer1 ? match.player2 : match.player1;
      if (opponent.seed) seededOpponentsDefeated++;
    }
  }

  const matchesWon = matches.filter(m => m.winner.id === playerId).length;

  return {
    matchesPlayed: matches.length,
    matchesWon,
    setsWon,
    setsLost,
    gamesWon,
    gamesLost,
    fiveSetMatches: matches.filter(m => m.isFiveSet).length,
    tiebreaksPlayed,
    tiebreaksWon,
    seededOpponentsDefeated,
  };
}

// Key player IDs (from ESPN data)
export const ZVEREV_ID = '2375';
export const SHELTON_ID = '9250';

// Get semifinalists (lost in SF)
export function getSemifinalists(): Player[] {
  const sfMatches = getMatchesByRound('SF');
  return sfMatches.map(m => m.loser);
}

// Get quarterfinalists (lost in QF)
export function getQuarterfinalists(): Player[] {
  const qfMatches = getMatchesByRound('QF');
  return qfMatches.map(m => m.loser);
}

// Search players by name
export function searchPlayers(query: string): Player[] {
  if (!query || query.length < 2) return [];
  const players = getAllPlayers();
  const results: Player[] = [];
  const lowerQuery = query.toLowerCase();

  for (const player of players.values()) {
    if (player.name.toLowerCase().includes(lowerQuery) ||
        player.shortName.toLowerCase().includes(lowerQuery)) {
      results.push(player);
    }
  }

  // Sort by seed (seeded players first), then alphabetically
  return results.sort((a, b) => {
    if (a.seed && !b.seed) return -1;
    if (!a.seed && b.seed) return 1;
    if (a.seed && b.seed) return a.seed - b.seed;
    return a.name.localeCompare(b.name);
  }).slice(0, 10); // Limit to 10 results
}
