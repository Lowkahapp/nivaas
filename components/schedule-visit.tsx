"use client"

import { useState } from "react"
import { CalendarCheck, CheckCircle2, Phone, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatINR, type Listing } from "@/lib/listings"

export function ScheduleVisit({ listing }: { listing: Listing }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [date, setDate] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
      const response = await fetch(`${apiUrl}/api/visit-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: parseInt(listing.id.split("-").pop() || "1"),
          tenant_name: name,
          tenant_phone: phone,
          tenant_email: email,
          preferred_date: date,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error || "Failed to request visit")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Monthly rent</p>
          <p className="font-heading text-2xl font-extrabold text-foreground">
            {formatINR(listing.rent)}
            <span className="text-base font-medium text-muted-foreground">/mo</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Deposit</p>
          <p className="font-heading text-lg font-bold text-foreground">
            {formatINR(listing.deposit)}
          </p>
        </div>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        + {formatINR(listing.maintenance)}/mo maintenance
      </p>

      {submitted ? (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-primary/30 bg-primary/5 px-4 py-6 text-center">
          <CheckCircle2 className="size-8 text-primary" />
          <p className="mt-2 font-heading text-base font-bold text-foreground">Visit requested!</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your Nivaas relationship manager will call <span className="font-medium text-foreground">{phone}</span> within 2 hours to confirm your visit slot.
          </p>
          {email && (
            <p className="mt-1 text-xs text-muted-foreground">
              A confirmation will also be sent to <span className="font-medium">{email}</span>.
            </p>
          )}
          {date && (
            <p className="mt-2 text-xs text-muted-foreground">
              Preferred date: <span className="font-medium text-foreground">{new Date(date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
            </p>
          )}
        </div>
      ) : error ? (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center">
          <AlertCircle className="size-8 text-red-600" />
          <p className="mt-2 font-heading text-base font-bold text-red-900">Request failed</p>
          <p className="mt-1 text-sm text-red-800">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => setError("")}>
            Try again
          </Button>
        </div>
      ) : (
        <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            aria-label="Full name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile number"
            aria-label="Mobile number"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (for confirmation)"
            aria-label="Email address"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            aria-label="Preferred visit date"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            <CalendarCheck className="size-4" />
            {loading ? "Scheduling..." : "Schedule a visit"}
          </Button>
        </form>
      )}

      <a
        href={`tel:${listing.phone.replace(/[^0-9+]/g, "")}`}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
      >
        <Phone className="size-4" />
        {listing.phone}
      </a>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {listing.ownerType === "Nivaas Managed"
          ? "Managed end-to-end by Nivaas"
          : `Listed by ${listing.ownerName} · Verified by Nivaas`}
      </p>
    </div>
  )
}
