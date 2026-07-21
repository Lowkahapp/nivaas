import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const openRoles = [
  {
    title: "Field Verification Executive",
    location: "Pune",
    type: "Full-time",
    department: "Operations",
    description: "Visit and document rental properties across Pune. You'll be the person who ensures every listing on Nivaas is exactly what we promise. Requires a two-wheeler and excellent attention to detail.",
  },
  {
    title: "Relationship Manager – Tenants",
    location: "Pune",
    type: "Full-time",
    department: "Customer Success",
    description: "Be the single point of contact for tenants from their first enquiry to move-in. Schedule visits, answer questions, coordinate with landlords, and close leases. Strong communication skills in English, Hindi, and Marathi preferred.",
  },
  {
    title: "Full Stack Engineer",
    location: "Remote",
    type: "Full-time",
    department: "Engineering",
    description: "Work on the Nivaas platform — Next.js frontend, Node/Postgres backend. You'll build features that directly improve how thousands of people find homes. We ship fast and keep the codebase clean.",
  },
  {
    title: "Growth & Partnerships Manager",
    location: "Pune",
    type: "Full-time",
    department: "Growth",
    description: "Own landlord acquisition, corporate tie-ups, and city expansion. If you've run B2B sales or partnerships in real estate or proptech, we'd love to talk.",
  },
]

const perks = [
  "Competitive salary + performance bonus",
  "Flexible working hours",
  "Health insurance for you and your family",
  "Annual learning & development budget",
  "Work directly with the founding team",
  "Make a visible impact from day one",
]

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            Careers at Nivaas
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/85">
            We're building the most trusted rental platform in India. Join a small, fast-moving team that cares deeply about doing things right.
          </p>
        </section>

        {/* Why Nivaas */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Why work here
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Nivaas is early-stage, which means you'll have real ownership of your work. There's no committee approval for every decision — if you spot a problem, you'll have the room to fix it.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We're a team that obsesses over the details that make a big difference: is the listing accurate? Did the tenant feel supported? Was the move-in smooth? If you care about that kind of quality, you'll fit in.
              </p>
              <ul className="mt-8 space-y-3">
                {perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-3 text-sm text-foreground">
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-8">
              <p className="font-heading text-4xl font-extrabold text-foreground">~20</p>
              <p className="mt-1 text-muted-foreground">team members and growing</p>
              <p className="mt-6 font-heading text-4xl font-extrabold text-foreground">Pune</p>
              <p className="mt-1 text-muted-foreground">headquartered, with remote roles open</p>
              <p className="mt-6 font-heading text-4xl font-extrabold text-foreground">Series&nbsp;A</p>
              <p className="mt-1 text-muted-foreground">fundraise in progress for city expansion</p>
            </div>
          </div>
        </section>

        {/* Open roles */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Open roles
            </h2>
            <div className="mt-8 space-y-4">
              {openRoles.map((role) => (
                <div key={role.title} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-foreground">{role.title}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3.5" />
                          {role.location}
                        </span>
                        <span>{role.type}</span>
                        <span>{role.department}</span>
                      </div>
                    </div>
                    <a
                      href={`mailto:careers@nivaas.in?subject=Application: ${role.title}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                      Apply
                      <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{role.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* General interest */}
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Don't see your role?
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We're always interested in exceptional people. If you believe in what we're building and think you can contribute, send us a note with what you'd like to work on.
          </p>
          <a
            href="mailto:careers@nivaas.in"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Email us at careers@nivaas.in
          </a>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
