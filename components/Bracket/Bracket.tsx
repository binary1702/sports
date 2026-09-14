'use client';

import { useState, useRef, useMemo } from 'react';
import { gsap, useGSAP, reveal } from '@/lib/gsap';
import { getBracketData, getPlayerJourneyMatches } from '@/lib/data/bracket';
import { BracketMatch } from './BracketMatch';
import { Match, Round, Player } from '@/lib/data/types';
import { ZVEREV_ID, searchPlayers } from '@/lib/data/provider';

// Country flags for journey cards
const FLAGS: Record<string, string> = {
  Italy: '🇮🇹', France: '🇫🇷', Chile: '🇨🇱', Netherlands: '🇳🇱', Russia: '🇷🇺',
  USA: '🇺🇸', Germany: '🇩🇪', Spain: '🇪🇸', Australia: '🇦🇺', UK: '🇬🇧',
  Argentina: '🇦🇷', Serbia: '🇷🇸', Canada: '🇨🇦', Greece: '🇬🇷', Poland: '🇵🇱',
  Norway: '🇳🇴', Denmark: '🇩🇰', Switzerland: '🇨🇭', Belgium: '🇧🇪', Japan: '🇯🇵',
  China: '🇨🇳', 'Czech Republic': '🇨🇿', Croatia: '🇭🇷', Bulgaria: '🇧🇬', Hungary: '🇭🇺',
};

const SHORT_ROUNDS: Record<Round, string> = {
  R1: 'R1', R2: 'R2', R3: 'R3', R4: 'R4', QF: 'QF', SF: 'SF', F: 'Final',
};

