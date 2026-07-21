"use client"

import { signIn } from "next-auth/react"

export function SignInButton() {
  return (
    <button onClick={() => signIn("spotify")}>
      Sign in with Spotify
    </button>
  )
}
