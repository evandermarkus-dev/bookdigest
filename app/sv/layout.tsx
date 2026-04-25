/**
 * Swedish subtree layout.
 * Sets lang="sv" on the content wrapper — Next.js App Router does not allow
 * nested <html> elements, so we use a div with lang attribute as the closest
 * accessible equivalent. The hreflang <link> tags from generateMetadata are
 * the primary signal for search engines.
 */
export default function SwedishLayout({ children }: { children: React.ReactNode }) {
  return <div lang="sv">{children}</div>
}
