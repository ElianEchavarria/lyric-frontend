import { auth } from "@/lib/auth";

// Starts playback on the user's ACTIVE Spotify device (phone/desktop).
// No audio plays in the browser — this is a remote-control command.
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.access_token) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { contextUri } = (await request.json()) as { contextUri?: string };
    if (!contextUri) {
        return Response.json({ error: "Missing contextUri" }, { status: 400 });
    }

    try {
        const res = await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ context_uri: contextUri }),
        });

        // 204 = playback started. 404 = no device is currently active.
        if (res.status === 404) {
            return Response.json(
                { error: "No active device. Open Spotify on a device first." },
                { status: 404 },
            );
        }

        if (!res.ok) {
            const body = await res.text();
            console.error("Spotify play failed:", res.status, body);
            return Response.json(
                { error: "Failed to start playback", spotifyStatus: res.status },
                { status: 500 },
            );
        }

        return new Response(null, { status: 204 });
    } catch (error) {
        console.error("Failed to start playback:", error);
        return Response.json({ error: "Failed to start playback" }, { status: 500 });
    }
}
