import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchResults } from "@/components/search-results"
import { listings as staticListings } from "@/lib/listings"
import { dbRowToListing } from "@/lib/db-to-listing"

async function fetchListings(params: Record<string, string | undefined>) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const qs = new URLSearchParams({ status: "live" })
    if (params.bhk && params.bhk !== "-1") qs.set("bhk", params.bhk)
    if (params.furnishing && params.furnishing !== "Any") qs.set("furnishing", params.furnishing)
    if (params.minRent) qs.set("minRent", params.minRent)
    if (params.maxRent) qs.set("maxRent", params.maxRent)
    qs.set("limit", "100")

    const res = await fetch(`${apiUrl}/api/properties?${qs}`, { next: { revalidate: 30 } })
    if (!res.ok) throw new Error("API error")
    const json = await res.json()
    const rows = json.data ?? json
    if (!Array.isArray(rows) || rows.length === 0) throw new Error("Empty")
    return rows.map(dbRowToListing)
  } catch {
    // Fall back to static demo listings if API is unavailable
    return staticListings
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; bhk?: string; furnishing?: string; minRent?: string; maxRent?: string }>
}) {
  const { q, bhk, furnishing, minRent, maxRent } = await searchParams
  const listings = await fetchListings({ bhk, furnishing, minRent, maxRent })

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <SearchResults
          listings={listings}
          initialQuery={q ?? ""}
          initialBhk={bhk ? Number(bhk) : -1}
          initialFurnishing={furnishing ?? "Any"}
          initialMaxRent={maxRent ? Number(maxRent) : 1000000}
          initialMinRent={minRent ? Number(minRent) : 0}
        />
      </main>
      <SiteFooter />
    </div>
  )
}
