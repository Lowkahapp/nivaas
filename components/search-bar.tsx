"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

const BHK_OPTIONS = ["Any", "1", "2", "3", "4+"]
const FURNISHING_OPTIONS = ["Any", "Fully Furnished", "Semi Furnished", "Unfurnished"]

export function SearchBar({
  size = "lg",
  defaultValue = "",
  defaultBhk = "Any",
  defaultFurnishing = "Any",
}: {
  size?: "lg" | "md"
  defaultValue?: string
  defaultBhk?: string
  defaultFurnishing?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)
  const [bhk, setBhk] = useState(defaultBhk)
  const [furnishing, setFurnishing] = useState(defaultFurnishing)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    if (bhk !== "Any") params.set("bhk", bhk)
    if (furnishing !== "Any") params.set("furnishing", furnishing)
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const selectClass = `bg-transparent text-foreground focus:outline-none text-sm border-l border-border pl-3 pr-1 cursor-pointer ${
    size === "lg" ? "py-2" : "py-1.5"
  }`

  return (
    <form
      onSubmit={submit}
      className={`flex w-full flex-wrap items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm ${
        size === "lg" ? "sm:p-2.5" : ""
      }`}
    >
      <div className="flex flex-1 items-center gap-2 pl-2 min-w-[160px]">
        <MapPin className="size-5 shrink-0 text-primary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Locality, society or city…"
          aria-label="Search properties"
          className={`w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none ${
            size === "lg" ? "py-2 text-base" : "py-1.5 text-sm"
          }`}
        />
      </div>
      <select
        value={bhk}
        onChange={(e) => setBhk(e.target.value)}
        aria-label="BHK type"
        className={selectClass}
      >
        {BHK_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o === "Any" ? "Any BHK" : `${o} BHK`}
          </option>
        ))}
      </select>
      <select
        value={furnishing}
        onChange={(e) => setFurnishing(e.target.value)}
        aria-label="Furnishing"
        className={selectClass}
      >
        {FURNISHING_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o === "Any" ? "Any Furnishing" : o}
          </option>
        ))}
      </select>
      <Button type="submit" size={size === "lg" ? "lg" : "default"} className="shrink-0 rounded-xl px-4">
        <Search className="size-4" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  )
}
