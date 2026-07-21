import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

const posts = [
  {
    slug: "renting-in-pune-guide-2026",
    category: "Tenant Guide",
    title: "The complete guide to renting in Pune in 2026",
    excerpt: "From Hinjewadi to Kharadi — what to expect in each micro-market, typical rent ranges, and the documents you'll need before you sign.",
    date: "12 Jul 2026",
    readTime: "8 min read",
  },
  {
    slug: "rera-what-tenants-need-to-know",
    category: "Legal",
    title: "RERA: what every tenant in India needs to know",
    excerpt: "RERA is often discussed in the context of buying property — but it matters for renters too. Here's how to use it to protect yourself.",
    date: "5 Jul 2026",
    readTime: "6 min read",
  },
  {
    slug: "how-to-spot-fake-rental-listings",
    category: "Tenant Guide",
    title: "How to spot fake rental listings before you waste a trip",
    excerpt: "Stock photos, vague addresses, prices that seem too good — here are the red flags we've seen thousands of times, and how to avoid them.",
    date: "28 Jun 2026",
    readTime: "5 min read",
  },
  {
    slug: "landlord-lease-agreement-checklist",
    category: "Landlord Guide",
    title: "The landlord's checklist for a bulletproof lease agreement",
    excerpt: "What every leave-and-licence agreement in Maharashtra must include, what common clauses to avoid, and why registration matters.",
    date: "20 Jun 2026",
    readTime: "7 min read",
  },
  {
    slug: "furnished-vs-semi-furnished-rental",
    category: "Tenant Guide",
    title: "Fully furnished vs semi-furnished: which is right for you?",
    excerpt: "The difference in rent, what's typically included, and the questions to ask before you commit to either type.",
    date: "14 Jun 2026",
    readTime: "4 min read",
  },
  {
    slug: "security-deposit-india-rules",
    category: "Legal",
    title: "Security deposit rules in India — what landlords can and can't do",
    excerpt: "How much is legal, when it must be returned, and what deductions are valid. A practical guide for both landlords and tenants.",
    date: "7 Jun 2026",
    readTime: "5 min read",
  },
]

const categories = ["All", "Tenant Guide", "Landlord Guide", "Legal"]

export default function BlogPage() {
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-primary px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl">
            Nivaas Blog
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/85">
            Practical guides on renting, landlord compliance, and navigating India's property laws — written by our team.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat}
                className={`inline-flex h-9 cursor-pointer items-center rounded-lg border px-4 text-sm font-medium transition-colors ${
                  cat === "All"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Featured post */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card">
            <div className="p-8">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {featured.category}
              </span>
              <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{featured.date}</span>
                <span>·</span>
                <span>{featured.readTime}</span>
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Read article
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Grid */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <div key={post.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <span className="inline-flex self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
                <h3 className="mt-3 font-heading text-base font-bold leading-snug text-foreground">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{post.date} · {post.readTime}</span>
                  <Link href={`/blog/${post.slug}`} className="font-semibold text-primary hover:underline">
                    Read →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
