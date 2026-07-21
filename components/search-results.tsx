"use client"

import { useMemo, useState } from "react"
import { SlidersHorizontal, MapPin, X } from "lucide-react"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { type Listing } from "@/lib/listings"

const BHK_OPTIONS = [
  { label: "Any BHK", value: -1 },
  { label: "1 BHK", value: 1 },
  { label: "2 BHK", value: 2 },
  { label: "3 BHK", value: 3 },
]

const FURNISHING_OPTIONS = ["Any", "Fully Furnished", "Semi Furnished", "Unfurnished"]

const RENT_OPTIONS = [
  { label: "Any rent", value: 1000000 },
  { label: "Under ₹20,000", value: 20000 },
  { label: "Under ₹25,000", value: 25000 },
  { label: "Under ₹30,000", value: 30000 },
  { label: "Under ₹40,000", value: 40000 },
]

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Rent: Low to High", value: "price-asc" },
  { label: "Rent: High to Low", value: "price-desc" },
  { label: "Top rated", value: "rating" },
]

export function SearchResults({
  listings,
  initialQuery = "",
  initialBhk = -1,
  initialFurnishing = "Any",
  initialMaxRent = 1000000,
  initialMinRent = 0,
}: {
  listings: Listing[]
  initialQuery?: string
  initialBhk?: number
  initialFurnishing?: string
  initialMaxRent?: number
  initialMinRent?: number
}) {
  const [query, setQuery] = useState(initialQuery)
  const [bhk, setBhk] = useState(initialBhk)
  const [furnishing, setFurnishing] = useState(initialFurnishing)
  const [maxRent, setMaxRent] = useState(initialMaxRent)
  const [minRent, setMinRent] = useState(initialMinRent)
  const [reraOnly, setReraOnly] = useState(false)
  const [parkingOnly, setParkingOnly] = useState(false)
  const [sort, setSort] = useState("recommended")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const result = listings.filter((l) => {
      if (q) {
        const haystack =
          `${l.name} ${l.tower} ${l.locality} ${l.address} ${l.furnishing} ${l.bhk} bhk`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      if (bhk >= 0 && l.bhk !== bhk) return false
      if (furnishing !== "Any" && l.furnishing !== furnishing) return false
      if (l.rent > maxRent) return false
      if (minRent > 0 && l.rent < minRent) return false
      if (reraOnly && !l.reraVerified) return false
      if (parkingOnly && !l.parking) return false
      return true
    })

    const sorted = [...result]
    if (sort === "price-asc") sorted.sort((a, b) => a.rent - b.rent)
    else if (sort === "price-desc") sorted.sort((a, b) => b.rent - a.rent)
    else if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating)
    else sorted.sort((a, b) => b.rating - a.rating)
    return sorted
  }, [listings, query, bhk, furnishing, maxRent, minRent, reraOnly, parkingOnly, sort])

  const hasFilters =
    bhk !== -1 || furnishing !== "Any" || maxRent !== 1000000 || minRent > 0 || reraOnly || parkingOnly

  function reset() {
    setBhk(-1)
    setFurnishing("Any")
    setMaxRent(1000000)
    setMinRent(0)
    setReraOnly(false)
    setParkingOnly(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Search input */}
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-2">
        <MapPin className="ml-2 size-5 shrink-0 text-primary" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by society, BHK, or furnishing"
          aria-label="Search properties"
          className="w-full bg-transparent py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="mr-1 flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Filter bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Select label="Rent" value={maxRent} onChange={(v) => setMaxRent(Number(v))} options={RENT_OPTIONS} />
        <Select
          label="BHK"
          value={bhk}
          onChange={(v) => setBhk(Number(v))}
          options={BHK_OPTIONS}
        />
        <Select
          label="Furnishing"
          value={furnishing}
          onChange={(v) => setFurnishing(String(v))}
          options={FURNISHING_OPTIONS.map((t) => ({ label: t, value: t }))}
        />
        <Toggle active={reraOnly} onClick={() => setReraOnly((p) => !p)}>
          RERA verified
        </Toggle>
        <Toggle active={parkingOnly} onClick={() => setParkingOnly((p) => !p)}>
          Parking
        </Toggle>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            <SlidersHorizontal className="size-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Results header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-lg font-bold text-foreground">
          {filtered.length} {filtered.length === 1 ? "property" : "properties"}
          {query ? ` for "${query}"` : " available"}
        </h1>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-9 rounded-lg border border-border bg-card px-2 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <p className="font-heading text-lg font-bold text-foreground">No properties match your filters</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try adjusting your filters or search terms. We add new verified properties regularly.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium transition-colors ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string | number
  onChange: (v: string | number) => void
  options: { label: string; value: string | number }[]
}) {
  return (
    <label className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-sm">
      <span className="font-medium text-muted-foreground">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent font-medium text-foreground focus:outline-none"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}
