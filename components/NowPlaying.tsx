"use client"

import { useNowPlaying } from "@/hooks/useNowPlaying"

const NowPlaying = () => {
  const nowPlaying = useNowPlaying()

  // null on first load AND when nothing is playing (route returns 204 → null)
  if (!nowPlaying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] text-[#EDEDF2]/60">
        <p>Nothing playing</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#0A0A0F] px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={nowPlaying.albumArtUrl}
        alt={`${nowPlaying.album} cover`}
        className="h-64 w-64 rounded-2xl shadow-2xl"
      />
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-[#F4F2F8]">
          {nowPlaying.track}
        </h1>
        <p className="text-lg text-[#EDEDF2]/70">{nowPlaying.artist}</p>
      </div>
    </div>
  )
}

export default NowPlaying
