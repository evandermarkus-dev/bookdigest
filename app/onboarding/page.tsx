import SagaOnboarding from "@/components/SagaOnboarding"

export const metadata = {
  title: "Kom igång – BookDigest",
  description: "Låt Saga guida dig genom BookDigest på några minuter.",
}

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <SagaOnboarding />
    </main>
  )
}
