// Only the fields we care about from lrclib's /api/get response.
// syncedLyrics/plainLyrics are null for instrumental tracks.
interface LrclibResponse {
    syncedLyrics: string | null;
    plainLyrics: string | null;
    instrumental: boolean;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const track = searchParams.get("track");
    const artist = searchParams.get("artist");
    const album = searchParams.get("album");
    const duration = searchParams.get("duration");

    if (!track || !artist) {
        return Response.json({ error: "Missing track or artist" }, { status: 400 });
    }

    // URLSearchParams URL-encodes every value (handles spaces, &, etc.);
    // only add album/duration when present so we never send "null".
    const params = new URLSearchParams({ artist_name: artist, track_name: track });
    if (album) params.set("album_name", album);
    if (duration) params.set("duration", duration);

    try {
        const res = await fetch(`https://lrclib.net/api/get?${params}`, {
            headers: { "User-Agent": "Lyriq (https://github.com/elian/lyriq)" },
        });

        // 404 = lrclib doesn't have this song → the expected "no lyrics" case,
        // not a server error. (Later this is where the waterfall falls to the next source.)
        if (res.status === 404) {
            return Response.json({ source: null, type: "none", lines: [] });
        }

        if (!res.ok) {
            const body = await res.text();
            console.error("lrclib error:", res.status, body);
            return Response.json(
                { error: "Failed to fetch lyrics", lrclibStatus: res.status },
                { status: 500 },
            );
        }

        const data = (await res.json()) as LrclibResponse;

        // TEMP: return raw lrclib data so we can eyeball `syncedLyrics`.
        // Next step (parse.ts) turns syncedLyrics → SyncedLine[] / LyricResult.
        return Response.json(data);
    } catch (error) {
        console.error("Failed to fetch lyrics:", error);
        return Response.json({ error: "Failed to fetch lyrics" }, { status: 500 });
    }
}
