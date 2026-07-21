export type FurnishingType = "Fully Furnished" | "Semi Furnished" | "Unfurnished"

export type NearbyPlace = {
  name: string
  type: "IT Park" | "Mall" | "Hospital" | "School" | "Transit"
  distance: string
}

export type Listing = {
  id: string
  name: string
  tower: string
  address: string
  locality: string
  city: string
  pincode: string
  bhk: number
  rent: number
  deposit: number
  maintenance: number
  areaSqft: number
  bathrooms: number
  balconies: number
  furnishing: FurnishingType
  floor: string
  rating: number
  reviews: number
  reraVerified: boolean
  fieldVerified: boolean
  parking: boolean
  petFriendly: boolean
  availableFrom: string
  ownerName: string
  ownerType: "Owner" | "Nivaas Managed"
  phone: string
  itParkDistance: string
  videoTour: boolean
  images: string[]
  amenities: string[]
  nearby: NearbyPlace[]
  description: string
}

const INTERIORS = [
  "/images/apt-2.png",
  "/images/apt-3.png",
  "/images/apt-4.png",
  "/images/apt-7.png",
]

export const AMENITY_OPTIONS = [
  "24x7 Security",
  "Power Backup",
  "Covered Parking",
  "Gymnasium",
  "Swimming Pool",
  "Clubhouse",
  "Lift",
  "Children's Play Area",
  "Modular Kitchen",
  "Piped Gas",
  "RO Water Purifier",
  "Wi-Fi Ready",
  "Air Conditioning",
  "Housekeeping",
]

const COMMON_NEARBY: NearbyPlace[] = [
  { name: "Rajiv Gandhi Infotech Park", type: "IT Park", distance: "1.5 km" },
  { name: "Grand Highstreet Mall", type: "Mall", distance: "2.2 km" },
  { name: "Lifepoint Multispeciality Hospital", type: "Hospital", distance: "1.8 km" },
  { name: "Blue Ridge Public School", type: "School", distance: "1.1 km" },
  { name: "Hinjewadi Metro (Line 3)", type: "Transit", distance: "0.9 km" },
]

