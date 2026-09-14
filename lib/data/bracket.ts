import { getMainDrawMatches, getPlayerPath, ZVEREV_ID, SHELTON_ID, getSemifinalists, getQuarterfinalists } from './provider';
import { Match, Round, ROUND_ORDER } from './types';

export interface BracketMatch {
  match: Match;
  position: number;
  isHighlighted: boolean;
}

export interface BracketRound {
  round: Round;
  name: string;
  matches: BracketMatch[];
}

// Build bracket structure for visualization
export function getBracketData(highlightPlayerId?: string): BracketRound[] {
  const allMatches = getMainDrawMatches();
  const highlightedMatchIds = new Set<string>();

  if (highlightPlayerId) {
    const path = getPlayerPath(highlightPlayerId);
    path.forEach(m => highlightedMatchIds.add(m.id));
    // Also highlight matches they lost
    const lostMatch = allMatches.find(
      m => (m.player1.id === highlightPlayerId || m.player2.id === highlightPlayerId) &&
           m.winner.id !== highlightPlayerId
    );
    if (lostMatch) highlightedMatchIds.add(lostMatch.id);
  }

  const roundNames: Record<Round, string> = {
    R1: 'Round 1',
    R2: 'Round 2',
    R3: 'Round 3',
    R4: 'Round of 16',
    QF: 'Quarterfinals',
    SF: 'Semifinals',
    F: 'Final',
  };

  return ROUND_ORDER.map((round, roundIndex) => {
    const roundMatches = allMatches
      .filter(m => m.round === round)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      round,
      name: roundNames[round],
      matches: roundMatches.map((match, i) => ({
        match,
        position: i,
        isHighlighted: highlightedMatchIds.has(match.id),
      })),
    };
  });
}

// Get matches for a specific section of the bracket (top half vs bottom half)
export function getBracketSection(
  round: Round,
  section: 'top' | 'bottom',
  highlightPlayerId?: string
): BracketMatch[] {
  const bracket = getBracketData(highlightPlayerId);
  const roundData = bracket.find(r => r.round === round);
  if (!roundData) return [];

  const matches = roundData.matches;
  const half = Math.ceil(matches.length / 2);

  return section === 'top' ? matches.slice(0, half) : matches.slice(half);
}

// Get summary stats for bracket visualization
export function getBracketStats() {
  const matches = getMainDrawMatches();

  return {
    totalMatches: matches.length,
    totalPlayers: 128,
    fiveSetMatches: matches.filter(m => m.isFiveSet).length,
    completedMatches: matches.filter(m => m.isCompleted).length,
  };
}

// Player highlight options (computed at runtime)
export function getHighlightOptions(): Array<{ id: string; name: string; label: string }> {
  const options = [
    { id: ZVEREV_ID, name: 'Alexander Zverev', label: 'Champion' },
    { id: SHELTON_ID, name: 'Ben Shelton', label: 'Finalist' },
  ];

  // Add semifinalists
  const semis = getSemifinalists();
  for (const player of semis) {
    options.push({ id: player.id, name: player.name, label: 'SF' });
  }

  // Add top quarterfinalists (by seed)
  const qfs = getQuarterfinalists().sort((a, b) => (a.seed || 99) - (b.seed || 99));
  if (qfs.length > 0) {
    options.push({ id: qfs[0].id, name: qfs[0].name, label: 'QF' });
  }

  return options;
}

// Legacy export for backwards compatibility
export const HIGHLIGHT_OPTIONS = [
  { id: ZVEREV_ID, name: 'Alexander Zverev', label: 'Champion' },
  { id: SHELTON_ID, name: 'Ben Shelton', label: 'Finalist' },
];

// Get a player's complete journey through the tournament (ordered by round)
export function getPlayerJourneyMatches(playerId: string): Match[] {
  const allMatches = getMainDrawMatches();

  // Get all matches this player participated in
  const playerMatches = allMatches.filter(
    m => m.player1.id === playerId || m.player2.id === playerId
  );

  // Sort by round order
  return playerMatches.sort((a, b) => {
    return ROUND_ORDER.indexOf(a.round) - ROUND_ORDER.indexOf(b.round);
  });
}
