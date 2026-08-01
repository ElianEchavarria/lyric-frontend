import { auth } from "@/lib/auth";
import type { Playlist } from "@/types";

// Only the fields we actually use from Spotify's GET /me/playlists response
interface SpotifyPlaylistsResponse {
    items: {
        id: string;
        name: string;
        uri: string;
        images: { url: string }[];
        tracks: { total: number };
    }[];
}

export async function GET() {
    const session = await auth();
    if (!session?.access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
            headers: {
                Authorization: `Bearer ${session.access_token}`,
            },
        });

        if (!res.ok) {
            const body = await res.text();
            console.error("Spotify /me/playlists failed:", res.status, body);
            return Response.json(
                { error: "Failed to fetch playlists", spotifyStatus: res.status },
                { status: 500 },
            );
        }

        const data = (await res.json()) as SpotifyPlaylistsResponse;

        const playlists: Playlist[] = data.items
            .filter((p) => p != null) // Spotify can return null entries for deleted playlists
            .map((p) => ({
                id: p.id,
                name: p.name,
                uri: p.uri,
                imageUrl: p.images[0]?.url ?? "",
                trackCount: p.tracks.total,
            }));

        return Response.json(playlists);
    } catch (error) {
        console.error("Failed to fetch playlists:", error);
        return Response.json({ error: "Failed to fetch playlists" }, { status: 500 });
    }
}
