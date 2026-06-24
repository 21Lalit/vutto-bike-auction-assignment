import { Link } from "react-router-dom";
import { Clock, ExternalLink, MapPin } from "lucide-react";
import { vuttoHubs } from "../data/vutto";

export function Hubs() {
  return (
    <main className="page">
      <div className="pageHeader"><div><h1>Vutto Bike Hubs</h1><p>Use Vutto locations for inspection, document support, test-ride requests, and auction handoff.</p></div></div>
      <section className="hubGrid">
        {vuttoHubs.map((hub) => (
          <article className="hubCard" key={hub.name}>
            <span className="status scheduled">{hub.city}</span>
            <h2>{hub.name}</h2>
            <p><MapPin size={17} /> {hub.address}</p>
            <p><Clock size={17} /> {hub.hours}</p>
            <div className="eventActions">
              <Link className="button" to={`/auctions?location=${hub.city}`}>View bikes</Link>
              <a className="button ghost" href={hub.mapUrl} target="_blank" rel="noreferrer"><ExternalLink size={17} /> Directions</a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
