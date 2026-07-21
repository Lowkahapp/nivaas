import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Building2, Target, Heart, Users } from "lucide-react"
import Link from "next/link"

const values = [
  {
    icon: Target,
    title: "Honesty first",
    body: "Every listing we publish is what we saw when we visited. We'd rather have fewer listings than mislead a tenant who's about to make a major life decision.",
  },
  {
    icon: Heart,
    title: "Tenant experience matters",
    body: "Finding a home is stressful. Our concierge model — where a real person helps you from search to move-in — exists because we believe renters deserve the same service buyers get.",
  },
  {
    icon: Users,
    title: "Fair to landlords too",
    body: "Good landlords deserve qualified, verified tenants. We screen rigorously so landlords can rent with confidence and tenants can trust who they're dealing with.",
  },
]

const team = [
  { name: "Tanuja Maganty", role: "Founder & CEO", bio: "Previously in property management and insurance. Started Nivaas to bring transparency to the rental market." },
  { name: "Arjun Rao", role: "Head of Verification", bio: "Led field operations teams across Pune and Bangalore. Has personally verified over 1,200 properties." },
  { name: "Priyanka Shetty", role: "Head of Tenant Experience", bio: "Built the concierge model from scratch. Passionate about making renting feel as smooth as ordering online." },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary-foreground/15 text-primary-foreground">
            <Building2 className="size-7" />
          </span>
          <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            About Nivaas
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/85">
            We started Nivaas because renting in India is unnecessarily hard — full of fake listings, unreliable brokers, and surprise charges. We built the alternative.
          </p>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Our story</h2>
          <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
            <p>
              Nivaas was founded in Pune in 2023 after our founder, Tanuja Maganty, spent three weeks trying to find a 2 BHK flat before joining a new job — and visited eleven properties where the photos were either wrong, the rent had changed, or the "owner" turned out to be a broker charging two months' commission.
            </p>
            <p>
              The insight was simple: the rental market has a trust problem. Tenants can't trust listings, landlords can't trust tenants, and everyone loses time and money as a result. Our model fixes this by adding a verification layer to every listing and a concierge layer to every transaction.
            </p>
            <p>
              Today Nivaas operates across Pune with plans to expand to Bangalore and Hyderabad. Every property on our platform has been physically visited by our team. Every tenant who moves in through us has been screened. And no tenant ever pays us a single rupee in brokerage.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="border-y border-border bg-secondary/40">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              What we believe
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {values.map((v) => (
                <div key={v.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            The team
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 font-heading text-xl font-extrabold text-primary">
                  {member.name[0]}
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-primary">{member.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-3xl">
              Join the Nivaas way of renting
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-relaxed text-primary-foreground/85">
              Search verified homes, get a dedicated manager, and move in without the broker fees or the stress.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/search" className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary-foreground/90">
                Find a home
              </Link>
              <Link href="/careers" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10">
                Join our team
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
