import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, BadgeCheck, Headset, ArrowRight, Building2, MapPin, IndianRupee } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SearchBar } from "@/components/search-bar"
import { ListingCard } from "@/components/listing-card"
import { listings } from "@/lib/listings"

const perks = [
  {
    icon: BadgeCheck,
    title: "100% field-verified",
    body: "Our team physically inspects every flat. The photos, rent, and amenities you see are exactly what you get.",
  },
  {
    icon: Headset,
    title: "Concierge service",
    body: "A dedicated relationship manager schedules your visits, negotiates, and handles paperwork end to end.",
  },
  {
    icon: ShieldCheck,
    title: "RERA & document checks",
    body: "We verify RERA status and ownership documents so you rent with zero legal surprises.",
  },
]

const steps = [
  { n: "01", title: "Tell us what you need", body: "Filter by BHK, furnishing, and budget across Hinjewadi Phase 3." },
  { n: "02", title: "We schedule visits", body: "Your manager arranges back-to-back visits at verified flats only." },
  { n: "03", title: "Move in stress-free", body: "We handle the agreement, deposit, and handover for you." },
]

export default function HomePage() {
  const featured = listings.slice(0, 3)
  const verifiedCount = listings.filter((l) => l.fieldVerified).length

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative">
          <div className="absolute inset-0">
            <Image
              src="/images/hero-city.png"
              alt="Modern residential towers in Hinjewadi, Pune at sunset"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-foreground/60" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-background/15 px-3 py-1 text-sm font-medium text-background backdrop-blur">
                <MapPin className="size-4" />
                Hinjewadi Phase 3, Pune
              </span>
              <h1 className="mt-4 font-heading text-4xl font-extrabold leading-tight tracking-tight text-background text-balance sm:text-5xl lg:text-6xl">
                Verified furnished flats, minutes from your office
              </h1>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-background/90 text-pretty">
                Nivaas lists only 100% manually verified 2 BHK homes near the Rajiv Gandhi Infotech
                Park, with a concierge who handles visits and paperwork for you.
              </p>
              <div className="mt-8">
                <SearchBar />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-background/90">
                <span>Popular:</span>
                {["Megapolis", "Mont Vert", "Rohan Ananta", "Fully Furnished"].map((c) => (
                  <Link
                    key={c}
                    href={`/search?q=${encodeURIComponent(c)}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
            <Stat value={`${verifiedCount}+`} label="Verified flats live" />
            <Stat value="100%" label="Physically inspected" />
            <Stat value="< 3 km" label="From major IT parks" />
            <Stat value="10/week" label="Successful leases" />
          </div>
        </section>

        {/* Perks */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Renting near Hinjewadi, minus the headaches
            </h2>
            <p className="mt-2 text-muted-foreground">
              No fake listings, no surprise brokerage, no endless site visits.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {perks.map((perk) => (
              <div key={perk.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <perk.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{perk.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{perk.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              How Nivaas works
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.n} className="rounded-2xl border border-border bg-card p-6">
                  <span className="font-heading text-3xl font-extrabold text-primary/30">{step.n}</span>
                  <h3 className="mt-2 font-heading text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured listings */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Verified homes ready to move in
              </h2>
              <p className="mt-2 text-muted-foreground">Hand-picked flats you can visit this week.</p>
            </div>
            <Link
              href="/search"
              className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:flex"
            >
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-8 sm:hidden">
            <Link
              href="/search"
              className="flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all rentals
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
              <Building2 className="size-6" />
            </span>
            <h2 className="mx-auto mt-4 max-w-2xl font-heading text-2xl font-extrabold tracking-tight text-primary-foreground text-balance sm:text-3xl">
              Own a flat in Hinjewadi Phase 3? Let us rent it for you.
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-primary-foreground/85">
              List with Nivaas and our concierge team finds verified, screened tenants, handles
              visits, and manages the paperwork.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/list-property"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-accent-foreground transition-colors hover:bg-accent/90"
              >
                <IndianRupee className="size-4" />
                List your flat
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}
