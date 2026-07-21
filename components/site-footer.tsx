import Link from "next/link"
import { Building2 } from "lucide-react"

const columns = [
  {
    title: "Tenants",
    links: [
      { label: "Search 2 BHK flats", href: "/search?bhk=2" },
      { label: "Fully furnished homes", href: "/search?furnishing=Fully+Furnished" },
      { label: "How verification works", href: "/how-it-works" },
      { label: "Schedule a visit", href: "/search" },
    ],
  },
  {
    title: "Landlords",
    links: [
      { label: "List your flat", href: "/list-property" },
      { label: "Concierge management", href: "/landlords/concierge" },
      { label: "Tenant screening", href: "/landlords/tenant-screening" },
      { label: "RERA guidance", href: "/landlords/rera-guidance" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Nivaas", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact us", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Rental Trends", href: "/rental-trends" },
    ],
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
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
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
