import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShieldCheck, AlertCircle, FileText, CheckCircle2, ExternalLink } from "lucide-react"
import Link from "next/link"

const steps = [
  {
    n: "01",
    title: "Check if registration applies",
    body: "Under RERA, projects of 500 sq m or more, or with 8 or more apartments, require developer registration. Individual landlords renting existing completed flats are generally not required to register — but confirming your project's status is important.",
  },
  {
    n: "02",
    title: "Verify your project's RERA number",
    body: "If your building was sold to you by a developer, that developer was required to register the project. You can look up the RERA registration number for your society on your state's RERA portal and confirm it is valid and not under complaint.",
  },
  {
    n: "03",
    title: "Display RERA details in your listing",
    body: "Displaying a valid RERA registration number in your rental listing signals legitimacy to tenants. Nivaas automatically shows the RERA status on verified listings — a key reason our properties get more enquiries.",
  },
  {
    n: "04",
    title: "Use a compliant rental agreement",
    body: "While RERA primarily governs sale transactions, your leave-and-licence agreement must comply with local rent control laws. Our team prepares agreements that are legally sound and register them where required.",
  },
]

const statePortals = [
  { state: "Maharashtra", authority: "MahaRERA", url: "https://maharerait.mahaonline.gov.in" },
  { state: "Karnataka", authority: "RERA Karnataka", url: "https://rera.karnataka.gov.in" },
  { state: "Delhi", authority: "Delhi RERA", url: "https://rera.delhi.gov.in" },
  { state: "Telangana", authority: "TSRERA", url: "https://rera.telangana.gov.in" },
  { state: "Tamil Nadu", authority: "TNRERA", url: "https://www.tnrera.in" },
  { state: "Haryana", authority: "Haryana RERA", url: "https://haryanarera.gov.in" },
]

const faqs = [
  {
    q: "Do I need to register with RERA to rent my flat?",
    a: "No. RERA registration is required for real estate developers marketing and selling projects, not for individual landlords renting out completed flats. However, your society's developer should have registered the project, and you can verify that status.",
  },
  {
    q: "What does RERA verification mean on a Nivaas listing?",
    a: "It means our team has confirmed the project in which the flat is located has a valid, active RERA registration number and is not under any official complaint or freeze order.",
  },
  {
    q: "Can a tenant break the lease citing RERA?",
    a: "RERA does not govern rental agreements between landlords and tenants. Rental disputes are covered under the Transfer of Property Act and state rent control laws. A well-drafted leave-and-licence agreement is your best protection.",
  },
  {
    q: "What if my society doesn't have a RERA number?",
    a: "Older projects (approved before May 2017) may be exempt from RERA registration in some states. Our team will note this on your listing and clarify the project status to prospective tenants.",
  },
]

export default function ReraGuidancePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            RERA guidance for landlords
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/85">
            Understand what RERA means for your rental property, how to verify your project's status, and how Nivaas helps you stay compliant and attract better tenants.
          </p>
        </section>

        {/* What is RERA */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                What is RERA?
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The Real Estate (Regulation and Development) Act, 2016 — commonly known as RERA — was enacted to bring transparency and accountability to India's real estate sector. It requires developers to register their residential projects with the state RERA authority, disclose project details publicly, and adhere to delivery timelines.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                For landlords renting existing completed flats, RERA does not impose direct obligations — but verifying your project's registration status protects you legally and makes your listing more credible to qualified tenants.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-1 size-6 shrink-0 text-yellow-500" />
                <div>
                  <p className="font-heading font-bold text-foreground">Key distinction</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    RERA governs <strong>developers selling projects</strong>. Individual landlords renting out completed apartments are <strong>not required to register</strong> — but you benefit from ensuring your project has valid RERA status.
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-start gap-4">
                <ShieldCheck className="mt-1 size-6 shrink-0 text-primary" />
                <div>
                  <p className="font-heading font-bold text-foreground">What Nivaas checks</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    We verify that your society's developer registration is active, that the occupancy certificate has been issued, and that no complaints are pending against the project on the state portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              What you should do as a landlord
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {steps.map((step) => (
                <div key={step.n} className="rounded-2xl border border-border bg-card p-6">
                  <span className="font-heading text-3xl font-extrabold text-primary/30">{step.n}</span>
                  <h3 className="mt-2 font-heading text-base font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* State portals */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            State RERA portals
          </h2>
          <p className="mt-2 text-muted-foreground">
            Check your project's registration status directly on your state's official portal.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statePortals.map((p) => (
              <a
                key={p.state}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
              >
                <div>
                  <p className="font-heading font-bold text-foreground">{p.state}</p>
                  <p className="text-sm text-muted-foreground">{p.authority}</p>
                </div>
                <ExternalLink className="size-4 shrink-0 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>

        {/* Nivaas RERA check */}
        <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <FileText className="mx-auto size-10 text-primary-foreground/80" />
            <h2 className="mx-auto mt-4 max-w-2xl font-heading text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-3xl">
              We handle the RERA check for you
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-primary-foreground/85">
              When you list with Nivaas, our verification team checks your project's RERA status, occupancy certificate, and ownership documents. Your listing displays the verified badge — giving tenants confidence and giving you fewer questions to answer.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {["RERA status verified", "OC confirmed", "Ownership checked", "Zero surprises"].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium text-primary-foreground">
                  <CheckCircle2 className="size-4" />
                  {badge}
                </span>
              ))}
            </div>
            <Link
              href="/list-property"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90"
            >
              List your property
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">Frequently asked</h2>
          <div className="mt-8 space-y-4">
            {faqs.map(({ q, a }) => (
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