export const listings: Listing[] = [
  {
    id: "megapolis-sangria",
    name: "Megapolis Sangria Towers",
    tower: "Tower C",
    address: "Megapolis Township, Rajiv Gandhi Infotech Park",
    locality: "Hinjewadi Phase 3",
    city: "Pune",
    pincode: "411057",
    bhk: 2,
    rent: 32000,
    deposit: 96000,
    maintenance: 3200,
    areaSqft: 1050,
    bathrooms: 2,
    balconies: 2,
    furnishing: "Fully Furnished",
    floor: "9th of 23",
    rating: 4.8,
    reviews: 64,
    reraVerified: true,
    fieldVerified: true,
    parking: true,
    petFriendly: true,
    availableFrom: "Immediate",
    ownerName: "Rakesh Menon",
    ownerType: "Nivaas Managed",
    phone: "+91 98220 41200",
    itParkDistance: "5 min to Wipro Circle",
    videoTour: true,
    images: ["/images/apt-1.png", ...INTERIORS],
    amenities: [
      "24x7 Security",
      "Power Backup",
      "Covered Parking",
      "Gymnasium",
      "Swimming Pool",
      "Clubhouse",
      "Lift",
      "Modular Kitchen",
      "Piped Gas",
      "Air Conditioning",
    ],
    nearby: COMMON_NEARBY,
    description:
      "A bright, fully furnished 2 BHK inside Hinjewadi's flagship Megapolis township. Walk to Wipro and Infosys campuses, with a modular kitchen, split ACs in both bedrooms, and access to a clubhouse, pool, and gym. Ideal for IT professionals who want a zero-hassle move-in.",
  },
  {
    id: "megapolis-splendour",
    name: "Megapolis Splendour",
    tower: "Tower B",
    address: "Megapolis Township, Rajiv Gandhi Infotech Park",
    locality: "Hinjewadi Phase 3",
    city: "Pune",
    pincode: "411057",
    bhk: 2,
    rent: 27500,
    deposit: 82500,
    maintenance: 2800,
    areaSqft: 980,
    bathrooms: 2,
    balconies: 1,
    furnishing: "Semi Furnished",
    floor: "6th of 18",
    rating: 4.6,
    reviews: 41,
    reraVerified: true,
    fieldVerified: true,
    parking: true,
    petFriendly: false,
    availableFrom: "1 Aug 2026",
    ownerName: "Sunita Deshpande",
    ownerType: "Owner",
    phone: "+91 99700 55831",
    itParkDistance: "8 min to Infosys Phase 2",
    videoTour: true,
    images: ["/images/apt-5.png", ...INTERIORS],
    amenities: [
      "24x7 Security",
      "Power Backup",
      "Covered Parking",
      "Gymnasium",
      "Clubhouse",
      "Lift",
      "Children's Play Area",
      "Piped Gas",
      "RO Water Purifier",
    ],
    nearby: COMMON_NEARBY,
    description:
      "Semi-furnished 2 BHK with wardrobes, modular kitchen, and geysers installed. Quiet tower within Megapolis with quick access to the Hinjewadi-Shivajinagar metro line. Great value for a family or working couple.",
  },
  {
    id: "mont-vert-belair",
    name: "Mont Vert Belair",
    tower: "Wing D",
    address: "Marunji Road, near Rajiv Gandhi Infotech Park",
    locality: "Hinjewadi Phase 3",
    city: "Pune",
    pincode: "411057",
    bhk: 2,
    rent: 24000,
    deposit: 72000,
    maintenance: 2400,
    areaSqft: 910,
    bathrooms: 2,
    balconies: 1,
    furnishing: "Semi Furnished",
    floor: "3rd of 12",
    rating: 4.4,
    reviews: 28,
    reraVerified: true,
    fieldVerified: true,
    parking: true,
    petFriendly: true,
    availableFrom: "Immediate",
    ownerName: "Imran Shaikh",
    ownerType: "Nivaas Managed",
    phone: "+91 97640 12093",
    itParkDistance: "10 min to Rajiv Gandhi Infotech Park",
    videoTour: false,
    images: ["/images/apt-6.png", ...INTERIORS],
    amenities: [
      "24x7 Security",
      "Power Backup",
      "Covered Parking",
      "Gymnasium",
      "Lift",
      "Children's Play Area",
      "Piped Gas",
      "Wi-Fi Ready",
    ],
    nearby: COMMON_NEARBY,
    description:
      "Well-maintained semi-furnished 2 BHK on Marunji Road with a green, low-density campus. Pet friendly, with covered parking and reliable power backup. A calm base close to the tech corridor.",
  },
  {
    id: "rohan-ananta",
    name: "Rohan Ananta",
    tower: "Tower 4",
    address: "Tathawade-Hinjewadi Link Road",
    locality: "Hinjewadi Phase 3",
    city: "Pune",
    pincode: "411057",
    bhk: 3,
    rent: 41000,
    deposit: 123000,
    maintenance: 4100,
    areaSqft: 1320,
    bathrooms: 3,
    balconies: 2,
    furnishing: "Fully Furnished",
    floor: "14th of 20",
    rating: 4.7,
    reviews: 37,
    reraVerified: true,
    fieldVerified: true,
    parking: true,
    petFriendly: true,
    availableFrom: "15 Aug 2026",
    ownerName: "Priya Nair",
    ownerType: "Nivaas Managed",
    phone: "+91 98905 77410",
    itParkDistance: "12 min to Wipro Circle",
    videoTour: true,
    images: ["/images/apt-8.png", ...INTERIORS],
    amenities: [
      "24x7 Security",
      "Power Backup",
      "Covered Parking",
      "Gymnasium",
      "Swimming Pool",
      "Clubhouse",
      "Lift",
      "Modular Kitchen",
      "Air Conditioning",
      "Housekeeping",
    ],
    nearby: COMMON_NEARBY,
    description:
      "Spacious high-floor 3 BHK with skyline views, fully furnished with ACs, beds, and a modular kitchen. Premium amenities including pool, clubhouse, and daily housekeeping. Perfect for families or sharing professionals.",
  },
  {
    id: "kasturi-eon-homes",
    name: "Kasturi Eon Homes",
    tower: "Wing A",
    address: "Near Wipro Circle, Rajiv Gandhi Infotech Park",
    locality: "Hinjewadi Phase 3",
    city: "Pune",
    pincode: "411057",
    bhk: 1,
    rent: 18500,
    deposit: 55500,
    maintenance: 1800,
    areaSqft: 620,
    bathrooms: 1,
    balconies: 1,
    furnishing: "Fully Furnished",
    floor: "5th of 15",
    rating: 4.5,
    reviews: 52,
    reraVerified: true,
    fieldVerified: true,
    parking: false,
    petFriendly: false,
    availableFrom: "Immediate",
    ownerName: "Amit Kulkarni",
    ownerType: "Owner",
    phone: "+91 90110 26654",
    itParkDistance: "3 min to Wipro Circle",
    videoTour: true,
    images: ["/images/apt-1.png", ...INTERIORS],
    amenities: [
      "24x7 Security",
      "Power Backup",
      "Gymnasium",
      "Lift",
      "Modular Kitchen",
      "Piped Gas",
      "Air Conditioning",
      "Wi-Fi Ready",
    ],
    nearby: COMMON_NEARBY,
    description:
      "Compact fully furnished 1 BHK a short walk from Wipro Circle. Move-in ready with AC, bed, sofa, and modular kitchen. Ideal for a single IT professional who wants to skip the commute entirely.",
  },
  {
    id: "xrbia-hinjewadi",
    name: "Xrbia Hinjewadi Road",
    tower: "Cluster 2",
    address: "Hinjewadi-Marunji Road",
    locality: "Hinjewadi Phase 3",
    city: "Pune",
    pincode: "411057",
    bhk: 2,
    rent: 21000,
    deposit: 63000,
    maintenance: 2100,
    areaSqft: 860,
    bathrooms: 2,
    balconies: 1,
    furnishing: "Unfurnished",
    floor: "8th of 16",
    rating: 4.2,
    reviews: 19,
    reraVerified: false,
    fieldVerified: true,
    parking: true,
    petFriendly: true,
    availableFrom: "1 Sep 2026",
    ownerName: "Vikram Rao",
    ownerType: "Owner",
    phone: "+91 96570 33218",
    itParkDistance: "15 min to Infosys Phase 2",
    videoTour: false,
    images: ["/images/apt-5.png", ...INTERIORS],
    amenities: [
      "24x7 Security",
      "Power Backup",
      "Covered Parking",
      "Lift",
      "Children's Play Area",
      "Piped Gas",
    ],
    nearby: COMMON_NEARBY,
    description:
      "Affordable unfurnished 2 BHK for tenants who want to bring their own setup. Field-verified for accurate photos and society details. Covered parking and pet friendly, with good connectivity to the tech park.",
  },
]

export function getListing(id: string) {
  return listings.find((l) => l.id === id)
}

export function formatINR(n: number) {
  return `\u20B9${n.toLocaleString("en-IN")}`
}

export function rentLabel(l: Listing) {
  return `${formatINR(l.rent)}/mo`
}

export function bhkLabel(l: Listing) {
  return `${l.bhk} BHK`
}
