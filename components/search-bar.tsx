"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SearchBar({
  size = "lg",
  defaultValue = "",
}: {
  size?: "lg" | "md"
  defaultValue?: string
}) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`)
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm ${
        size === "lg" ? "sm:p-2.5" : ""
      }`}
    >
      <div className="flex flex-1 items-center gap-2 pl-2">
        <MapPin className="size-5 shrink-0 text-primary" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find your perfect home..."
          aria-label="Search properties"
          className={`w-full bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none ${
            size === "lg" ? "py-2 text-base" : "py-1.5 text-sm"
          }`}
        />
      </div>
      <Button type="submit" size={size === "lg" ? "lg" : "default"} className="shrink-0 rounded-xl px-4">
        <Search className="size-4" />
        <span className="hidden sm:inline">Search</span>
      </Button>
    </form>
  )
}
