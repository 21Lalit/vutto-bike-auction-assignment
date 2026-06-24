export const vuttoHubs = [
  {
    city: "Delhi",
    name: "Vutto Uttam Nagar Hub",
    address: "Nawada, Uttam Nagar, Delhi - 110059",
    hours: "10:00 AM - 8:00 PM",
    mapUrl: "https://www.google.com/maps?q=28.6205635,77.0463406"
  },
  {
    city: "Delhi",
    name: "Vutto Peeragarhi Hub",
    address: "Peeragarhi, Delhi - 110041",
    hours: "10:00 AM - 8:00 PM",
    mapUrl: "https://maps.app.goo.gl/KXEiodggvG1hnkka6"
  },
  {
    city: "Gurgaon",
    name: "Vutto Gurgaon Hub",
    address: "60/9, New Railway Rd, Subhash Nagar, Sector 8, Gurgaon, Haryana - 122001",
    hours: "10:00 AM - 8:00 PM",
    mapUrl: "https://www.google.com/maps?q=28.4693101,77.0241081"
  },
  {
    city: "Delhi",
    name: "Vutto Shahdara Hub",
    address: "Plot No. C-30/31, 564/2, Near Metro Pillar 113, Main Road, Kanti Nagar, Shahdara, New Delhi - 110051",
    hours: "10:00 AM - 8:00 PM",
    mapUrl: "https://maps.app.goo.gl/UPkcJ8JFQ7rmcGiQ7"
  },
  {
    city: "Delhi",
    name: "Vutto Khanpur Hub",
    address: "D-8-A, Krishna Park, Devli Road, Khanpur, New Delhi - 110062",
    hours: "10:00 AM - 8:00 PM",
    mapUrl: "https://maps.app.goo.gl/3bdRfA78p2zQ3UfYA"
  },
  {
    city: "Faridabad",
    name: "Vutto Faridabad Hub",
    address: "1-A/250, NIT-1, Faridabad, Haryana - 121001",
    hours: "10:00 AM - 8:00 PM",
    mapUrl: "https://maps.app.goo.gl/tMhHsZ3U5ruLH6r47"
  },
  {
    city: "Jaipur",
    name: "Vutto Jaipur Hub",
    address: "Shop no. 16, 17, Kalyan Vihar, Tonk Rd, Sitabari, Sanganer, Jaipur, Rajasthan - 302029",
    hours: "10:00 AM - 8:00 PM",
    mapUrl: "https://maps.app.goo.gl/peuY9hVGvfJvxTk39"
  }
];

export const vuttoAuctionSteps = [
  "Register and verify your account",
  "Inspect or shortlist bikes at a Vutto hub",
  "Bid live online during the auction window",
  "Win, complete payment, and get ownership handoff support"
];

export function hubForLocation(location: string) {
  return vuttoHubs.find((hub) => location.toLowerCase().includes(hub.city.toLowerCase())) ?? vuttoHubs[0];
}
