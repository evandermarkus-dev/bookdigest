import { redirect } from 'next/navigation'

// Swedish public book catalog is not yet implemented — redirect to dashboard
export default function SvBooksPage() {
  redirect('/dashboard')
}
