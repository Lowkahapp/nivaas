import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TrendingUp, Building2, Users, IndianRupee, AlertCircle } from "lucide-react"
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
  avg_rent: number
  listing_count: number
}

interface DemandRow {
  locality: string
  live_listings: number
  total_enquiries: number
  enquiries_per_listing: number
}

interface TrendsData {
  generated_at: string
  summary: {
    overall_avg_rent: number
    total_live_listings: number
    enquiries_this_month: number
  }
  by_bhk: BhkRow[]
  by_locality: LocalityRow[]
  demand_supply: DemandRow[]
}

// ─── Sample fallback data (shown when DB has no listings yet) ─────────────────
const SAMPLE: TrendsData = {
  generated_at: new Date().toISOString(),
  summary: { overall_avg_rent: 28500, total_live_listings: 48, enquiries_this_month: 134 },
  by_bhk: [
    { bhk: 1, avg_rent: 17500, min_rent: 14000, max_rent: 22000, listing_count: 12 },
    { bhk: 2, avg_rent: 27000, min_rent: 20000, max_rent: 38000, listing_count: 22 },
    { bhk: 3, avg_rent: 41000, min_rent: 32000, max_rent: 52000, listing_count: 11 },
    { bhk: 4, avg_rent: 58000, min_rent: 48000, max_rent: 72000, listing_count: 3 },
  ],
  by_locality: [
    { locality: "Hinjewadi Phase 3", avg_rent: 29000, listing_count: 18 },
    { locality: "Hinjewadi Phase 1", avg_rent: 26000, listing_count: 12 },
    { locality: "Baner", avg_rent: 31000, listing_count: 8 },
    { locality: "Wakad", avg_rent: 24000, listing_count: 6 },
    { locality: "Kharadi", avg_rent: 28000, listing_count: 4 },
  ],
  demand_supply: [
    { locality: "Hinjewadi Phase 3", live_listings: 18, total_enquiries: 72, enquiries_per_listing: 4.0 },
    { locality: "Baner", live_listings: 8, total_enquiries: 28, enquiries_per_listing: 3.5 },
    { locality: "Hinjewadi Phase 1", live_listings: 12, total_enquiries: 38, enquiries_per_listing: 3.2 },
    { locality: "Wakad", live_listings: 6, total_enquiries: 16, enquiries_per_listing: 2.7 },
    { locality: "Kharadi", live_listings: 4, total_enquiries: 9, enquiries_per_listing: 2.3 },
  ],
}

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function fetchTrends(): Promise<{ data: TrendsData; live: boolean }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    const res = await fetch(`${apiUrl}/api/trends`, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error("API error")
    const data: TrendsData = await res.json()
    const hasData = data.summary.total_live_listings > 0
    return { data: hasData ? data : SAMPLE, live: hasData }
  } catch {
    return { data: SAMPLE, live: false }
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatINR(n: number) {
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
  const { data, live } = await fetchTrends()
  const { summary, by_bhk, by_locality, demand_supply } = data

  const maxAvgRent = Math.max(...by_locality.map((l) => l.avg_rent), 1)
  const maxListings = Math.max(...by_locality.map((l) => l.listing_count), 1)
  const maxEpl = Math.max(...demand_supply.map((d) => d.enquiries_per_listing), 1)

  const updatedAt = new Date(data.generated_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-sm font-medium text-primary-foreground">
                  <TrendingUp className="size-4" />
                  Updated {updatedAt}
                </span>
                <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
                  Rental Trends
                </h1>
                <p className="mt-3 max-w-xl text-lg text-primary-foreground/85">
                  Live data on average rents, most active localities, and demand signals — drawn from verified listings and enquiries on Nivaas.
                </p>
              </div>
            </div>

            {/* Summary stats */}
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { icon: IndianRupee, label: "Overall avg rent / mo", value: formatINR(summary.overall_avg_rent) },
                { icon: Building2, label: "Live verified listings", value: summary.total_live_listings.toString() },
                { icon: Users, label: "Visit enquiries this month", value: summary.enquiries_this_month.toString() },
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

        {!live && (
          <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              <AlertCircle className="size-5 shrink-0 text-yellow-500" />
              Showing sample data — live figures will appear once listings are in the database.
            </div>
          </div>
        )}

        {/* BHK average rents */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Average rent by BHK type
          </h2>
          <p className="mt-1 text-muted-foreground">Across all verified live listings on Nivaas.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {by_bhk.map((row) => (
              <div key={row.bhk} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-semibold text-muted-foreground">{row.bhk} BHK</p>
                <p className="mt-1 font-heading text-3xl font-extrabold text-foreground">
                  {formatINR(row.avg_rent)}
                  <span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
                <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                  <span>Min: {formatINR(row.min_rent)}</span>
                  <span>Max: {formatINR(row.max_rent)}</span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.round((row.avg_rent / (by_bhk[by_bhk.length - 1]?.avg_rent || 1)) * 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{row.listing_count} active listings</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Tip: Click "Search" above to filter listings by BHK and price range.{" "}
            <Link href="/search" className="text-primary hover:underline">Browse listings →</Link>
          </p>
        </section>

        {/* Locality breakdown */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Most popular localities
            </h2>
            <p className="mt-1 text-muted-foreground">Ranked by number of verified listings, with average rent.</p>

            <div className="mt-8 space-y-4">
              {by_locality.map((row, i) => (
                <div key={row.locality} className="rounded-2xl border border-border bg-card px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-heading font-bold text-foreground">{row.locality}</p>
                        <p className="text-sm text-muted-foreground">{row.listing_count} listings</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg font-bold text-foreground">{formatINR(row.avg_rent)}<span className="text-sm font-normal text-muted-foreground">/mo avg</span></p>
                    </div>
                  </div>
                  {/* Dual bar: listings + rent */}
                  <div className="mt-4 space-y-2">
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                        <span>Listings</span>
                        <span>{row.listing_count}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${Math.round((row.listing_count / maxListings) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                        <span>Avg rent vs highest</span>
                        <span>{formatINR(row.avg_rent)}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-accent"
                          style={{ width: `${Math.round((row.avg_rent / maxAvgRent) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Demand vs Supply */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Demand vs supply by locality
          </h2>
          <p className="mt-1 text-muted-foreground">
            Enquiries per live listing — a higher number means more competition for available flats.
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
                      <td className="px-6 py-4 font-medium text-foreground">{row.locality}</td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">{row.live_listings}</td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground">{row.total_enquiries}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24">
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${Math.round((row.enquiries_per_listing / maxEpl) * 100)}%` }}
                              />
                            </div>
                          </div>
                          <span className="w-8 text-right font-heading font-bold text-foreground">{row.enquiries_per_listing}x</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${d.color}`}>
                          {d.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            High demand localities have fewer available flats relative to interest. If you're searching in these areas, act quickly.
          </p>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <TrendingUp className="mx-auto size-10 text-primary-foreground/80" />
            <h2 className="mx-auto mt-4 max-w-2xl font-heading text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-3xl">
              Find a verified flat in any of these localities
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-primary-foreground/85">
              Every listing is physically inspected. Zero brokerage for tenants.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
              >
                Browse all listings
              </Link>
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
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
