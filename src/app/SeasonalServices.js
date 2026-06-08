"use client";

import { useState } from "react";

const seasonalServices = [
  {
    season: "Spring",
    services: ["Lawn mowing", "Edging", "Fresh mulch", "Spring cleanup", "Blowing"],
  },
  {
    season: "Summer",
    services: ["Lawn mowing", "Edging", "Trim work", "Blowing", "Bed touch-ups"],
  },
  {
    season: "Fall",
    services: ["Final mowing", "Leaf raking", "Leaf blowing", "Bagging", "Curbside piles"],
  },
  {
    season: "Winter",
    services: ["Snow shoveling", "Sidewalks", "Steps", "Entry paths", "Driveways"],
  },
];

export default function SeasonalServices() {
  const [activeSeason, setActiveSeason] = useState(null);
  const active = seasonalServices.find((item) => item.season === activeSeason);

  function handleBlur(event) {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setActiveSeason(null);
    }
  }

  return (
    <div
      className={`hero-proof season-proof${active ? " is-active" : ""}`}
      aria-label="Seasonal services"
      onMouseLeave={() => setActiveSeason(null)}
      onBlur={handleBlur}
    >
      <div className="season-picker">
        {seasonalServices.map((item) => (
          <button
            className="season-hit"
            key={item.season}
            type="button"
            onFocus={() => setActiveSeason(item.season)}
            onMouseEnter={() => setActiveSeason(item.season)}
          >
            <span className="season-hit-label">{item.season}</span>
          </button>
        ))}
      </div>

      {active ? (
        <div className="season-detail" aria-live="polite">
          <div className="season-detail-name">{active.season}</div>
          <div className="season-detail-body">
            <span className="season-detail-kicker">Common this season</span>
            <ul className="season-service-list">
              {active.services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}
