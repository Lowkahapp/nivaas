import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle2, ClipboardList, UserCheck, FileText, Key, Phone } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    icon: ClipboardList,
    title: "Property intake",
    body: "Our team visits your property, photographs every room, verifies dimensions and amenities, and creates a verified listing — all within 48 hours of you submitting.",
  },
  {
    icon: UserCheck,
    title: "Qualified tenant sourcing",
    body: "We market your flat to a curated pool of working professionals, IT employees, and families. Every enquiry is pre-screened for employment, income, and references before a visit is arranged.",
  },
  {
    icon: FileText,
    title: "Paperwork & agreement",
    body: "Our team prepares the lease agreement, collects KYC documents, and handles the security deposit transfer. You sign once — we manage the rest.",
  },
  {
    icon: Key,
    title: "Move-in & handover",
    body: "We coordinate the key handover, document the property condition with a signed inventory checklist, and ensure a smooth move-in for the tenant.",
  },
]

const included = [
  "Professional photography & virtual tour",
  "Verified listing on Nivaas platform",
  "Tenant shortlisting & background check",
  "Income & employment verification",
  "Lease drafting & agreement execution",
  "Security deposit handling",
  "Move-in condition documentation",
  "Dedicated relationship manager",
]

export default function ConciergePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            Concierge management
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/85">
            Hand over your keys. We handle everything — listing, tenant search, paperwork, and move-in — so you earn rental income without the landlord headaches.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
            >
              List your property
            </Link>
            <a
              href="tel:+918888000000"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              <Phone className="size-4" />
              Talk to us
            </a>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            How our concierge service works
          </h2>
          <p className="mt-2 text-muted-foreground">From listing to lease in as little as 10 days.</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
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
        </section>

        {/* What's included */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Everything included. No hidden charges.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Our concierge fee is a one-time charge paid only when your flat is successfully rented. No upfront costs, no monthly retainers.
                </p>
                <ul className="mt-8 space-y-3">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Concierge fee</p>
                <p className="mt-2 font-heading text-5xl font-extrabold text-foreground">1 month</p>
                <p className="mt-1 text-muted-foreground">of rent, paid on successful lease signing</p>
                <p className="mt-4 text-sm text-muted-foreground">Zero cost if we don't find you a tenant.</p>
                <Link
                  href="/list-property"
                  className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Get started — it's free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Common questions
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                q: "How long does it take to find a tenant?",
                a: "Most properties are rented within 7–15 days of listing. Premium, well-priced flats often rent in under a week.",
              },
              {
                q: "Do I need to be present during visits?",
                a: "No. Our team accompanies all prospective tenants. We brief you after each visit and share feedback.",
              },
              {
                q: "What if the tenant leaves early?",
                a: "Our lease template includes a standard lock-in period. If a tenant breaks the lease early, the security deposit covers your exposure.",
              },
              {
                q: "Is my property eligible?",
                a: "We accept flats in residential societies across the cities we operate in. Our team will confirm eligibility during the first call.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-border bg-card p-5">
                <p className="font-heading font-bold text-foreground">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
