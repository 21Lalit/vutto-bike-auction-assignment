import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Listing = {
  name: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  image: string;
  price: number;
  url: string;
};

// Sourced from Vutto's public ItemList structured data on /used-bikes-in-delhi-ncr/.
// Each seed bike uses its matching model/name image instead of generic motorcycle photos.
const vuttoListings: Listing[] = [
  { name: "Hero HF Deluxe Self Alloy", brand: "Hero", model: "HF Deluxe", year: 2025, mileage: 6251, image: "https://d1zm6mf795n3f0.cloudfront.net/1782223537336_5_.png", price: 59500, url: "https://vutto.in/buy-used-bikes/delhi/hero/hf-deluxe/self-alloy-6251km-shahdara/4173/" },
  { name: "Royal Enfield Bullet 350 Military Silver", brand: "Royal Enfield", model: "Bullet 350", year: 2025, mileage: 6125, image: "https://d1zm6mf795n3f0.cloudfront.net/1781355138039_5_.png", price: 165000, url: "https://vutto.in/buy-used-bikes/gurgaon/royal-enfield/bullet-350/military-silver-6125km-gurgaon/4033/" },
  { name: "TVS Ntorq 125 Race Edition", brand: "TVS", model: "Ntorq 125", year: 2023, mileage: 31208, image: "https://d1zm6mf795n3f0.cloudfront.net/1780827260083_14_.png", price: 62000, url: "https://vutto.in/buy-used-bikes/delhi/tvs/ntorq-125/race-edition-31208km-uttam-nagar/3960/" },
  { name: "Hero Splendor Plus Self Alloy i3S", brand: "Hero", model: "Splendor Plus", year: 2024, mileage: 19672, image: "https://d1zm6mf795n3f0.cloudfront.net/1782210615558_5_.png", price: 64000, url: "https://vutto.in/buy-used-bikes/delhi/hero/splendor-plus/self-alloy-i3s-19672km-uttam-nagar/4169/" },
  { name: "Bajaj Pulsar 150 Single Disc", brand: "Bajaj", model: "Pulsar 150", year: 2020, mileage: 21693, image: "https://d1zm6mf795n3f0.cloudfront.net/1782211019806_5_.png", price: 52500, url: "https://vutto.in/buy-used-bikes/delhi/bajaj/pulsar-150/single-disc-21693km-uttam-nagar/4168/" },
  { name: "Hero Splendor Plus Self Alloy i3S", brand: "Hero", model: "Splendor Plus", year: 2024, mileage: 12881, image: "https://d1zm6mf795n3f0.cloudfront.net/1782210672915_5_.png", price: 64000, url: "https://vutto.in/buy-used-bikes/delhi/hero/splendor-plus/self-alloy-i3s-12881km-uttam-nagar/4171/" },
  { name: "Honda Activa 4G Standard (BS IV)", brand: "Honda", model: "Activa 4G", year: 2017, mileage: 25862, image: "https://d1zm6mf795n3f0.cloudfront.net/1782210658755_14_.png", price: 35500, url: "https://vutto.in/buy-used-bikes/delhi/honda/activa-4g/standard-bs-iv-25862km-uttam-nagar/4166/" },
  { name: "TVS Ntorq 125 Race Edition", brand: "TVS", model: "Ntorq 125", year: 2023, mileage: 15380, image: "https://d1zm6mf795n3f0.cloudfront.net/1782205345029_14_.png", price: 66000, url: "https://vutto.in/buy-used-bikes/delhi/tvs/ntorq-125/race-edition-15380km-uttam-nagar/4164/" },
  { name: "Honda Activa 5G Standard", brand: "Honda", model: "Activa 5G", year: 2019, mileage: 45138, image: "https://d1zm6mf795n3f0.cloudfront.net/1782204658720_14_.png", price: 41000, url: "https://vutto.in/buy-used-bikes/delhi/honda/activa-5g/standard-45138km-uttam-nagar/4161/" },
  { name: "TVS Jupiter 125 Disc - Alloy Wheel", brand: "TVS", model: "Jupiter 125", year: 2024, mileage: 24968, image: "https://d1zm6mf795n3f0.cloudfront.net/1782208784322_14_.png", price: 66500, url: "https://vutto.in/buy-used-bikes/delhi/tvs/jupiter-125/disc-alloy-wheel-24968km-peeragarhi/4165/" },
  { name: "Honda SP 125 Disc", brand: "Honda", model: "SP 125", year: 2024, mileage: 44032, image: "https://d1zm6mf795n3f0.cloudfront.net/1782202130413_5_.png", price: 66500, url: "https://vutto.in/buy-used-bikes/gurgaon/honda/sp-125/disc-44032km-gurgaon/4136/" },
  { name: "Hero Splendor Plus Self Alloy", brand: "Hero", model: "Splendor Plus", year: 2024, mileage: 7864, image: "https://d1zm6mf795n3f0.cloudfront.net/1781860846345_5_.png", price: 60000, url: "https://vutto.in/buy-used-bikes/delhi/hero/splendor-plus/self-alloy-7864km-shahdara/4122/" },
  { name: "Honda Activa 6G Deluxe", brand: "Honda", model: "Activa 6G", year: 2023, mileage: 18578, image: "https://d1zm6mf795n3f0.cloudfront.net/1781862567887_14_.png", price: 59500, url: "https://vutto.in/buy-used-bikes/delhi/honda/activa-6g/deluxe-18578km-shahdara/4121/" },
  { name: "Honda Activa 6G Deluxe", brand: "Honda", model: "Activa 6G", year: 2022, mileage: 25935, image: "https://d1zm6mf795n3f0.cloudfront.net/1782189225268_14_.png", price: 56500, url: "https://vutto.in/buy-used-bikes/delhi/honda/activa-6g/deluxe-25935km-uttam-nagar/4160/" },
  { name: "TVS Radeon Drum", brand: "TVS", model: "Radeon", year: 2024, mileage: 24028, image: "https://d1zm6mf795n3f0.cloudfront.net/1782123287732_5_.png", price: 47500, url: "https://vutto.in/buy-used-bikes/delhi/tvs/radeon/drum-24028km-uttam-nagar/4153/" },
  { name: "Royal Enfield Thunderbird 350X ABS", brand: "Royal Enfield", model: "Thunderbird 350X", year: 2019, mileage: 20842, image: "https://d1zm6mf795n3f0.cloudfront.net/1778137560698_5_.png", price: 93500, url: "https://vutto.in/buy-used-bikes/delhi/royal-enfield/thunderbird-350x/abs-20842km-shahdara/3532/" },
  { name: "Royal Enfield Hunter 350 Retro Factory", brand: "Royal Enfield", model: "Hunter 350", year: 2022, mileage: 17051, image: "https://d1zm6mf795n3f0.cloudfront.net/1781777012462_5_.png", price: 101500, url: "https://vutto.in/buy-used-bikes/gurgaon/royal-enfield/hunter-350/retro-factory-17051km-gurgaon/4098/" },
  { name: "TVS Apache RTR 180 Disc Bluetooth", brand: "TVS", model: "Apache RTR 180", year: 2025, mileage: 3809, image: "https://d1zm6mf795n3f0.cloudfront.net/1782136628719_5_.png", price: 112000, url: "https://vutto.in/buy-used-bikes/gurgaon/tvs/apache-rtr-180/disc-bluetooth-3809km-gurgaon/4159/" },
  { name: "Honda Shine 100 Standard", brand: "Honda", model: "Shine 100", year: 2024, mileage: 18988, image: "https://d1zm6mf795n3f0.cloudfront.net/1782136361873_5_.png", price: 52500, url: "https://vutto.in/buy-used-bikes/gurgaon/honda/shine-100/standard-18988km-gurgaon/4152/" },
  { name: "TVS Ntorq 125 Race XP", brand: "TVS", model: "Ntorq 125", year: 2025, mileage: 2731, image: "https://d1zm6mf795n3f0.cloudfront.net/1782133327478_14_.png", price: 85000, url: "https://vutto.in/buy-used-bikes/gurgaon/tvs/ntorq-125/race-xp-2731km-gurgaon/4156/" },
  { name: "Honda Activa 125 Drum", brand: "Honda", model: "Activa 125", year: 2017, mileage: 36296, image: "https://d1zm6mf795n3f0.cloudfront.net/1779777356093_14_.png", price: 38500, url: "https://vutto.in/buy-used-bikes/gurgaon/honda/activa-125/drum-36296km-gurgaon/3779/" },
  { name: "Yamaha Ray ZR 125 Drum", brand: "Yamaha", model: "Ray ZR 125", year: 2026, mileage: 1809, image: "https://d1zm6mf795n3f0.cloudfront.net/1782049640935_14_.png", price: 68000, url: "https://vutto.in/buy-used-bikes/delhi/yamaha/ray-zr-125/drum-1809km-peeragarhi/4139/" },
  { name: "TVS Jupiter 125 Disc - Alloy Wheel", brand: "TVS", model: "Jupiter 125", year: 2024, mileage: 17068, image: "https://d1zm6mf795n3f0.cloudfront.net/1782049894187_14_.png", price: 68000, url: "https://vutto.in/buy-used-bikes/gurgaon/tvs/jupiter-125/disc-alloy-wheel-17068km-gurgaon/4142/" },
  { name: "Hero Splendor Plus Self Alloy i3S", brand: "Hero", model: "Splendor Plus", year: 2024, mileage: 13123, image: "https://d1zm6mf795n3f0.cloudfront.net/1781698081771_5_.png", price: 60000, url: "https://vutto.in/buy-used-bikes/delhi/hero/splendor-plus/self-alloy-i3s-13123km-shahdara/4090/" },
  { name: "Royal Enfield Meteor 350 Supernova", brand: "Royal Enfield", model: "Meteor 350", year: 2024, mileage: 8457, image: "https://d1zm6mf795n3f0.cloudfront.net/1781353824370_5_.png", price: 183000, url: "https://vutto.in/buy-used-bikes/delhi/royal-enfield/meteor-350/supernova-8457km-shahdara/4027/" },
  { name: "TVS Ntorq 125 Race Edition", brand: "TVS", model: "Ntorq 125", year: 2021, mileage: 28822, image: "https://d1zm6mf795n3f0.cloudfront.net/1781775231309_14_.png", price: 68500, url: "https://vutto.in/buy-used-bikes/delhi/tvs/ntorq-125/race-edition-28822km-shahdara/4097/" },
  { name: "TVS Raider 125 Disc", brand: "TVS", model: "Raider 125", year: 2025, mileage: 7727, image: "https://d1zm6mf795n3f0.cloudfront.net/1777225414617_5_.png", price: 79000, url: "https://vutto.in/buy-used-bikes/delhi/tvs/raider-125/disc-7727km-khanpur/3419/" },
  { name: "Suzuki Access 125 Disc", brand: "Suzuki", model: "Access 125", year: 2020, mileage: 35046, image: "https://d1zm6mf795n3f0.cloudfront.net/1782035541218_14_.png", price: 38000, url: "https://vutto.in/buy-used-bikes/faridabad/suzuki/access-125/disc-35046km-faridabad/4095/" },
  { name: "Hero Splendor Plus Self Alloy i3S", brand: "Hero", model: "Splendor Plus", year: 2024, mileage: 12754, image: "https://d1zm6mf795n3f0.cloudfront.net/1782121619598_5_.png", price: 64000, url: "https://vutto.in/buy-used-bikes/delhi/hero/splendor-plus/self-alloy-i3s-12754km-uttam-nagar/4144/" },
  { name: "Hero Splendor Plus Xtec i3s Drum Self Alloy", brand: "Hero", model: "Splendor Plus Xtec", year: 2024, mileage: 22375, image: "https://d1zm6mf795n3f0.cloudfront.net/1777473212857_5_.png", price: 64500, url: "https://vutto.in/buy-used-bikes/delhi/hero/splendor-plus-xtec/i3s-drum-self-alloy-22375km-khanpur/3456/" }
];

