import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchResults } from "@/components/search-results"
import { listings } from "@/lib/listings"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; bhk?: string; furnishing?: string }>
}) {
  const { q, bhk, furnishing } = await searchParams

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <SearchResults
          listings={listings}
          initialQuery={q ?? ""}
          initialBhk={bhk ? Number(bhk) : -1}
          initialFurnishing={furnishing ?? "Any"}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
