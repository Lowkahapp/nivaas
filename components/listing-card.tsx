import Image from "next/image"
import Link from "next/link"
import { Star, MapPin, BedDouble, Bath, Maximize, Heart, BadgeCheck, ShieldCheck, PlayCircle } from "lucide-react"
import { type Listing, formatINR } from "@/lib/listings"

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.images[0] || "/placeholder.svg"}
          alt={`${listing.bhk} BHK at ${listing.name}, ${listing.locality}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {listing.fieldVerified && (
            <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              <BadgeCheck className="size-3.5" />
              Verified
            </span>
          )}
          {listing.reraVerified && (
            <span className="flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur">
              <ShieldCheck className="size-3.5 text-primary" />
              RERA
            </span>
          )}
        </div>
        {listing.videoTour && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-foreground/70 px-2.5 py-1 text-xs font-semibold text-background backdrop-blur">
            <PlayCircle className="size-3.5" />
            Video tour
          </span>
        )}
        <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-card/90 text-foreground backdrop-blur transition-colors hover:text-primary">
          <Heart className="size-4" />
          <span className="sr-only">Save listing</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <span className="font-heading text-lg font-bold text-foreground">
            {formatINR(listing.rent)}
            <span className="text-sm font-medium text-muted-foreground">/mo</span>
          </span>
          <span className="flex items-center gap-1 text-sm font-medium text-foreground">
            <Star className="size-4 fill-accent text-accent" />
            {listing.rating}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Deposit {formatINR(listing.deposit)}
        </p>

        <h3 className="mt-1.5 font-heading text-base font-semibold text-foreground">
          {listing.bhk} BHK {listing.furnishing !== "Unfurnished" ? "· " + listing.furnishing : ""}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">
            {listing.name}, {listing.locality}
          </span>
        </p>

        <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4" />
            {listing.bhk} BHK
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4" />
            {listing.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="size-4" />
            {listing.areaSqft} sqft
          </span>
        </div>
      </div>
    </Link>
  )
}
