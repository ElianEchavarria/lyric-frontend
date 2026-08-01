import { auth } from "@/lib/auth";
import type { Playlist } from "@/types";

// Only the fields we actually use from Spotify's GET /me/playlists response.
// NOTE: `items` here is the top-level array of playlists (the paging object).
// Each playlist's OWN track-count ref is ALSO called `items` (Spotify renamed it
// from `tracks` → `items` to cover podcast episodes) — hence `playlist.items.total`.
// Fields are optional because real playlists sometimes omit them; don't assume.
interface SpotifyPlaylistsResponse {
    items: ({
        id: string;
        name: string;
        uri: string;
        images?: { url: string }[] | null;
        items?: { total: number } | null; // track-count ref (Spotify's new name for `tracks`)
    } | null)[];
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
                imageUrl: p.images?.[0]?.url ?? "",
                trackCount: p.items?.total ?? 0,
            }));

        return Response.json(playlists);
    } catch (error) {
        console.error("Failed to fetch playlists:", error);
        return Response.json({ error: "Failed to fetch playlists" }, { status: 500 });
    }
}
