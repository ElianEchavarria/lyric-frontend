import { SignInButton } from "@/components/SignInButton";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-6 px-6 text-center bg-[radial-gradient(circle_at_50%_120%,#241436,#0F0B18_45%,#08080C_80%)]">
      <h1 className="text-7xl font-black tracking-tighter text-[#F4F2F8] sm:text-8xl">
        Lyriq
      </h1>
      <p className="text-lg text-[#EDEDF2]/70">Your music, word for word</p>
      <SignInButton />
    </main>
  );
}
