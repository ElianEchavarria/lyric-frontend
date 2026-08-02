import { useState, useEffect } from "react"
import type { LyricResult } from "@/types"

// Fetches lyrics for the current track. Re-runs only when track/artist change
// (not on every now-playing poll), because those strings stay stable per song.
export function useLyrics(
  track: string | undefined,
  artist: string | undefined,
  album?: string,
  durationMs?: number,
) {
  const [lyrics, setLyrics] = useState<LyricResult | null>(null)

  useEffect(() => {
    if (!track || !artist) return

    // guards against a stale response landing after the track already changed
    let cancelled = false

    async function load() {
      const params = new URLSearchParams({ track: track!, artist: artist! })
      if (album) params.set("album", album)
      if (durationMs) params.set("duration", String(Math.round(durationMs / 1000)))

      try {
        const res = await fetch(`/api/lyrics?${params}`)
        if (!res.ok) return
        const data = (await res.json()) as LyricResult
        if (!cancelled) setLyrics(data)
      } catch (err) {
        console.error("lyrics error:", err)
      }
    }

    setLyrics(null) // clear old lyrics while the new track's load is in flight
    load()

    return () => {
      cancelled = true
    }
  }, [track, artist, album, durationMs])

  return lyrics
}
