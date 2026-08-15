// All content carried over from the existing static site (index/about/contact/
// enquiry). Nothing invented — phone, address, geo, product list and pack
// sizes are the values already in production.

export const business = {
  name: "M Shahul Hameed Rowther Sons",
  short: "MS Wholesale",
  founded: 1965,
  tagline: "Wholesale Rice Suppliers in Coimbatore",
  phone: "+91 94880 75700",
  phoneRaw: "+919488075700",
  whatsapp: "919488075700",
  email: "msgroupcbe@gmail.com",
  address: {
    street: "416, 552, Rangai Gowder St, Town Hall",
    city: "Coimbatore",
    region: "Tamil Nadu",
    postal: "641001",
    country: "IN",
  },
  geo: { lat: 10.9916625, lng: 76.9588701 },
  mapPlaceId: "ChIJ5WFnVAtZqDsRupF9lQFLVqE",
  url: "https://mswholesalerice.com/",
};

// Audit change #6 — lead with the numbers already owned, instead of
// "quality assurance is our cornerstone".
export const proofPoints = [
  { figure: "1965", label: "Trading since" },
  { figure: "100+", label: "Partner mills" },
  { figure: "5–75kg", label: "Pack sizes" },
  { figure: "Next day", label: "Across Tamil Nadu" },
];

// Audit change #3 — six products with room around each, not 21 competing
// images. The rest sit behind "View all".
export const products = [
  {
    slug: "boiled-rice",
    name: "Boiled Rice",
    note: "Par-boiled for everyday meals. The volume staple.",
    image: "/products/harvest.webp",
    sizes: "5 · 10 · 26 · 75 kg",
  },
  {
    slug: "idli-rice",
    name: "Idli Rice",
    note: "Short grain, high absorption. Ground for batter.",
    image: "/products/harvest-idli-rice.webp",
    sizes: "10 · 26 · 75 kg",
  },
  {
    slug: "raw-rice",
    name: "Raw Rice",
    note: "Unparboiled. Clean grain, neutral finish.",
    image: "/products/tree.webp",
    sizes: "5 · 10 · 26 kg",
  },
  {
    slug: "basmati",
    name: "Basmati",
    note: "Long grain, aged. For biryani and pulao service.",
    image: "/products/ms-pink-bag.webp",
    sizes: "5 · 10 · 26 kg",
  },
  {
    slug: "biryani-rice",
    name: "Biryani Rice",
    note: "Seeraga samba. Small grain, holds spice.",
    image: "/products/amal-final.webp",
    sizes: "10 · 26 kg",
  },
  {
    slug: "premium",
    name: "Zeeragam Ponni",
    note: "Royal rice. The top of the range.",
    image: "/products/ms-black-bag.webp",
    sizes: "5 · 10 · 26 kg",
  },
];

export const waLink = (msg) =>
  `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(msg)}`;

export const schema = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: business.name,
  alternateName: [
    "M Shahul Hameed Rawthar Sons",
    "M Shaul Hammed Rowther Sons",
    "MS Wholesale Rice",
    "MS Group Coimbatore",
  ],
  description:
    "Wholesale rice suppliers in Coimbatore since 1965. Idli, boiled, raw and basmati rice.",
  foundingDate: "1965",
  telephone: "+91-94880-75700",
  email: business.email,
  url: business.url,
  image: `${business.url}brand/ms-logo.png`,
  address: {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    postalCode: business.address.postal,
    addressCountry: business.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: business.geo.lat,
    longitude: business.geo.lng,
  },
  hasMap: `https://www.google.com/maps/place/?q=place_id:${business.mapPlaceId}`,
  priceRange: "₹₹",
};
