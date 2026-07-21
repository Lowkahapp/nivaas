import Link from "next/link"
import { Building2, Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="size-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
              Nivaas
            </span>
            <span className="text-[11px] font-medium text-muted-foreground">Find your home</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/search?bhk=2"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            2 BHK
          </Link>
          <Link
            href="/search?furnishing=Fully+Furnished"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Furnished
          </Link>
          <Link
            href="/search"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            All rentals
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            className="hidden sm:inline-flex"
            render={<Link href="/search" />}
          >
            <Heart className="size-4" />
            Saved
          </Button>
          <Button
            size="sm"
            nativeButton={false}
            className="hidden sm:inline-flex"
            render={<Link href="/list-property" />}
          >
            List property
          </Button>
          <Button variant="outline" size="icon-sm" className="md:hidden" aria-label="Open menu">
            <Menu className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
