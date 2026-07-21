import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BadgeCheck, Headset, ShieldCheck, Search, CalendarCheck, KeyRound, Star } from "lucide-react"
import Link from "next/link"

const tenantSteps = [
  {
    icon: Search,
    title: "Search verified listings",
    body: "Use our filters to narrow down by BHK, furnishing, budget, and locality. Every listing on Nivaas has been physically inspected by our team — no fake photos, no incorrect details.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule a visit",
    body: "Submit a visit request online. Your dedicated relationship manager calls you within 2 hours to confirm the slot. We arrange back-to-back visits at multiple properties if needed — you don't have to coordinate anything.",
  },
  {
    icon: BadgeCheck,
    title: "See exactly what's listed",
    body: "The flat you visit is the flat in the photos. Rent, deposit, maintenance, amenities — all pre-confirmed. No bait-and-switch, no surprises on arrival.",
  },
  {
    icon: KeyRound,
    title: "Move in, stress-free",
    body: "Once you pick a property, we draft the lease, collect documents, and handle the entire agreement process. Your manager coordinates the move-in and handover so you can focus on settling in.",
  },
]

const verificationSteps = [
  {
    icon: BadgeCheck,
    title: "Physical field inspection",
    body: "Our field executive visits every property in person. They verify the actual dimensions, photograph every room, and confirm amenities are functional — air conditioning, geysers, appliances, parking.",
  },
  {
    icon: ShieldCheck,
    title: "RERA & document check",
    body: "We check the project's RERA registration status, confirm the occupancy certificate has been issued, and verify the landlord's ownership documents.",
  },
  {
    icon: Star,
    title: "Quality rating",
    body: "Properties are rated on construction quality, maintenance standard, natural light, ventilation, and building management. Only properties scoring above our threshold are published.",
  },
  {
    icon: Headset,
    title: "Listing accuracy audit",
    body: "Before going live, a second team member reviews the listing details against field notes. Any discrepancy — even a minor one — is corrected or the listing is held until clarified.",
  },
]

const stats = [
  { value: "48 hrs", label: "Average verification time" },
  { value: "100%", label: "Field-inspected listings" },
  { value: "0", label: "Broker fees for tenants" },
  { value: "24/7", label: "Relationship manager support" },
]

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            How Nivaas works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/85">
            From search to move-in, every step is designed to eliminate the uncertainty, wasted visits, and paperwork stress that comes with renting in India.
          </p>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading text-3xl font-extrabold text-foreground">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For tenants */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            For tenants — how to find and move into your flat
          </h2>
          <p className="mt-2 text-muted-foreground">Four steps, handled mostly by us.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tenantSteps.map((step, i) => (
              <div key={step.title} className="relative rounded-2xl border border-border bg-card p-6">
                <span className="absolute right-4 top-4 font-heading text-4xl font-extrabold text-primary/10">
                  0{i + 1}
                </span>
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse verified homes
            </Link>
          </div>
        </section>

        {/* Verification process */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              How we verify every property
            </h2>
            <p className="mt-2 text-muted-foreground">
              Before a listing goes live on Nivaas, it passes a 4-stage verification process.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {verificationSteps.map((step) => (
                <div key={step.title} className="flex gap-5 rounded-2xl border border-border bg-card p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Difference section */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            The Nivaas difference
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Most rental platforms are aggregators — they list whatever landlords upload, without checking if the photos match the reality, if the rent is correct, or if the owner even has the right to rent the property. Nivaas is different because we treat every listing as a product we stand behind. If you visit a Nivaas property and find something materially different from the listing, we refund your visit and escalate immediately.
          </p>
          <div className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            {[
              { label: "Fake or misleading photos", nivaas: "Never — field photos only", others: "Common on aggregators" },
              { label: "Wrong rent quoted", nivaas: "Confirmed before listing", others: "Often negotiated on arrival" },
              { label: "Broker fee", nivaas: "Zero for tenants", others: "Typically 1–2 months rent" },
              { label: "Visit coordination", nivaas: "We handle everything", others: "You call the broker repeatedly" },
            ].map((row) => (
              <div key={row.label} className="rounded-xl border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{row.label}</p>
                <p className="mt-2 text-sm font-semibold text-primary">{row.nivaas}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{row.others}</p>
              </div>
            ))}
          </div>
          <Link
            href="/search"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start searching
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