const hubs = [
  "Vutto Uttam Nagar Hub, Delhi",
  "Vutto Peeragarhi Hub, Delhi",
  "Vutto Gurgaon Hub",
  "Vutto Shahdara Hub, Delhi",
  "Vutto Khanpur Hub, Delhi",
  "Vutto Faridabad Hub",
  "Vutto Jaipur Hub"
];

function locationFromUrl(url: string, index: number) {
  if (url.includes("gurgaon")) return "Vutto Gurgaon Hub";
  if (url.includes("faridabad")) return "Vutto Faridabad Hub";
  if (url.includes("peeragarhi")) return "Vutto Peeragarhi Hub, Delhi";
  if (url.includes("shahdara")) return "Vutto Shahdara Hub, Delhi";
  if (url.includes("khanpur")) return "Vutto Khanpur Hub, Delhi";
  if (url.includes("jaipur")) return "Vutto Jaipur Hub";
  if (url.includes("uttam-nagar")) return "Vutto Uttam Nagar Hub, Delhi";
  return hubs[index % hubs.length];
}

function engineFor(listing: Listing) {
  const match = listing.model.match(/(\d{2,3})/);
  if (match) return `${match[1]}cc petrol`;
  if (listing.model.includes("Activa") || listing.model.includes("Jupiter") || listing.model.includes("Access") || listing.model.includes("Ntorq") || listing.model.includes("Ray")) return "110-125cc petrol";
  return "100-160cc petrol";
}

