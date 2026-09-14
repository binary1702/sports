'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { ZVEREV_ID, SHELTON_ID, computePlayerStats, searchPlayers, getPlayer, getTournament } from '@/lib/data/provider';
import { getPlayerJourneyMatches } from '@/lib/data/bracket';
import { Match, SetScore, Round, Player, ROUND_ORDER } from '@/lib/data/types';

interface FormattedSet {
  score: string;
  won: boolean;
}

function formatSetScore(set: SetScore, isPlayerPlayer1: boolean): FormattedSet {
  const playerGames = isPlayerPlayer1 ? set.player1Games : set.player2Games;
  const oppGames = isPlayerPlayer1 ? set.player2Games : set.player1Games;
  const playerWon = (isPlayerPlayer1 && set.winner === 1) || (!isPlayerPlayer1 && set.winner === 2);

  let score: string;
  if (set.player1Tiebreak !== undefined || set.player2Tiebreak !== undefined) {
    const loserTb = set.winner === 1 ? set.player2Tiebreak : set.player1Tiebreak;
    score = `${playerGames}-${oppGames}(${loserTb})`;
  } else {
    score = `${playerGames}-${oppGames}`;
  }

  return { score, won: playerWon };
}

// Country code to flag emoji
const FLAGS: Record<string, string> = {
  Italy: '🇮🇹',
  France: '🇫🇷',
  Chile: '🇨🇱',
  Netherlands: '🇳🇱',
  Russia: '🇷🇺',
  USA: '🇺🇸',
  Germany: '🇩🇪',
  Spain: '🇪🇸',
  Australia: '🇦🇺',
  UK: '🇬🇧',
  Argentina: '🇦🇷',
  Serbia: '🇷🇸',
  Canada: '🇨🇦',
  Greece: '🇬🇷',
  Poland: '🇵🇱',
  Norway: '🇳🇴',
  Denmark: '🇩🇰',
  Switzerland: '🇨🇭',
  Belgium: '🇧🇪',
  Japan: '🇯🇵',
  China: '🇨🇳',
  'Czech Republic': '🇨🇿',
  Croatia: '🇭🇷',
  Bulgaria: '🇧🇬',
  Hungary: '🇭🇺',
};

// Full round labels
const ROUND_LABELS: Record<Round, string> = {
  R1: '1st Round',
  R2: '2nd Round',
  R3: '3rd Round',
  R4: '4th Round',
  QF: 'Quarterfinal',
  SF: 'Semifinal',
  F: 'Final',
};

function getEspnMatchUrl(matchId: string): string {
  return `https://www.espn.com/tennis/match/_/matchId/${matchId}`;
}

function formatMatchDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Elimination info type
interface EliminationInfo {
  round: Round;
  roundName: string;
  lostTo: Player;
  record: string;
}

