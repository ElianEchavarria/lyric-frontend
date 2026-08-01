"use client"

import { signIn } from "next-auth/react"

export function SignInButton() {
  return (
    <button
      onClick={() => signIn("spotify")}
      className="rounded-full bg-[#1DB954] px-8 py-4 font-bold tracking-tight text-[#08130B] transition hover:brightness-110"
    >
      Continue with Spotify
    </button>
  )
}