function detailFor(listing: Listing, index: number, mileage: number, condition: string, location: string, reservePrice: number) {
  const scooter = ["Activa", "Jupiter", "Access", "Ntorq", "Ray"].some((name) => listing.model.includes(name));
  const lowMileage = mileage < 10000;
  const highMileage = mileage > 30000;
  const colors = ["Pearl White", "Matte Black", "Racing Red", "Metallic Blue", "Graphite Grey", "Silver"];
  return {
    technical: {
      engine: engineFor(listing),
      transmission: scooter ? "CVT automatic" : "Manual gearbox",
      fuelType: "Petrol",
      emission: listing.year >= 2020 ? "BS6" : "BS4",
      startType: listing.name.toLowerCase().includes("self") || scooter ? "Self start" : "Kick and self start",
      brakes: listing.name.toLowerCase().includes("disc") || listing.name.toLowerCase().includes("abs") ? "Front disc setup" : "Drum brake setup",
      wheels: listing.name.toLowerCase().includes("alloy") ? "Alloy wheels" : "Standard wheels",
      color: colors[index % colors.length]
    },
    ownership: {
      ownerType: index % 5 === 0 ? "Second owner" : "First owner",
      registration: location.includes("Gurgaon") ? "HR registration" : location.includes("Faridabad") ? "HR registration" : "DL registration",
      insurance: listing.year >= 2022 ? "Active comprehensive policy" : "Third-party policy available",
      hypothecation: index % 7 === 0 ? "Bank NOC required" : "Clear",
      challanStatus: "Checked before handoff"
    },
    service: {
      serviceHistory: index % 3 === 0 ? "Service invoices available" : "Workshop service verified",
      lastServiceKm: `${Math.max(mileage - 1200, 700).toLocaleString("en-IN")} km`,
      tyres: lowMileage ? "80% plus tread" : highMileage ? "Replacement recommended within 3,000 km" : "60-70% tread",
      battery: listing.year >= 2023 ? "Healthy" : "Load test passed",
      brakes: highMileage ? "Pads checked, routine wear" : "Good bite during inspection"
    },
    inspection: {
      engine: "Cold start verified",
      clutchOrCvt: scooter ? "CVT response checked" : "Clutch engagement checked",
      suspension: highMileage ? "Minor age-related softness" : "No abnormal noise",
      electricals: "Lights, horn, console, and starter checked",
      bodywork: condition === "EXCELLENT" ? "Clean panels" : "Normal used-bike scratches",
      roadTest: "Hub test ride completed"
    },
    documents: ["RC copy", "Insurance copy", "PUC status", "Seller ID proof", "Transfer forms"],
    features: [
      scooter ? "Under-seat utility storage" : "Daily commute ready",
      listing.name.toLowerCase().includes("bluetooth") ? "Bluetooth console" : "Verified instrument console",
      listing.name.toLowerCase().includes("abs") ? "ABS equipped" : "Braking inspected",
      "Hub inspection support"
    ],
    included: ["One key set", "Owner manual if available", "Vutto hub handoff", "Post-win transfer checklist"],
    knownIssues: condition === "EXCELLENT" ? ["No major issue reported", "Minor cosmetic marks possible on used vehicle"] : ["Cosmetic scratches visible on close inspection", "Consumables may need routine replacement"],
    commercial: {
      reserveStatus: `Reserve near ${reservePrice.toLocaleString("en-IN")}`,
      transferSupport: "RC transfer guidance included",
      paymentWindow: "Winner confirmation required after auction close",
      inspectionHub: location
    }
  };
}

