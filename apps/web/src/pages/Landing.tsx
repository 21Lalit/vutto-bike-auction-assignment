import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Bike, CalendarDays, ClipboardCheck, Clock, CreditCard, FileCheck2, MapPin, ShieldCheck, Zap } from "lucide-react";
import { vuttoAuctionSteps } from "../data/vutto";

export function Landing() {
  return (
    <main>
      <section className="hero">
        <div>
          <span className="eyebrow">vutto-auctions-demo</span>
          <h1>vutto-auctions-demo</h1>
          <p>Bid on certified used bikes online, inspect shortlisted vehicles at Vutto hubs, and complete ownership handoff with a guided auction workflow.</p>
          <div className="actions">
            <Link className="button" to="/auctions">Browse auctions <ArrowRight size={18} /></Link>
            <Link className="button ghost" to="/events"><CalendarDays size={18} /> Auction events</Link>
            <Link className="button ghost" to="/sell">Sell your bike</Link>
          </div>
        </div>
      </section>
      <section className="featureBand">
        <div><Zap /> Live bids update instantly across every viewer.</div>
        <div><Clock /> Clear countdowns and lifecycle status on each auction.</div>
        <div><ShieldCheck /> Admin-managed listings, schedules, and users.</div>
      </section>
      <section className="page assuranceSection">
        <div className="pageHeader"><div><h1>Built for high-trust used-bike auctions</h1><p>Marketplace cues from modern used-bike buying flows, adapted for live auctions.</p></div></div>
        <div className="assuranceGrid">
          <div><BadgeCheck /><h3>Certified inspection</h3><p>Show buyer-facing inspection status on every auction card and detail page.</p></div>
          <div><FileCheck2 /><h3>Ownership support</h3><p>Surface document readiness, transfer notes, and post-win handoff expectations.</p></div>
          <div><CreditCard /><h3>Finance estimate</h3><p>Help buyers understand affordability before they join a live auction.</p></div>
          <div><ClipboardCheck /><h3>Challan readiness</h3><p>Give admins a place to track open document or challan checks before auction start.</p></div>
        </div>
      </section>
      <section className="page journeySection">
        <div className="pageHeader"><div><h1>Smarter Vutto bidding journey</h1><p>A bike-only auction flow inspired by large phygital auction marketplaces, simplified for Vutto buyers.</p></div></div>
        <div className="journeyGrid">
          {vuttoAuctionSteps.map((step, index) => <div key={step}><span>{index + 1}</span><strong>{step}</strong></div>)}
        </div>
      </section>
      <section className="locationBand">
        <div><Bike /><strong>Popular hubs</strong></div>
        {["Delhi", "Gurgaon", "Faridabad", "Jaipur"].map((city) => <Link key={city} to={`/auctions?location=${city}`}><MapPin size={16} /> {city}</Link>)}
        <Link to="/hubs"><MapPin size={16} /> All Vutto hubs</Link>
      </section>
    </main>
  );
}
