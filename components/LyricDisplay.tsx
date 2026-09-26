"use client"

import Link from "next/link"
import { useNowPlaying } from "@/hooks/useNowPlaying"
import { useLyrics } from "@/hooks/useLyrics"
import { usePlaybackClock } from "@/hooks/usePlaybackClock"
import { useColorPalette, type Palette } from "@/hooks/useColorPalette"
import { useRef, useEffect } from "react"
import type { SyncedLine } from "@/types"

const Shell = ({
  children,
  palette,
}: {
  children: React.ReactNode
  palette: Palette
}) => (
  <div
    className="relative min-h-screen transition-colors duration-700"
    style={{ backgroundColor: palette.dark }}
  >
    <div
      className="pointer-events-none fixed inset-0 transition-[background] duration-700"
      style={{
        background: `linear-gradient(180deg, ${palette.mid} 0%, ${palette.dark} 100%)`,
      }}
    />
    <div
      className="pointer-events-none fixed inset-0 opacity-25 transition-colors duration-700"
      style={{ backgroundColor: palette.accent }}
    />
    <div
      className="pointer-events-none fixed inset-0 opacity-45 transition-[background] duration-700"
      style={{
        background: `radial-gradient(75% 55% at 50% 0%, ${palette.accent}, transparent 70%)`,
      }}
    />
    <Link
      href="/playlists"
      className="fixed left-5 top-5 z-20 rounded-full bg-white/[0.06] px-4 py-2 text-sm font-semibold text-[#F4F2F8] backdrop-blur-xl transition hover:bg-white/[0.12]"
    >
      ← Playlists
    </Link>
    <div className="relative z-10">{children}</div>
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
  const progress = usePlaybackClock(nowPlaying?.progressMs, nowPlaying?.isPlaying)
  const palette = useColorPalette(nowPlaying?.albumArtUrl)
  const activeLineRef = useRef<HTMLParagraphElement>(null)

  const lines = lyrics?.type === "synced-lines" ? (lyrics.lines as SyncedLine[]) : []
  let activeIndex = -1
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startTime <= progress) activeIndex = i
    else break
  }

  useEffect(() => {
    activeLineRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [activeIndex])

  if (!nowPlaying) {
    return <Shell palette={palette}><Centered text="Nothing playing" /></Shell>
  }
  if (!lyrics) {
    return <Shell palette={palette}><Centered text="Loading lyrics…" /></Shell>
  }
  if (lyrics.type === "none") {
    return <Shell palette={palette}><Centered text="No lyrics found" /></Shell>
  }

  if (lyrics.type === "unsynced") {
    return (
      <Shell palette={palette}>
        <div className="mx-auto max-w-2xl space-y-3 px-6 py-24 text-lg text-[#EDEDF2]/70">
          {(lyrics.lines as string[]).map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </Shell>
    )
  }

  return (
    <Shell palette={palette}>
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
