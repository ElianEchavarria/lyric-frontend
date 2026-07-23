import { getToken } from "next-auth/jwt";


// token.access_token is what you pass to Spotify
// token is null if not logged in → return 401

interface SpotifyNowPlaying {
    is_playing: boolean;
    progress_ms: number;
    item: {
        name: string;
        duration_ms: number;
        artists: { name: string }[];
        album: {
            name: string;
            images: { url: string }[];
        };
    };
}


export async function GET(request: Request) {
    const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
    if (!token?.access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const res = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token.access_token}`
            },

        })

        // Spotify returns a 204 No Content status if nothing is currently playing
        if (res.status === 204) {
            console.log("Playback is inactive. Nothing playing.");
            return Response.json(null);
        }


        const data = (await res.json()) as SpotifyNowPlaying;
        if (!res.ok) {
            throw new Error(`Spotify API error: ${res.status} ${res.statusText}`);
        }

        return Response.json({
            track: data.item.name,
            artist: data.item.artists.map((a: { name: string }) => a.name).join(", "),
            album: data.item.album.name,
            albumArtUrl: data.item.album.images[0]?.url ?? "",
            durationMs: data.item.duration_ms,
            progressMs: data.progress_ms,
            isPlaying: data.is_playing,
        })



    } catch (error) {
        console.error("Failed to fetch currently playing track:", error);
        return Response.json({ error: "Failed to fetch currently playing track" }, { status: 500 });
    }

}
