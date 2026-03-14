import { redirect } from 'next/navigation'

// Public book catalog is not yet implemented — redirect to dashboard
export default function BooksPage() {
  redirect('/dashboard')
}
