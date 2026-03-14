import { notFound } from 'next/navigation'

// Individual book pages are not yet implemented
export default async function EnglishBookPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  await params
  notFound()
}
