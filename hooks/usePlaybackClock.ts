import { useState, useEffect, useRef } from "react"

// Spotify's progressMs only refreshes once per poll (~3s), so it sits frozen in
// between — which makes lyric highlighting lag behind the audio by up to 3s.
// This estimates the live position by adding the real time elapsed since the
// last poll, and re-anchors whenever a fresh poll arrives.
export function usePlaybackClock(
  polledProgressMs: number | undefined,
  isPlaying: boolean | undefined,
) {
  const [progress, setProgress] = useState(0)

  // The last trusted reading: the polled value + when we received it.
  // A ref (not state) because updating the anchor shouldn't cause a re-render —
  // only the visible `progress` should.
  const anchor = useRef({ base: 0, at: 0 })

  // A fresh poll arrived → hard resync, so drift never accumulates.
  useEffect(() => {
    if (polledProgressMs == null) return
    anchor.current = { base: polledProgressMs, at: performance.now() }
    setProgress(polledProgressMs)
  }, [polledProgressMs])

  // While playing, tick forward from the anchor. Not running when paused means
  // the clock freezes — which is exactly right.
  useEffect(() => {
    if (!isPlaying) return

    const id = setInterval(() => {
      const { base, at } = anchor.current
      setProgress(base + (performance.now() - at))
    }, 200) // 200ms is plenty for line-level sync; rAF is for Phase 3 word sweep

    return () => clearInterval(id)
  }, [isPlaying])

  return progress
}