function MatchCard({
  match,
  playerId,
  onSelectPlayer,
  isElimination = false,
  eliminationInfo = null,
}: {
  match: Match;
  playerId: string;
  onSelectPlayer: (player: Player) => void;
  isElimination?: boolean | null;
  eliminationInfo?: EliminationInfo | null;
}) {
  const isPlayerPlayer1 = match.player1.id === playerId;
  const opponent = isPlayerPlayer1 ? match.player2 : match.player1;
  const didWin = match.winner.id === playerId;
  const sets = match.sets.map(s => formatSetScore(s, isPlayerPlayer1));
  const flag = FLAGS[opponent.country] || '🏳️';
  const isFinal = match.round === 'F';
  const espnUrl = getEspnMatchUrl(match.id);
  const matchDate = formatMatchDate(match.date);

  const SetScores = ({ large = false }: { large?: boolean }) => (
    <a
      href={espnUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex flex-wrap justify-center hover:opacity-80 transition-opacity ${large ? 'gap-x-4 md:gap-x-6 gap-y-1' : 'gap-x-2 md:gap-x-3'}`}
    >
      {sets.map((set, i) => (
        <span
          key={`score-${i}`}
          className={`font-mono ${large ? 'text-lg md:text-2xl' : 'text-sm md:text-xl'} ${set.won ? 'text-accent' : 'text-red-400'}`}
        >
          {set.score}
        </span>
      ))}
    </a>
  );

  // Final card
  if (isFinal) {
    return (
      <div className={`rtt-card p-3 md:p-8 rounded-lg border-2 text-center ${
        didWin ? 'border-accent/50 bg-accent/5' : 'border-red-500/50 bg-red-500/5'
      }`}>
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-2 md:mb-4">
          <span className={`text-[10px] md:text-sm font-bold uppercase tracking-widest ${didWin ? 'text-accent' : 'text-red-400'}`}>
            Final
          </span>
          <span className="text-[9px] md:text-xs text-muted/60">{matchDate}</span>
        </div>
        <h3 className="text-lg md:text-4xl font-light mb-1 md:mb-2">
          <button
            onClick={() => onSelectPlayer(opponent)}
            className="hover:text-accent transition-colors cursor-pointer"
          >
            {opponent.name}
          </button>
          {opponent.seed && (
            <span className="text-muted ml-1 md:ml-2 text-sm md:text-xl">· S{opponent.seed}</span>
          )}
        </h3>
        <div className="text-muted/70 text-[10px] md:text-sm mb-2 md:mb-4">
          {flag} {opponent.country}
        </div>
        <SetScores large />
        {didWin && (
          <div className="mt-2 md:mt-4 text-[10px] md:text-sm uppercase tracking-widest text-accent">
            Champion
          </div>
        )}
      </div>
    );
  }

  // Elimination card (lost, not in final)
  if (isElimination && eliminationInfo) {
    return (
      <div className="rtt-card p-6 rounded-lg border-2 border-red-500/50 bg-red-500/5 text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <span className="text-sm font-bold uppercase tracking-widest text-red-400">
            {ROUND_LABELS[match.round]} · Eliminated
          </span>
        </div>
        <h3 className="text-2xl font-light mb-2">
          <button
            onClick={() => onSelectPlayer(opponent)}
            className="hover:text-accent transition-colors cursor-pointer"
          >
            {opponent.name}
          </button>
          {opponent.seed && (
            <span className="text-muted ml-2 text-lg">· Seed {opponent.seed}</span>
          )}
        </h3>
        <div className="text-muted/70 text-sm mb-4">
          {flag} {opponent.country}
        </div>
        <SetScores large />
        <div className="mt-4 pt-3 border-t border-red-500/20">
          <div className="text-xs uppercase tracking-widest text-red-400/70">
            Tournament Ends
          </div>
          <div className="text-[10px] text-muted/50 mt-1">
            {eliminationInfo.roundName} · {matchDate}
          </div>
        </div>
      </div>
    );
  }

  // Regular card
  return (
    <div className={`rtt-card p-2 md:p-4 rounded-lg border bg-zinc-900/20 ${
      didWin ? 'border-zinc-800/60' : 'border-red-500/40'
    }`}>
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <span className={`text-[10px] md:text-xs uppercase tracking-wider ${didWin ? 'text-muted/70' : 'text-red-400'}`}>
          {ROUND_LABELS[match.round]}
        </span>
        <span className="text-[9px] md:text-[10px] text-muted/50">{matchDate}</span>
      </div>

      <h3 className="text-sm md:text-lg font-medium mb-0.5 md:mb-1">
        <button
          onClick={() => onSelectPlayer(opponent)}
          className="hover:text-accent transition-colors cursor-pointer text-left"
        >
          {opponent.name}
        </button>
      </h3>

      <div className="text-[10px] md:text-xs text-muted/60 mb-1.5 md:mb-3">
        {flag} {opponent.country}
        {opponent.seed && <span> · S{opponent.seed}</span>}
      </div>

      <SetScores />
    </div>
  );
}

// Adaptive grid that adjusts layout based on journey length
function AdaptiveMatchGrid({
  matches,
  playerId,
  onSelectPlayer,
  eliminationInfo,
}: {
  matches: Match[];
  playerId: string;
  onSelectPlayer: (player: Player) => void;
  eliminationInfo: EliminationInfo | null;
}) {
  const count = matches.length;

  // For 7 matches (champion): standard 4-col grid, final spans 2
  // For 6 matches (finalist): 4 on top, 2 centered below
  // For 5-6 matches: 4 on top, remaining centered below with wider cards
  // For 4 or fewer: single centered row

  if (count <= 4) {
    // Single row, centered
    return (
      <div className="flex justify-center gap-3">
        {matches.map((match, i) => (
          <div key={match.id} className="w-full max-w-[280px]">
            <MatchCard
              match={match}
              playerId={playerId}
              onSelectPlayer={onSelectPlayer}
              isElimination={eliminationInfo && i === count - 1}
              eliminationInfo={eliminationInfo}
            />
          </div>
        ))}
      </div>
    );
  }

  // Split into rows: first 4, then remaining
  const firstRow = matches.slice(0, 4);
  const secondRow = matches.slice(4);

  return (
    <div className="space-y-3">
      {/* First row: 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {firstRow.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            playerId={playerId}
            onSelectPlayer={onSelectPlayer}
            isElimination={false}
            eliminationInfo={null}
          />
        ))}
      </div>

      {/* Second row: 2 columns on mobile, centered flex on desktop */}
      <div className={`grid grid-cols-2 md:flex md:justify-center gap-2 md:gap-3 ${secondRow.length <= 2 ? 'md:px-24' : ''}`}>
        {secondRow.map((match, i) => {
          const isLast = i === secondRow.length - 1;
          const isFinal = match.round === 'F';

          return (
            <div
              key={match.id}
              className={`${
                isFinal ? 'md:flex-[2]' :
                secondRow.length === 1 ? 'md:flex-1 md:max-w-md' :
                secondRow.length === 2 ? 'md:flex-1 md:max-w-sm' :
                'md:flex-1'
              }`}
            >
              <MatchCard
                match={match}
                playerId={playerId}
                onSelectPlayer={onSelectPlayer}
                isElimination={eliminationInfo && isLast && !isFinal}
                eliminationInfo={isLast && !isFinal ? eliminationInfo : null}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Journey rail showing progression through tournament
function JourneyRail({ matches, playerId }: { matches: Match[]; playerId: string }) {
  const rounds: Round[] = ['R1', 'R2', 'R3', 'R4', 'QF', 'SF', 'F'];

  const reachedRounds = new Set(matches.map(m => m.round));
  const wonFinal = matches.some(m => m.round === 'F' && m.winner.id === playerId);
  const lastRound = matches.length > 0 ? matches[matches.length - 1].round : null;
  const lostInLastRound = !!lastRound && matches.some(m => m.round === lastRound && m.winner.id !== playerId);

  // Furthest round the player reached
  const furthestReachedIndex = Math.max(
    -1,
    ...rounds.map((round, index) => reachedRounds.has(round) ? index : -1)
  );

  // Progress percentage along the track
  const progressPercent = furthestReachedIndex <= 0
    ? 0
    : (furthestReachedIndex / (rounds.length - 1)) * 100;

  return (
    <div className="py-6 border-b border-zinc-800/50">
      <div className="relative mx-auto w-full max-w-2xl">
        {/* Labels */}
        <div className="grid grid-cols-7">
          {rounds.map((round) => {
            const reached = reachedRounds.has(round);
            return (
              <div key={round} className="flex items-center justify-center">
                <span className={`text-[10px] uppercase tracking-wider text-center ${reached ? 'text-us-open-yellow' : 'text-us-open-yellow/30'}`}>
                  {ROUND_LABELS[round]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Nodes + track */}
        <div className="relative mt-2">
          {/* Background track line - spans from center of R1 to center of F */}
          <div
            className="absolute top-1/2 h-px -translate-y-1/2 bg-us-open-yellow/20"
            style={{ left: 'calc(100% / 14)', right: 'calc(100% / 14)' }}
          >
            {/* Progress portion */}
            <div
              className="absolute inset-y-0 left-0 bg-us-open-yellow/70 transition-[width] duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Dots */}
          <div className="relative grid grid-cols-7">
            {rounds.map((round) => {
              const reached = reachedRounds.has(round);
              const isLast = round === lastRound;
              const isFinal = round === 'F';
              const won = isFinal && wonFinal;
              const lost = isLast && lostInLastRound;

              return (
                <div key={round} className="flex justify-center">
                  <div className={`relative z-10 w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    won ? 'bg-us-open-yellow' :
                    lost ? 'bg-red-400' :
                    reached ? 'bg-us-open-yellow/80' :
                    'border border-us-open-yellow/30 bg-transparent'
                  }`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerSearch({ onSelect, currentPlayer, selectedPlayer }: { onSelect: (player: Player) => void; currentPlayer: string; selectedPlayer: Player | null }) {
  const [query, setQuery] = useState(currentPlayer);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [inputWidth, setInputWidth] = useState(0);

  const results = useMemo(() => {
    if (!isSearching || query === currentPlayer) return [];
    return searchPlayers(query);
  }, [query, isSearching, currentPlayer]);
  const showResults = isFocused && results.length > 0;

  // Measure text width
  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.offsetWidth + 4);
    }
  }, [query]);

  const justSelectedRef = useRef(false);

  const handleSelect = (player: Player) => {
    justSelectedRef.current = true;
    onSelect(player);
    setQuery(player.name);
    setIsFocused(false);
    setIsSearching(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current?.select();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsSearching(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setIsSearching(false);
      // Only reset if we didn't just select a player
      if (!justSelectedRef.current) {
        setQuery(currentPlayer);
      }
      justSelectedRef.current = false;
    }, 200);
  };

  return (
    <div className="relative">
      {/* Hidden span to measure text width */}
      <span
        ref={measureRef}
        className="absolute invisible whitespace-nowrap text-xl md:text-5xl font-light tracking-tight"
        aria-hidden="true"
      >
        {query}
      </span>

      {/* Large display name with search icon */}
      <div
        className="flex items-center gap-2 md:gap-4 cursor-pointer group"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Search icon */}
        <svg
          className="w-4 h-4 md:w-6 md:h-6 text-us-open-yellow/60 group-hover:text-us-open-yellow transition-colors flex-shrink-0 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        {/* Name display / Input */}
        <div className="relative">
          <div className="inline-flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
                  e.preventDefault();
                  inputRef.current?.select();
                }
                if (e.key === 'Enter' && results.length > 0) {
                  e.preventDefault();
                  handleSelect(results[0]);
                  setTimeout(() => {
                    inputRef.current?.focus();
                    inputRef.current?.select();
                  }, 50);
                }
              }}
              className="bg-transparent text-xl md:text-5xl font-light tracking-tight text-foreground focus:outline-none whitespace-nowrap"
              style={{ caretColor: 'var(--accent)', width: inputWidth > 0 ? inputWidth : 'auto' }}
            />
            {/* Blinking cursor when not focused */}
            {!isFocused && (
              <span className="w-[2px] md:w-[3px] h-5 md:h-12 bg-accent blink-cursor flex-shrink-0 ml-1" />
            )}
          </div>

          {/* Accent underline */}
          <div className={`absolute -bottom-1 left-0 h-[1px] md:h-[2px] bg-accent transition-opacity duration-300 ${isFocused ? 'opacity-100' : 'opacity-60'}`} style={{ width: inputWidth > 0 ? inputWidth : '100%' }} />
        </div>
      </div>

      {/* Player metadata - below the search row */}
      {selectedPlayer && !isFocused && (
        <div className="mt-2 md:mt-3 ml-6 md:ml-10 text-xs md:text-sm text-us-open-yellow/60">
          {FLAGS[selectedPlayer.country] || ''} {selectedPlayer.country}
          {selectedPlayer.seed && <span> · Seed {selectedPlayer.seed}</span>}
        </div>
      )}

      {/* Results dropdown */}
      {showResults && (
        <div
          className="absolute top-full left-0 right-0 mt-4 border border-zinc-800 rounded-lg shadow-2xl max-h-64 overflow-y-auto"
          style={{
            backgroundColor: '#0a0a0a',
            opacity: 1,
            zIndex: 9999
          }}
        >
          {results.map(player => (
            <div
              key={player.id}
              onMouseDown={() => handleSelect(player)}
              className="w-full px-6 py-4 hover:bg-zinc-800 transition-colors flex items-center justify-between cursor-pointer border-b border-zinc-800/50 last:border-0"
              style={{ backgroundColor: '#0a0a0a', opacity: 1 }}
            >
              <span className="text-lg font-light">{player.name}</span>
              {player.seed && (
                <span className="text-sm text-muted">Seed {player.seed}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Round display names for summary
const ROUND_RESULT_NAMES: Record<Round, string> = {
  R1: '1st Round',
  R2: '2nd Round',
  R3: '3rd Round',
  R4: 'Round of 16',
  QF: 'Quarterfinalist',
  SF: 'Semifinalist',
  F: 'Finalist',
};

export function RoadToTitle() {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(SHELTON_ID);
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>('Ben Shelton');

  // Compute stats and matches for selected player
  const stats = useMemo(() => computePlayerStats(selectedPlayerId), [selectedPlayerId]);
  const journeyMatches = useMemo(() => getPlayerJourneyMatches(selectedPlayerId), [selectedPlayerId]);
  const selectedPlayer = useMemo(() => getPlayer(selectedPlayerId) || null, [selectedPlayerId]);
  const tournament = useMemo(() => getTournament(), []);

  // Check if player is champion or finalist
  const isChampion = selectedPlayerId === tournament.champion.id;
  const isFinalist = selectedPlayerId === tournament.finalist.id;

  // Compute elimination info
  const eliminationInfo = useMemo(() => {
    if (isChampion) return null;
    const lastMatch = journeyMatches[journeyMatches.length - 1];
    if (!lastMatch) return null;
    const didWin = lastMatch.winner.id === selectedPlayerId;
    if (didWin && lastMatch.round !== 'F') return null; // Still in tournament or won

    const opponent = lastMatch.player1.id === selectedPlayerId ? lastMatch.player2 : lastMatch.player1;
    return {
      round: lastMatch.round,
      roundName: ROUND_RESULT_NAMES[lastMatch.round],
      lostTo: opponent,
      record: `${stats.matchesWon}–${journeyMatches.length - stats.matchesWon}`,
    };
  }, [journeyMatches, selectedPlayerId, isChampion, stats.matchesWon]);

  const handleSearchSelect = (player: Player) => {
    setSelectedPlayerId(player.id);
    setSelectedPlayerName(player.name);
  };

  return (
    <section className="snap-section reveal-section relative flex flex-col px-4 md:px-8 border-t border-zinc-800 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/arthur-ashe.webp"
          alt=""
          fill
          className="object-cover opacity-40"
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col h-full py-6">
        {/* Header row: Title left, Search right */}
        <div className="rtt-header relative z-50 flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-center mb-4">
          {/* Desktop: show title and description */}
          <div className="hidden md:block">
            <span className="text-xs tracking-widest uppercase text-us-open-yellow/70 block mb-2">02 &middot; Player Search</span>
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              Search any player
            </h2>
            <p className="text-base text-us-open-yellow/50 mt-2">
              to see their 2026 US Open journey.
            </p>
          </div>
          {/* Mobile: just show section label */}
          <span className="md:hidden text-[10px] tracking-widest uppercase text-us-open-yellow/70 block">02 &middot; Player Journey</span>

          <div className="rtt-search relative z-10">
            <PlayerSearch onSelect={handleSearchSelect} currentPlayer={selectedPlayerName} selectedPlayer={selectedPlayer} />
            {/* One-line summary */}
            <div className="ml-7 md:ml-10 text-[10px] md:text-xs uppercase tracking-widest mt-1">
              {isChampion ? (
                <span className="text-us-open-yellow">Champion · {stats.matchesWon}–0 record</span>
              ) : eliminationInfo ? (
                <span className="text-foreground/50">
                  {eliminationInfo.roundName} · Lost to {eliminationInfo.lostTo.shortName} · {eliminationInfo.record} record
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Stats row - dynamic per player (hidden on mobile) */}
        {journeyMatches.length > 0 && (
          <div className="rtt-stats relative z-0 hidden md:grid grid-cols-4 gap-4 flex-shrink-0 py-4">
            <div className="text-center">
              <div className="text-2xl font-light">{stats.matchesWon}</div>
              <div className="text-xs text-us-open-yellow/50">Matches Won</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light">{stats.setsWon}-{stats.setsLost}</div>
              <div className="text-xs text-us-open-yellow/50">Sets W-L</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light">{stats.fiveSetMatches}</div>
              <div className="text-xs text-us-open-yellow/50">5-Set Matches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-light">{stats.seededOpponentsDefeated}</div>
              <div className="text-xs text-us-open-yellow/50">Seeds Beaten</div>
            </div>
          </div>
        )}

        {/* Journey rail (hidden on mobile) */}
        {journeyMatches.length > 0 && (
          <div className="hidden md:block">
            <JourneyRail matches={journeyMatches} playerId={selectedPlayerId} />
          </div>
        )}

        {/* Match cards - adaptive grid based on journey length */}
        <div className="flex-1 mt-4 min-h-0">
          {journeyMatches.length > 0 ? (
            <AdaptiveMatchGrid
              matches={journeyMatches}
              playerId={selectedPlayerId}
              onSelectPlayer={handleSearchSelect}
              eliminationInfo={eliminationInfo}
            />
          ) : (
            <div className="text-center text-us-open-yellow/50 py-12">
              No matches found for this player in the main draw.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
