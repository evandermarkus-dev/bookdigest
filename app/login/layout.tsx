import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In – BookDigest',
  description: 'Sign in to BookDigest with Google to access your AI-powered book summaries.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
