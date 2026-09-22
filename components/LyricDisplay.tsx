"use client"

import Link from "next/link"
import { useNowPlaying } from "@/hooks/useNowPlaying"
import { useLyrics } from "@/hooks/useLyrics"
import { usePlaybackClock } from "@/hooks/usePlaybackClock"
import { useRef, useEffect } from "react"
import type { SyncedLine } from "@/types"

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen bg-[#0A0A0F]">
    <Link
      href="/playlists"
      className="absolute left-5 top-5 z-10 rounded-full bg-white/[0.06] px-4 py-2 text-sm font-semibold text-[#F4F2F8] backdrop-blur-xl transition hover:bg-white/[0.12]"
    >
      ← Playlists
    </Link>
    {children}
  </div>
)

const Centered = ({ text }: { text: string }) => (
  <div className="flex min-h-screen items-center justify-center text-[#EDEDF2]/50">
    <p>{text}</p>
  </div>
)

export function LyricDisplay() {
  const nowPlaying = useNowPlaying()
  const lyrics = useLyrics(
    nowPlaying?.track,
    nowPlaying?.artist,
    nowPlaying?.album,
    nowPlaying?.durationMs,
  )
  // All hooks must run before any early return — they can't be conditional.
  const progress = usePlaybackClock(nowPlaying?.progressMs, nowPlaying?.isPlaying)
  const activeLineRef = useRef<HTMLParagraphElement>(null)

  // The active line = the last line whose time has already passed.
  // (lines are sorted ascending, so once we pass progress we can stop.)
  // Falls back to [] when there are no synced lyrics, so this stays harmless.
  const lines = lyrics?.type === "synced-lines" ? (lyrics.lines as SyncedLine[]) : []
  let activeIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time <= progress) activeIndex = i
    else break
  }

  // Keep the active line centered. Depends on activeIndex (not progress) so it
  // scrolls only when the line changes, not on every clock tick.
  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [activeIndex])

  if (!nowPlaying) {
    return <Shell><Centered text="Nothing playing" /></Shell>
  }
  if (!lyrics) {
    return <Shell><Centered text="Loading lyrics…" /></Shell>
  }
  if (lyrics.type === "none") {
    return <Shell><Centered text="No lyrics found" /></Shell>
  }
  
  // Unsynced: plain text, no highlight
  if (lyrics.type === "unsynced") {
    return (
      <Shell>
        <div className="mx-auto max-w-2xl space-y-3 px-6 py-24 text-lg text-[#EDEDF2]/70">
          {(lyrics.lines as string[]).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </Shell>
    )
  }
  
  
  
  
  return (
   <Shell>
      <div className="mx-auto max-w-2xl space-y-4 px-6 py-[40vh]">
        {lines.map((line, i) => (
          <p
            key={i}
            ref={i === activeIndex ? activeLineRef : null}
            className={
              i === activeIndex
                ? "text-3xl font-bold tracking-tight text-[#F4F2F8] transition-all duration-500"
                : "text-2xl font-semibold tracking-tight text-[#EDEDF2]/25 transition-all duration-500"
            }
          >
            {line.text || "♪"}
          </p>
        ))}
      </div>
    </Shell>
  )
}
