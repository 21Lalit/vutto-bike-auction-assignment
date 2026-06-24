import { Link } from "react-router-dom";
import { ArrowRight, BadgeCheck, Gauge, MapPin, Timer } from "lucide-react";
import { Auction } from "../api/client";
import { formatKm, formatMoney, timeLeft } from "../utils";

export function AuctionCard({ auction }: { auction: Auction }) {
  return (
    <Link className="auctionCard" to={`/auctions/${auction.id}`} aria-label={`${auction.status === "LIVE" ? "Join auction" : "View details"} for ${auction.bike.title}`}>
      <img src={auction.bike.photos[0]} alt={auction.bike.title} />
      <div className="cardBody">
        <span className={`status ${auction.status.toLowerCase()}`}>{auction.status}</span>
        <h3>{auction.bike.title}</h3>
        <p className="muted">{auction.bike.year} {auction.bike.brand} {auction.bike.model}</p>
        <div className="trustMini"><BadgeCheck size={15} /> Certified inspection</div>
        <div className="cardFacts"><span>{auction.bike.condition}</span><span><Gauge size={14} /> {formatKm(auction.bike.mileage)}</span></div>
        <div className="meta"><MapPin size={16} /> {auction.bike.location}</div>
        <div className="bidLine"><strong>{formatMoney(auction.currentBid ?? auction.bike.basePrice)}</strong><span><Timer size={16} /> {timeLeft(auction.endTime)}</span></div>
        <span className="cardCta">{auction.status === "LIVE" ? "Join auction" : "View details"} <ArrowRight size={17} /></span>
      </div>
    </Link>
  );
}
