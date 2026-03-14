import { notFound } from 'next/navigation'

// Individual Swedish book pages are not yet implemented
export default async function SwedishBookPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  await params
  notFound()
}
