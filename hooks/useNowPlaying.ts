import { useState, useEffect } from "react";
import { NowPlaying } from "@/types";

// Spotify plays the music on the user's device. Lyriq just asks Spotify "what's playing right now?" every few seconds. 

export function useNowPlaying() {
    const [data, setData] = useState<NowPlaying | null>(null);

    useEffect(() => {
        async function poll() {
            try {
                const res = await fetch("/api/now-playing");
                if (res.status === 401) { setData(null); return; }   // not logged in
                if (!res.ok) { console.error("now-playing failed:", res.status); return; }
                const json = await res.json();
                setData(json);   // json is the track object, or null when nothing's playing
            } catch (err) {
                console.error("poll error:", err);   // network failure — don't kill the loop
            }
        }



        poll(); // call once immediately
        const id = setInterval(poll, 3000);  // then every 3s

        return () => clearInterval(id);      // cleanup: stop on unmount
    }, [])

    return data
}