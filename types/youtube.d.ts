/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  namespace YT {
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      destroy(): void;
    }

    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent {
      data: number;
      target: Player;
    }

    interface PlayerOptions {
      videoId: string;
      width?: number | string;
      height?: number | string;
      playerVars?: {
        autoplay?: 0 | 1;
        mute?: 0 | 1;
        controls?: 0 | 1;
        showinfo?: 0 | 1;
        rel?: 0 | 1;
        modestbranding?: 0 | 1;
        playsinline?: 0 | 1;
        start?: number;
        end?: number;
        disablekb?: 0 | 1;
        iv_load_policy?: 1 | 3;
        fs?: 0 | 1;
        loop?: 0 | 1;
        playlist?: string;
      };
      events?: {
        onReady?: (event: PlayerEvent) => void;
        onStateChange?: (event: OnStateChangeEvent) => void;
        onError?: (event: any) => void;
      };
    }

    const PlayerState: {
      UNSTARTED: -1;
      ENDED: 0;
      PLAYING: 1;
      PAUSED: 2;
      BUFFERING: 3;
      CUED: 5;
    };

    class Player {
      constructor(element: HTMLElement | string, options: PlayerOptions);
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
      getCurrentTime(): number;
      destroy(): void;
    }
  }

  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}
