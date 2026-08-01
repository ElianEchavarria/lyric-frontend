"use client"

import { useEffect, useState } from "react"
import type { Playlist } from "@/types"

const PlaylistPicker = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/playlists")
        if (!res.ok) {
          console.error("playlists failed:", res.status)
          return
        }
        const data = (await res.json()) as Playlist[]
        setPlaylists(data)
      } catch (err) {
        console.error("playlists error:", err)
      }
    }
    load()
  }, [])

  if (!playlists) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] text-[#EDEDF2]/60">
        <p>Loading playlists…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] px-6 py-10">
      <h1 className="mb-8 text-3xl font-black tracking-tight text-[#F4F2F8]">
        Your playlists
      </h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => {
              // TODO (your pickup): start this playlist on the user's ACTIVE device.
              // No in-app player — this tells Spotify to play on their phone/desktop,
              // then now-playing mirrors it as usual.
              // Build POST /api/play → PUT /v1/me/player/play { context_uri: playlist.uri }
              // playlist.uri is the context_uri, e.g. "spotify:playlist:37i9dQ..."
              console.log("play", playlist.uri)
            }}
            className="flex flex-col gap-2 rounded-2xl bg-white/[0.04] p-3 text-left transition hover:bg-white/[0.08]"
          >
            {playlist.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={playlist.imageUrl}
                alt={`${playlist.name} cover`}
                className="aspect-square w-full rounded-xl object-cover"
              />
            ) : (
              <div className="aspect-square w-full rounded-xl bg-white/[0.06]" />
            )}
            <span className="truncate text-sm font-semibold text-[#F4F2F8]">
              {playlist.name}
            </span>
            <span className="text-xs text-[#EDEDF2]/50">
              {playlist.trackCount} tracks
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default PlaylistPicker