function JourneyCard({ match, playerId }: { match: Match; playerId: string }) {
  const isPlayer1 = match.player1.id === playerId;
  const opponent = isPlayer1 ? match.player2 : match.player1;
  const didWin = match.winner.id === playerId;
  const flag = FLAGS[opponent.country] || '🏳️';

  // Calculate set scores from player's perspective
  const sets = match.sets.map(set => {
    const playerGames = isPlayer1 ? set.player1Games : set.player2Games;
    const oppGames = isPlayer1 ? set.player2Games : set.player1Games;
    const playerWonSet = (isPlayer1 && set.winner === 1) || (!isPlayer1 && set.winner === 2);

    let score = `${playerGames}-${oppGames}`;
    if (set.player1Tiebreak !== undefined || set.player2Tiebreak !== undefined) {
      const loserTb = set.winner === 1 ? set.player2Tiebreak : set.player1Tiebreak;
      score = `${playerGames}-${oppGames}(${loserTb})`;
    }

    return { score, won: playerWonSet };
  });

  return (
    <div
      className={`
        flex-1 min-w-0 p-4 rounded-xl border-2 transition-all text-center
        ${didWin
          ? 'border-emerald-600 bg-emerald-900/20'
          : 'border-red-500 bg-red-500/10'
        }
      `}
    >
      {/* Round label - THE STATEMENT */}
      <div className={`text-2xl font-black uppercase tracking-tight mb-3 ${didWin ? 'text-emerald-400' : 'text-red-400'}`}>
        {SHORT_ROUNDS[match.round]}
      </div>

      {/* Opponent */}
      <div className="mb-2">
        <a
          href={opponent.espnUrl || `https://www.espn.com/tennis/player/_/id/${opponent.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:text-emerald-400 transition-colors text-base"
        >
          {opponent.shortName}
        </a>
        {opponent.seed && (
          <span className="text-muted text-sm ml-1">({opponent.seed})</span>
        )}
      </div>

      {/* Country */}
      <div className="text-sm text-muted mb-3">
        {flag} {opponent.country}
      </div>

      {/* Set scores */}
      <div className="flex gap-2 flex-wrap justify-center">
        {sets.map((set, i) => (
          <span
            key={i}
            className={`font-mono text-sm font-medium ${set.won ? 'text-emerald-400' : 'text-red-400'}`}
          >
            {set.score}
          </span>
        ))}
      </div>

      {/* Win/Loss indicator */}
      {!didWin && (
        <div className="mt-2 text-xs font-bold text-red-400 uppercase tracking-wider">
          Loss
        </div>
      )}
    </div>
  );
}

function PlayerJourney({ playerId, playerName }: { playerId: string; playerName: string }) {
  const matches = getPlayerJourneyMatches(playerId);
  const isChampion = matches.length > 0 && matches[matches.length - 1].winner.id === playerId;

  return (
    <div className="mb-12">
      <h3 className="text-lg font-medium mb-4 text-center">
        {playerName}&apos;s {isChampion ? 'Path to the Title' : 'Tournament Run'}
      </h3>

      {/* 7-column grid for all matches */}
      <div className="grid grid-cols-7 gap-2">
        {matches.map((match) => (
          <JourneyCard key={match.id} match={match} playerId={playerId} />
        ))}
      </div>
    </div>
  );
}

function FullDrawAccordion({ highlightPlayerId }: { highlightPlayerId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const bracketData = getBracketData(highlightPlayerId);

  return (
    <div className="border border-zinc-800 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors rounded-lg"
      >
        <span className="text-sm font-medium">
          Full Draw ({bracketData.reduce((acc, r) => acc + r.matches.length, 0)} matches)
        </span>
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Column headers */}
            <div className="grid grid-cols-7 gap-3 mb-4">
              {bracketData.map(round => (
                <div key={round.round} className="text-center">
                  <div className="text-caption">{round.name}</div>
                  <div className="text-xs text-muted/60">{round.matches.length}</div>
                </div>
              ))}
            </div>

            {/* Matches grid */}
            <div className="grid grid-cols-7 gap-3 items-start max-h-[500px] overflow-y-auto">
              {bracketData.map((round) => (
                <div key={round.round} className="space-y-2">
                  {round.matches.map(({ match, isHighlighted }) => (
                    <BracketMatch
                      key={match.id}
                      match={match}
                      isHighlighted={isHighlighted}
                      isCompact={true}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerSearch({ onSelect, currentPlayer }: { onSelect: (player: Player) => void; currentPlayer: string }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchPlayers(query), [query]);

  const handleSelect = (player: Player) => {
    onSelect(player);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      {/* Search bar */}
      <div className="relative w-full max-w-md">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder="Search any player..."
          className="w-full px-6 py-3 rounded-full text-base bg-zinc-800 border border-zinc-700 text-foreground placeholder:text-muted focus:outline-none focus:border-accent"
        />

        {/* Search results dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
            {results.map(player => (
              <button
                key={player.id}
                onMouseDown={() => handleSelect(player)}
                className="w-full px-6 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>{player.name}</span>
                {player.seed && (
                  <span className="text-sm text-muted">({player.seed})</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Current player status */}
      <div className="text-sm text-muted">
        Now showing: <span className="text-accent font-medium">{currentPlayer}&apos;s Journey</span>
      </div>
    </div>
  );
}

export function Bracket() {
  const containerRef = useRef<HTMLElement>(null);
  const [highlightPlayer, setHighlightPlayer] = useState<string>(ZVEREV_ID);
  const [playerName, setPlayerName] = useState<string>('Alexander Zverev');

  const handleSearchSelect = (player: Player) => {
    setHighlightPlayer(player.id);
    setPlayerName(player.name);
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        reveal('.br-header');
        reveal('.br-selector');
        reveal('.br-journey');
        reveal('.br-accordion');
      });
      return () => mm.revert();
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-28 px-4 md:px-8 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="br-header mb-12 text-center">
          <span className="text-caption block mb-4">02 &middot; The Draw</span>
          <h2 className="text-headline mb-6">Tournament Bracket</h2>
          <p className="text-body max-w-2xl mx-auto">
            128 players entered. One remained. Follow each player&apos;s journey through the tournament.
          </p>
        </div>

        {/* Search bar */}
        <div className="br-selector">
          <PlayerSearch onSelect={handleSearchSelect} currentPlayer={playerName} />
        </div>

        {/* Player journey (Focus Mode) */}
        {highlightPlayer && (
          <div className="br-journey">
            <PlayerJourney playerId={highlightPlayer} playerName={playerName} />
          </div>
        )}

        {/* Full draw accordion */}
        <div className="br-accordion">
          <FullDrawAccordion highlightPlayerId={highlightPlayer} />
        </div>
      </div>
    </section>
  );
}
