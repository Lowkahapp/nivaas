import type { Metadata } from "next"
import { BadgeCheck, Headset, Users } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ListPropertyForm } from "@/components/list-property-form"

export const metadata: Metadata = {
  title: "List your property — Nivaas",
  description:
    "List your apartment with Nivaas. We verify, market, and manage it end to end to find screened tenants fast.",
}

const benefits = [
  {
    icon: BadgeCheck,
    title: "Free verification",
    body: "Our team inspects and photographs your property at no cost.",
  },
  {
    icon: Users,
    title: "Screened tenants",
    body: "We match you with verified, qualified professionals looking to move in.",
  },
  {
    icon: Headset,
    title: "Concierge handling",
    body: "Visits, agreement, and handover managed for you.",
  },
]

export default function ListPropertyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
              List your property with us
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground text-pretty">
              Tell us about your property and our team will verify and market it to screened tenants.
              It is free to list, and you stay in control.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ListPropertyForm />
            </div>
            <aside className="space-y-4">
              {benefits.map((b) => (
                <div key={b.title} className="rounded-2xl border border-border bg-card p-5">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <b.icon className="size-5" />
                  </span>
                  <h3 className="mt-3 font-heading text-base font-bold text-foreground">{b.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.body}</p>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
