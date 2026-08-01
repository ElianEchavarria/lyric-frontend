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

export interface Playlist {
    id: string;
    name: string;
    imageUrl: string;
    trackCount: number;
    uri: string; // "spotify:playlist:..." — the context_uri for starting playback
}