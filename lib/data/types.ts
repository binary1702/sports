// ESPN API response types (raw)
export interface ESPNCompetitor {
  id: string;
  order: number;
  winner: boolean;
  curatedRank?: { current: number };
  linescores: Array<{
    value: number;
    tiebreak?: number;
    winner: boolean;
  }>;
  athlete: {
    guid: string;
    displayName: string;
    shortName: string;
    fullName: string;
    flag?: {
      href: string;
      alt: string;
    };
    links?: Array<{
      rel?: string[];
      href: string;
    }>;
  };
}

export interface ESPNMatch {
  id: string;
  date: string;
  status: {
    period: number;
    type: {
      name: string;
      state: string;
      completed: boolean;
    };
  };
  venue: {
    fullName: string;
    court: string;
  };
  competitors: ESPNCompetitor[];
  round: {
    id: string;
    displayName: string;
  };
  notes?: Array<{ text: string }>;
}

export interface ESPNData {
  tournament: {
    id: string;
    name: string;
    year: number;
    surface: string;
    location: string;
    startDate: string;
    endDate: string;
  };
  fetchedAt: string;
  matchCount: number;
  matches: ESPNMatch[];
}

// Normalized types for our application
export type Round = 'R1' | 'R2' | 'R3' | 'R4' | 'QF' | 'SF' | 'F';

export const ROUND_MAP: Record<string, Round> = {
  'Round 1': 'R1',
  'Round 2': 'R2',
  'Round 3': 'R3',
  'Round 4': 'R4',
  'Quarterfinal': 'QF',
  'Semifinal': 'SF',
  'Final': 'F',
};

export const ROUND_NAMES: Record<Round, string> = {
  R1: 'First Round',
  R2: 'Second Round',
  R3: 'Third Round',
  R4: 'Round of 16',
  QF: 'Quarterfinal',
  SF: 'Semifinal',
  F: 'Final',
};

export const ROUND_ORDER: Round[] = ['R1', 'R2', 'R3', 'R4', 'QF', 'SF', 'F'];

export interface Player {
  id: string;
  name: string;
  shortName: string;
  seed?: number;
  country: string;
  countryCode: string;
  flagUrl?: string;
  espnUrl?: string;
}

export interface SetScore {
  player1Games: number;
  player2Games: number;
  player1Tiebreak?: number;
  player2Tiebreak?: number;
  winner: 1 | 2;
}

export interface Match {
  id: string;
  round: Round;
  date: string;
  court: string;
  player1: Player;
  player2: Player;
  winner: Player;
  loser: Player;
  sets: SetScore[];
  score: string;
  isFiveSet: boolean;
  isCompleted: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  year: number;
  surface: string;
  location: string;
  startDate: string;
  endDate: string;
  champion: Player;
  finalist: Player;
}

export interface PlayerPath {
  player: Player;
  matches: Match[];
  stats: {
    matchesPlayed: number;
    matchesWon: number;
    setsWon: number;
    setsLost: number;
    gamesWon: number;
    gamesLost: number;
    fiveSetMatches: number;
    tiebreaksPlayed: number;
    tiebreaksWon: number;
    seededOpponentsDefeated: number;
  };
}
