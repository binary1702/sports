'use client';

import { Match } from '@/lib/data/types';

interface BracketMatchProps {
  match: Match;
  isHighlighted: boolean;
  isCompact?: boolean;
  onClick?: () => void;
}

export function BracketMatch({ match, isHighlighted, isCompact = false, onClick }: BracketMatchProps) {
  const winner = match.winner;
  const loser = match.loser;

  return (
    <button
      onClick={onClick}
      className={`
        w-full text-left rounded border transition-all hover:scale-[1.02] active:scale-[0.98]
        ${isHighlighted
          ? 'border-accent bg-accent/10'
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
        }
        ${isCompact ? 'p-2' : 'p-3'}
      `}
    >
      {/* Winner */}
      <div className={`flex items-center justify-between ${isCompact ? 'mb-1' : 'mb-2'}`}>
        <div className="flex items-center gap-2 min-w-0">
          {winner.seed && (
            <span className={`text-muted flex-shrink-0 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
              ({winner.seed})
            </span>
          )}
          <span className={`font-medium truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {isCompact ? winner.shortName : winner.name}
          </span>
        </div>
        <div className={`flex gap-1 flex-shrink-0 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
          {match.sets.map((set, i) => (
            <span
              key={i}
              className={`font-mono ${
                (set.winner === 1 && match.player1.id === winner.id) ||
                (set.winner === 2 && match.player2.id === winner.id)
                  ? 'text-foreground'
                  : 'text-muted'
              }`}
            >
              {match.player1.id === winner.id ? set.player1Games : set.player2Games}
            </span>
          ))}
        </div>
      </div>

      {/* Loser */}
      <div className="flex items-center justify-between text-muted">
        <div className="flex items-center gap-2 min-w-0">
          {loser.seed && (
            <span className={`flex-shrink-0 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
              ({loser.seed})
            </span>
          )}
          <span className={`truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>
            {isCompact ? loser.shortName : loser.name}
          </span>
        </div>
        <div className={`flex gap-1 flex-shrink-0 ${isCompact ? 'text-[10px]' : 'text-xs'}`}>
          {match.sets.map((set, i) => (
            <span key={i} className="font-mono">
              {match.player1.id === loser.id ? set.player1Games : set.player2Games}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