function bikeSpec(index: number) {
  const listing = vuttoListings[index % vuttoListings.length];
  const repeat = Math.floor(index / vuttoListings.length);
  const price = listing.price + repeat * 1500;
  const mileage = listing.mileage + repeat * 950;
  const condition = listing.mileage < 8000 ? "EXCELLENT" : listing.mileage < 26000 ? "GOOD" : "FAIR";
  const location = repeat ? hubs[index % hubs.length] : locationFromUrl(listing.url, index);
  const reservePrice = price + 6000;
  return {
    title: repeat ? `${listing.year} ${listing.name} - Auction Lot ${index + 1}` : `${listing.year} ${listing.name}`,
    brand: listing.brand,
    model: listing.model,
    year: listing.year,
    mileage,
    condition,
    location,
    photos: JSON.stringify([listing.image]),
    description: `Vutto-listed ${listing.name} with matching listing image, verified document workflow, inspection support, and hub handoff readiness.`,
    basePrice: Math.max(price - 6000, 25000),
    reservePrice,
    details: JSON.stringify(detailFor(listing, index, mileage, condition, location, reservePrice))
  };
}

function auctionTiming(index: number, now: number) {
  const bucket = index % 10;
  if (bucket < 4) {
    return {
      status: "LIVE",
      startTime: new Date(now - (60 + index * 3) * 60_000),
      endTime: new Date(now + (90 + index * 5) * 60_000)
    };
  }
  if (bucket < 7) {
    return {
      status: "SCHEDULED",
      startTime: new Date(now + (8 + index) * 60 * 60_000),
      endTime: new Date(now + (14 + index) * 60 * 60_000)
    };
  }
  if (bucket < 9) {
    return {
      status: "ENDED",
      startTime: new Date(now - (72 + index) * 60 * 60_000),
      endTime: new Date(now - (68 + index) * 60 * 60_000)
    };
  }
  return {
    status: "DRAFT",
    startTime: new Date(now + (48 + index) * 60 * 60_000),
    endTime: new Date(now + (54 + index) * 60 * 60_000)
  };
}

