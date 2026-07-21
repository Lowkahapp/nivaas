import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrendingUp, Building2, Users, IndianRupee, Sparkles, Globe } from "lucide-react"
import Link from "next/link"

// ─── Types ────────────────────────────────────────────────────────────────────
interface BhkRow {
  bhk: number
  avg_rent: number
  min_rent: number
  max_rent: number
  listing_count: number
}

interface LocalityRow {
  locality: string
  city?: string
  avg_rent: number
  listing_count: number
  source?: string
}

interface DemandRow {
  locality: string
  city?: string
  live_listings: number
  total_enquiries: number
  enquiries_per_listing: number
}

interface AiBenchmark {
  locality: string
  city: string
  bhk: number
  avg_rent: number
  min_rent: number
  max_rent: number
  notes?: string
}

interface TrendsData {
  generated_at: string
  data_source: "live" | "ai" | "sample"
  ai_benchmarks_count: number
  ai_last_updated: string | null
  summary: {
    overall_avg_rent: number
    total_live_listings: number
    enquiries_this_month: number
    cities_covered: number
  }
  by_bhk: BhkRow[]
  by_locality: LocalityRow[]
  demand_supply: DemandRow[]
  ai_by_city: Record<string, AiBenchmark[]>
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchTrends(): Promise<TrendsData | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const res = await fetch(`${apiUrl}/api/trends`, { next: { revalidate: 300 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return `₹${Number(n).toLocaleString("en-IN")}`
}

function demandLabel(epl: number): { label: string; color: string } {
  if (epl >= 4) return { label: "Very High", color: "text-red-600 bg-red-50" }
  if (epl >= 3) return { label: "High", color: "text-orange-600 bg-orange-50" }
  if (epl >= 2) return { label: "Moderate", color: "text-yellow-700 bg-yellow-50" }
  return { label: "Low", color: "text-green-700 bg-green-50" }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function RentalTrendsPage() {
  const data = await fetchTrends()

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Trends data unavailable. Please check the API connection.</p>
            <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">← Back to home</Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const { summary, by_bhk, by_locality, demand_supply, ai_by_city, data_source, ai_last_updated } = data
  const isAi = data_source === "ai" || data.ai_benchmarks_count > 0
  const cities = Object.keys(ai_by_city)

  const maxAvgRent = Math.max(...by_locality.map((l) => l.avg_rent), 1)
  const maxListings = Math.max(...by_locality.map((l) => l.listing_count), 1)
  const maxEpl = Math.max(...demand_supply.map((d) => d.enquiries_per_listing), 1)

  const updatedAt = new Date(data.generated_at).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric",
  })

  const aiUpdatedAt = ai_last_updated
    ? new Date(ai_last_updated).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : null

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">

        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium text-primary-foreground">
                    <TrendingUp className="size-4" />
                    Updated {updatedAt}
                  </span>
                  {isAi && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/25 px-3 py-1 text-sm font-medium text-primary-foreground">
                      <Sparkles className="size-4" />
                      AI-powered benchmarks
                    </span>
                  )}
                </div>
                <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
                  Rental Trends
                </h1>
                <p className="mt-3 max-w-xl text-lg text-primary-foreground/85">
                  Live verified listings blended with AI-generated benchmarks across major Indian cities — so you always have market context, even before our listings reach a new city.
                </p>
              </div>
            </div>

            {/* Summary stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: IndianRupee, label: "Overall avg rent / mo", value: summary.overall_avg_rent > 0 ? fmt(summary.overall_avg_rent) : "—" },
                { icon: Building2, label: "Live verified listings", value: summary.total_live_listings.toString() },
                { icon: Users, label: "Visit enquiries this month", value: summary.enquiries_this_month.toString() },
                { icon: Globe, label: "Cities with AI benchmarks", value: (summary.cities_covered || cities.length).toString() },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-primary-foreground/10 px-5 py-5">
                  <s.icon className="size-5 text-primary-foreground/70" />
                  <p className="mt-2 font-heading text-2xl font-extrabold text-primary-foreground">{s.value}</p>
                  <p className="mt-0.5 text-sm text-primary-foreground/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI data banner */}
        {isAi && (
          <div className="border-b border-border bg-card">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="size-4 text-primary" />
                <span>
                  <span className="font-medium text-foreground">{data.ai_benchmarks_count} AI benchmarks</span> across {cities.length} cities
                  {aiUpdatedAt && <> — last refreshed {aiUpdatedAt}</>}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                AI data is blended with live listings · Admin can refresh via the dashboard
              </span>
            </div>
          </div>
        )}

        {/* BHK average rents */}
        {by_bhk.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Average rent by BHK type
            </h2>
            <p className="mt-1 text-muted-foreground">
              {data_source === "live" ? "From verified live listings on Nivaas." : "AI benchmarks aggregated across covered cities."}
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {by_bhk.map((row) => (
                <div key={row.bhk} className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm font-semibold text-muted-foreground">{row.bhk} BHK</p>
                  <p className="mt-1 font-heading text-3xl font-extrabold text-foreground">
                    {fmt(row.avg_rent)}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>Min: {fmt(row.min_rent)}</span>
                    <span>Max: {fmt(row.max_rent)}</span>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((row.avg_rent / (by_bhk[by_bhk.length - 1]?.avg_rent || 1)) * 100)}%` }}
                    />
                  </div>
                  {row.listing_count > 0 && (
                    <p className="mt-2 text-xs text-muted-foreground">{row.listing_count} active listings</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* AI benchmarks by city */}
        {cities.length > 0 && (
          <section className="border-y border-border bg-secondary/40">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                  AI market benchmarks by city
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  <Sparkles className="size-3" /> AI
                </span>
              </div>
              <p className="mt-1 text-muted-foreground">
                Claude-generated rent benchmarks for top localities across {cities.length} Indian cities.
              </p>

              <div className="mt-8 space-y-8">
                {cities.map((city) => {
                  const rows = ai_by_city[city]
                  // Group by locality
                  const localityMap: Record<string, AiBenchmark[]> = {}
                  for (const r of rows) {
                    if (!localityMap[r.locality]) localityMap[r.locality] = []
                    localityMap[r.locality].push(r)
                  }
                  return (
                    <div key={city}>
                      <h3 className="font-heading text-lg font-bold text-foreground">{city}</h3>
                      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-card">
                        <table className="w-full text-sm">
                          <thead className="bg-muted text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <tr>
                              <th className="px-5 py-3">Locality</th>
                              <th className="px-5 py-3 text-right">1 BHK</th>
                              <th className="px-5 py-3 text-right">2 BHK</th>
                              <th className="px-5 py-3 text-right">3 BHK</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {Object.entries(localityMap).map(([locality, bhkRows]) => {
                              const byBhk: Record<number, AiBenchmark> = {}
                              for (const r of bhkRows) byBhk[r.bhk] = r
                              return (
                                <tr key={locality} className="hover:bg-muted/30">
                                  <td className="px-5 py-3 font-medium text-foreground">
                                    {locality}
                                    {bhkRows[0]?.notes && (
                                      <p className="text-xs font-normal text-muted-foreground">{bhkRows[0].notes}</p>
                                    )}
                                  </td>
                                  {[1, 2, 3].map((b) => (
                                    <td key={b} className="px-5 py-3 text-right">
                                      {byBhk[b] ? (
                                        <span className="font-medium text-foreground">{fmt(byBhk[b].avg_rent)}</span>
                                      ) : (
                                        <span className="text-muted-foreground">—</span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )
                })}
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                AI benchmarks are generated by Claude based on market knowledge and refreshed periodically. They are indicative — actual rents may vary based on floor, furnishing, and building condition.
              </p>
            </div>
          </section>
        )}

        {/* Popular localities (live + AI blended) */}
        {by_locality.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Localities at a glance
            </h2>
            <p className="mt-1 text-muted-foreground">
              Live listings ranked first, AI-sourced localities shown below.
            </p>
            <div className="mt-8 space-y-3">
              {by_locality.map((row, i) => (
                <div key={`${row.city}-${row.locality}`} className="rounded-2xl border border-border bg-card px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-foreground">
                          {row.locality}
                          {row.city && <span className="ml-2 text-xs font-normal text-muted-foreground">{row.city}</span>}
                          {row.source === "ai" && (
                            <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                              <Sparkles className="size-3" /> AI
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.listing_count > 0 ? `${row.listing_count} live listings` : "AI benchmark"}
                        </p>
                      </div>
                    </div>
                    <p className="font-heading text-lg font-bold text-foreground">
                      {fmt(row.avg_rent)}
                      <span className="text-sm font-normal text-muted-foreground">/mo avg</span>
                    </p>
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${row.source === "ai" ? "bg-primary/50" : "bg-primary"}`}
                      style={{ width: `${Math.round((row.avg_rent / maxAvgRent) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Demand vs supply — only if live data exists */}
        {demand_supply.length > 0 && (
          <section className="border-y border-border bg-secondary/40">
            <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                Demand vs supply
              </h2>
              <p className="mt-1 text-muted-foreground">
                Enquiries per live listing — higher means more competition for available flats.
              </p>
              <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
                <table className="w-full">
                  <thead className="bg-muted text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-6 py-3">Locality</th>
                      <th className="px-6 py-3 text-right">Live listings</th>
                      <th className="px-6 py-3 text-right">Enquiries</th>
                      <th className="px-6 py-3 text-right">Enquiries / listing</th>
                      <th className="px-6 py-3">Demand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {demand_supply.map((row) => {
                      const d = demandLabel(row.enquiries_per_listing)
                      return (
                        <tr key={row.locality} className="hover:bg-muted/30">
                          <td className="px-6 py-4 font-medium text-foreground">
                            {row.locality}
                            {row.city && <span className="ml-1 text-xs text-muted-foreground">· {row.city}</span>}
                          </td>
                          <td className="px-6 py-4 text-right text-sm text-muted-foreground">{row.live_listings}</td>
                          <td className="px-6 py-4 text-right text-sm text-muted-foreground">{row.total_enquiries}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-3">
                              <div className="w-20">
                                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((row.enquiries_per_listing / maxEpl) * 100)}%` }} />
                                </div>
                              </div>
                              <span className="w-8 text-right font-heading font-bold text-foreground">{row.enquiries_per_listing}x</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${d.color}`}>{d.label}</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <TrendingUp className="mx-auto size-10 text-primary-foreground/80" />
            <h2 className="mx-auto mt-4 max-w-2xl font-heading text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-3xl">
              Find a verified flat in any of these markets
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-primary-foreground/85">
              Every listing is physically inspected. Zero brokerage for tenants.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/search" className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90">
                Browse all listings
              </Link>
              <Link href="/list-property" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                List your property
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
