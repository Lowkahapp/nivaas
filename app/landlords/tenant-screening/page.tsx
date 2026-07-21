import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShieldCheck, Briefcase, CreditCard, Users, FileSearch, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const checks = [
  {
    icon: Briefcase,
    title: "Employment verification",
    body: "We confirm the tenant's employer, designation, and tenure directly with their HR department. We accept offer letters and salary slips but independently verify them.",
  },
  {
    icon: CreditCard,
    title: "Income & rent affordability",
    body: "We check that monthly rent does not exceed 33% of the tenant's take-home pay. Salary slips for the last 3 months are reviewed and cross-checked.",
  },
  {
    icon: FileSearch,
    title: "Identity & address check",
    body: "Aadhaar, PAN, and passport are collected and verified. We confirm the tenant's current residential address against their documents.",
  },
  {
    icon: Users,
    title: "Reference checks",
    body: "We speak with at least one previous landlord and one personal reference. Any history of property damage, late payments, or disputes is flagged immediately.",
  },
  {
    icon: ShieldCheck,
    title: "Police verification assistance",
    body: "We guide tenants through the online police verification process required in most cities and confirm completion before move-in.",
  },
]

const tiers = [
  {
    name: "Standard",
    price: "₹999",
    features: [
      "Identity document verification",
      "Employment confirmation",
      "Income check",
      "Signed tenant declaration",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Comprehensive",
    price: "₹1,999",
    features: [
      "Everything in Standard",
      "Reference checks (2 contacts)",
      "Previous landlord call",
      "Police verification guidance",
      "Detailed PDF screening report",
    ],
    cta: "Most popular",
    highlight: true,
  },
]

export default function TenantScreeningPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            Tenant screening
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/85">
            Know exactly who is moving into your property. Our multi-layer screening gives you verified employment, income, identity, and reference checks — all before you hand over the keys.
          </p>
          <div className="mt-8">
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
            >
              List your property
            </Link>
          </div>
        </section>

        {/* Checks */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            What we verify
          </h2>
          <p className="mt-2 text-muted-foreground">
            Every shortlisted tenant goes through our 5-point screening before we recommend them to you.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {checks.map((check) => (
              <div key={check.title} className="rounded-2xl border border-border bg-card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <check.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground">{check.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{check.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Screening packages
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              Use our screening standalone or as part of our concierge service.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl border p-8 ${
                    tier.highlight
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card"
                  }`}
                >
                  <p className={`text-sm font-semibold uppercase tracking-widest ${tier.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {tier.name}
                  </p>
                  <p className={`mt-2 font-heading text-4xl font-extrabold ${tier.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                    {tier.price}
                  </p>
                  <p className={`mt-1 text-sm ${tier.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>per tenant screened</p>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${tier.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                        <CheckCircle2 className={`mt-0.5 size-4 shrink-0 ${tier.highlight ? "text-primary-foreground" : "text-primary"}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/list-property"
                    className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-6 py-3 font-semibold transition-colors ${
                      tier.highlight
                        ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why it matters */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Why landlords trust our screening
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            In India, once a tenant occupies a property it can take months — sometimes longer — to legally recover possession if something goes wrong. The best protection is getting it right before move-in. Our screening process has helped landlords across Pune and Bangalore avoid problem tenancies and maintain zero-dispute rental income.
          </p>
          <Link
            href="/list-property"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            List and screen for free
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