async function main() {
  await prisma.inspectionRequest.deleteMany();
  await prisma.watchlistItem.deleteMany();
  await prisma.bid.deleteMany();
  await prisma.sellerLead.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.bike.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 12);
  const [admin, buyer, rider] = await Promise.all([
    prisma.user.create({ data: { name: "Admin", email: "admin@bikeauction.test", passwordHash, role: "ADMIN" } }),
    prisma.user.create({ data: { name: "Buyer One", email: "buyer@bikeauction.test", passwordHash, role: "USER" } }),
    prisma.user.create({ data: { name: "Rider Two", email: "rider@bikeauction.test", passwordHash, role: "USER" } })
  ]);

  const now = Date.now();
  const bikes = [];
  const auctions = [];
  const bidRows = [];

  for (let index = 0; index < 50; index += 1) {
    const spec = bikeSpec(index);
    const bike = await prisma.bike.create({ data: spec });
    const timing = auctionTiming(index, now);
    const hasBids = timing.status === "LIVE" || timing.status === "ENDED";
    const currentBid = hasBids ? spec.basePrice + 2000 + (index % 6) * 1500 : null;
    const winnerId = timing.status === "ENDED" && currentBid !== null && currentBid >= spec.reservePrice ? (index % 2 === 0 ? buyer.id : rider.id) : null;
    const auction = await prisma.auction.create({
      data: {
        bikeId: bike.id,
        status: timing.status,
        startTime: timing.startTime,
        endTime: timing.endTime,
        currentBid,
        minimumIncrement: spec.basePrice > 120000 ? 2000 : 1000,
        winnerId,
        endedAt: timing.status === "ENDED" ? timing.endTime : null
      }
    });
    bikes.push(bike);
    auctions.push(auction);
    if (hasBids && currentBid) {
      bidRows.push({ auctionId: auction.id, userId: buyer.id, amount: Math.max(currentBid - 2000, spec.basePrice) });
      bidRows.push({ auctionId: auction.id, userId: rider.id, amount: currentBid });
    }
  }

  await prisma.bid.createMany({ data: bidRows });
  await prisma.watchlistItem.createMany({
    data: auctions.slice(0, 10).map((auction, index) => ({
      auctionId: auction.id,
      userId: index % 2 === 0 ? buyer.id : rider.id
    }))
  });
  await prisma.inspectionRequest.createMany({
    data: auctions.slice(0, 8).map((auction, index) => ({
      auctionId: auction.id,
      userId: index % 2 === 0 ? buyer.id : rider.id,
      preferredDate: new Date(now + (3 + index) * 60 * 60_000),
      type: index % 3 === 0 ? "VIDEO_CALL" : index % 3 === 1 ? "INSPECTION" : "TEST_RIDE",
      status: index % 2 === 0 ? "REQUESTED" : "CONFIRMED",
      note: "Please verify cold start, tyre condition, service record, and RC transfer readiness."
    }))
  });
  await prisma.sellerLead.createMany({
    data: [
      { name: "Neeraj Kumar", phone: "+91 98765 43210", city: "Gurgaon", brand: "Bajaj", model: "Dominar 400", year: 2020, expectedPrice: 115000, wantsPickup: true, notes: "Wants an inspection slot this weekend." },
      { name: "Aisha Mehra", phone: "+91 98989 12121", city: "Delhi", brand: "TVS", model: "Apache RTR 160", year: 2022, expectedPrice: 82000, wantsPickup: false, notes: "Has service records and insurance copy." },
      { name: "Rohit Saini", phone: "+91 98111 22445", city: "Jaipur", brand: "Royal Enfield", model: "Hunter 350", year: 2023, expectedPrice: 138000, wantsPickup: true, notes: "Single owner and insurance active." },
      { name: "Kavya Sharma", phone: "+91 99100 77441", city: "Faridabad", brand: "Yamaha", model: "FZ-S FI", year: 2021, expectedPrice: 78000, wantsPickup: true, notes: "Minor scratches on tank panel." }
    ]
  });

  console.log({ admin: admin.email, buyer: buyer.email, password: "Password123!", bikes: bikes.length, auctions: auctions.length, imageSource: "Vutto public structured data" });
}

main().finally(() => prisma.$disconnect());
