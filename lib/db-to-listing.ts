/**
 * Maps a raw database property row to the Listing type.
 * Falls back gracefully for fields that don't exist in the DB schema.
 */
import type { Listing, FurnishingType, NearbyPlace } from "@/lib/listings"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbRowToListing(row: Record<string, any>): Listing {
  let images: string[] = []
  let amenities: string[] = []
  let nearby: NearbyPlace[] = []

  try { images = JSON.parse(row.images || "[]") } catch { images = [] }
  try { amenities = JSON.parse(row.amenities || "[]") } catch { amenities = [] }
  try { nearby = JSON.parse(row.nearby_places || "[]") } catch { nearby = [] }

  if (images.length === 0) images = ["/images/apt-1.png"]

  return {
    id: String(row.id),
    name: row.society_name || "Property",
    tower: row.tower || "",
    address: row.address || row.society_name || "",
    locality: row.locality || "",
    city: row.city || "",
    pincode: row.pincode || "",
    bhk: parseInt(row.bhk) || 1,
    rent: parseInt(row.rent) || 0,
    deposit: parseInt(row.deposit) || 0,
    maintenance: parseInt(row.maintenance) || 0,
    areaSqft: parseInt(row.area_sqft) || 0,
    bathrooms: parseInt(row.bathrooms) || 1,
    balconies: parseInt(row.balconies) || 0,
    furnishing: (row.furnishing as FurnishingType) || "Unfurnished",
    floor: row.floor || "",
    rating: parseFloat(row.rating) || 0,
    reviews: parseInt(row.reviews) || 0,
    reraVerified: row.rera_verified === true || row.rera_verified === "true",
    fieldVerified: row.field_verified === true || row.field_verified === "true",
    parking: row.parking === true || row.parking === "true",
    petFriendly: row.pet_friendly === true || row.pet_friendly === "true",
    availableFrom: row.available_from || "Immediate",
    ownerName: "",
    ownerType: "Owner",
    phone: "",
    itParkDistance: "",
    videoTour: false,
    images,
    amenities,
    nearby,
    description: row.description || "",
  }
}
