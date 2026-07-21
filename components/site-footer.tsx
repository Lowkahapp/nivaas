import Link from "next/link"
import { Building2 } from "lucide-react"

const columns = [
  {
    title: "Tenants",
    links: ["Search 2 BHK flats", "Fully furnished homes", "How verification works", "Schedule a visit"],
  },
  {
    title: "Landlords",
    links: ["List your flat", "Concierge management", "Tenant screening", "RERA guidance"],
  },
  {
    title: "Company",
    links: ["About Nivaas", "Careers", "Contact us", "Blog"],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="size-5" />
              </span>
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
              Nivaas
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            100% manually verified furnished rentals for
            professionals who want a home without the broker hassle.
          </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-bold text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/search"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {"\u00A9"} {new Date().getFullYear()} Nivaas Homes Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
