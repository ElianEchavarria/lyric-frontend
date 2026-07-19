import "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string
    expires_at: number // seconds since epoch, as Spotify reports it
    refresh_token?: string
    error?: "RefreshTokenError"
  }
}
