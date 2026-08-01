"use client"

import { useEffect, useState } from "react"
import type { Playlist } from "@/types"

const PlaylistPicker = () => {
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function play(uri: string) {
    setMessage(null)
    try {
      const res = await fetch("/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contextUri: uri }),
      })
      if (res.status === 404) {
        setMessage("Open Spotify on a device first, then tap again.")
      } else if (!res.ok) {
        setMessage("Couldn't start playback. Try again.")
      }
    } catch {
      setMessage("Couldn't start playback. Try again.")
    }
  }

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

      {message && (
        <p className="mb-6 text-sm text-[#F5A34A]">{message}</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => play(playlist.uri)}
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
