// types/index.ts
export interface NowPlaying {
    track: string;
    artist: string;
    album: string;
    albumArtUrl: string;
    durationMs: number;
    progressMs: number;
    isPlaying: boolean;
}