import SagaOnboarding from "@/components/SagaOnboarding"
import Link from "next/link"

export const metadata = {
  title: "Kom igång – BookDigest",
  description: "Låt Saga guida dig genom BookDigest på några minuter.",
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <SagaOnboarding />
      <Link
        href="/dashboard"
        className="mt-2 text-xs text-gray-400 hover:text-gray-600 underline"
      >
        Hoppa över, ta mig till dashboard →
      </Link>
    </main>
  )
}
