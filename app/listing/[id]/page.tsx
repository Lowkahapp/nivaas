import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Star,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Sofa,
  BadgeCheck,
  ShieldCheck,
  Heart,
  Share2,
  ChevronLeft,
  Car,
  Wind,
  Dumbbell,
  Waves,
  Building,
  Zap,
  Lock,
  Flame,
  Droplets,
  Wifi,
  Baby,
  Sparkles,
  ArrowUpDown,
  Utensils,
  User,
  Building2,
  GraduationCap,
  Cross,
  ShoppingBag,
  TrainFront,
  Check,
  PlayCircle,
} from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { PropertyGallery } from "@/components/property-gallery"
import { ListingCard } from "@/components/listing-card"
import { ScheduleVisit } from "@/components/schedule-visit"
import { Button } from "@/components/ui/button"
import { getListing, listings, type NearbyPlace } from "@/lib/listings"

export function generateStaticParams() {
  return listings.map((l) => ({ id: l.id }))
}

const AMENITY_ICONS: Record<string, typeof Check> = {
  "24x7 Security": Lock,
  "Power Backup": Zap,
  "Covered Parking": Car,
  Gymnasium: Dumbbell,
  "Swimming Pool": Waves,
  Clubhouse: Building,
  Lift: ArrowUpDown,
  "Children's Play Area": Baby,
  "Modular Kitchen": Utensils,
  "Piped Gas": Flame,
  "RO Water Purifier": Droplets,
  "Wi-Fi Ready": Wifi,
  "Air Conditioning": Wind,
  Housekeeping: Sparkles,
}

const NEARBY_ICONS: Record<NearbyPlace["type"], typeof Check> = {
  "IT Park": Building2,
  Mall: ShoppingBag,
  Hospital: Cross,
  School: GraduationCap,
  Transit: TrainFront,
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = getListing(id)
  if (!listing) notFound()

  const similar = listings.filter((l) => l.id !== listing.id).slice(0, 3)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/search"
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            Back to search
          </Link>

          <PropertyGallery images={listing.images} name={listing.name} />

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Left column */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {listing.fieldVerified && (
                      <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                        <BadgeCheck className="size-3.5" />
                        Field Verified
                      </span>
                    )}
                    {listing.reraVerified && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <ShieldCheck className="size-3.5" />
                        RERA Verified
                      </span>
                    )}
                    {listing.videoTour && (
                      <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                        <PlayCircle className="size-3.5" />
                        Video tour
                      </span>
                    )}
                  </div>
                  <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground">
                    {listing.bhk} BHK in {listing.name}
                  </h1>
                  <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="size-4 shrink-0" />
                    {listing.tower}, {listing.address}, {listing.locality}, {listing.city} {listing.pincode}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Star className="size-4 fill-accent text-accent" />
                      {listing.rating}
                      <span className="text-muted-foreground">({listing.reviews} reviews)</span>
                    </span>
                    <span className="flex items-center gap-1 font-medium text-primary">
                      <Building2 className="size-4" />
                      {listing.itParkDistance}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" aria-label="Save">
                    <Heart className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Share">
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Quick stats */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat icon={BedDouble} label="Configuration" value={`${listing.bhk} BHK`} />
                <Stat icon={Bath} label="Bathrooms" value={`${listing.bathrooms}`} />
                <Stat icon={Maximize} label="Carpet area" value={`${listing.areaSqft} sqft`} />
                <Stat icon={Sofa} label="Furnishing" value={listing.furnishing.replace(" Furnished", "")} />
              </div>

              {/* Description */}
              <section className="mt-8">
                <h2 className="font-heading text-xl font-bold text-foreground">About this home</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{listing.description}</p>
              </section>

              {/* Property details */}
              <section className="mt-8">
                <h2 className="font-heading text-xl font-bold text-foreground">Property details</h2>
                <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                  <dl className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
                    <DetailRow label="Society" value={listing.name} />
                    <DetailRow label="Floor" value={listing.floor} />
                    <DetailRow label="Balconies" value={`${listing.balconies}`} />
                    <DetailRow label="Furnishing" value={listing.furnishing} />
                    <DetailRow label="Covered parking" value={listing.parking ? "Yes" : "No"} />
                    <DetailRow label="Pet friendly" value={listing.petFriendly ? "Yes" : "No"} />
                    <DetailRow label="Available from" value={listing.availableFrom} />
                    <DetailRow label="Pincode" value={listing.pincode} />
                  </dl>
                </div>
              </section>

              {/* Amenities */}
              <section className="mt-8">
                <h2 className="font-heading text-xl font-bold text-foreground">Society amenities</h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {listing.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a] ?? Check
                    return (
                      <div
                        key={a}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground"
                      >
                        <Icon className="size-4 shrink-0 text-primary" />
                        {a}
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Location & nearby */}
              <section className="mt-8">
                <h2 className="font-heading text-xl font-bold text-foreground">Location & nearby</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {listing.nearby.map((place) => {
                    const Icon = NEARBY_ICONS[place.type] ?? MapPin
                    return (
                      <div
                        key={place.name}
                        className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{place.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {place.type} · {place.distance}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              {/* Owner / manager */}
              <section className="mt-8">
                <h2 className="font-heading text-xl font-bold text-foreground">Listed by</h2>
                <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <User className="size-6" />
                  </span>
                  <div>
                    <p className="font-heading font-bold text-foreground">{listing.ownerName}</p>
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      {listing.ownerType === "Nivaas Managed" ? (
                        <>
                          <BadgeCheck className="size-3.5 text-primary" />
                          Nivaas Managed property
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="size-3.5 text-primary" />
                          Owner · Verified by Nivaas
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column — schedule visit */}
            <aside className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <ScheduleVisit listing={listing} />
              </div>
            </aside>
          </div>

          {/* Similar */}
          <section className="mt-16">
            <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              Similar verified homes
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Check
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-border bg-card px-3 py-4 text-center">
      <Icon className="size-5 text-primary" />
      <span className="mt-2 font-heading text-base font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-card px-4 py-3 text-sm sm:border-b sm:border-border">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}
