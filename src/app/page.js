import Image from "next/image";
import EstimateWizard from "./EstimateWizard";
import SeasonalServices from "./SeasonalServices";

const serviceCards = [
  {
    title: "Lawn Mowing",
    detail:
      "Clean, even cuts for the front, back, side strips, and curb line. Simple, regular, and easy to keep up with.",
  },
  {
    title: "Edging + Trim Work",
    detail:
      "Tidy lines along sidewalks, driveways, beds, fences, and the corners the mower can't quite reach.",
  },
  {
    title: "Blowing + Final Cleanup",
    detail:
      "Clippings and loose debris blown off walkways, patios, porches, and driveways before we leave.",
  },
  {
    title: "Mulching",
    detail:
      "Fresh mulch spread evenly around beds, trees, and borders so the yard looks finished and holds moisture better.",
  },
  {
    title: "Raking + Leaf Cleanup",
    detail:
      "Raking, blowing, bagging, or curbside piles depending on what your town is picking up.",
  },
  {
    title: "Snow Shoveling",
    detail:
      "Walkways, steps, entry paths, and driveways cleared so getting in and out is easier after snow.",
  },
];

const projectSlots = [
  {
    number: "01",
    title: "Weekly Lawn Visit",
    scope: "A clean cut, trimmed edges, and hard surfaces blown off before we head out.",
  },
  {
    number: "02",
    title: "Mulch Refresh",
    scope: "Beds cleaned up, mulch laid evenly, and the front of the house looking fresh again.",
  },
  {
    number: "03",
    title: "Seasonal Cleanup",
    scope: "Leaves, sticks, and loose debris cleared when the yard needs a reset.",
  },
];

const reviewNotes = [
  {
    town: "River Edge",
    note: "Edges clean, clippings off the sidewalk, gate closed when we leave.",
  },
  {
    town: "Oradell",
    note: "Beds cleaned up, mulch even, and no mess left on the driveway.",
  },
  {
    town: "Paramus",
    note: "Clear timing, quick replies, and the yard ready to use.",
  },
];

const visitItems = [
  "Cut the grass at a clean, even height",
  "Edge the sidewalks, driveway, and bed lines",
  "Blow off the driveway, walkways, and porch",
  "Add mulch, leaves, or snow help when it comes up",
];

const areasServed = [
  { town: "River Edge", zip: "07661" },
  { town: "Oradell", zip: "07649" },
  { town: "Paramus", zip: "07653" },
];

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" id="top">
        <Image
          src="/garden-state-hero.png"
          alt="Fresh residential garden beds with evergreen shrubs, perennials, mulch, and a clean stone walkway."
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-overlay" />

        <header className="topbar" aria-label="Primary navigation">
          <a className="brand" href="#top" aria-label="Garden State Greenery home">
            <span className="brand-mark" aria-hidden="true">
              <Image
                src="/squareicon.png?v=4"
                alt=""
                width={48}
                height={48}
                className="brand-icon"
                unoptimized
              />
            </span>
            <span className="brand-copy">
              <span>Garden State Greenery</span>
              <small>Lawn care + seasonal cleanup</small>
            </span>
          </a>

          <nav className="nav-links" aria-label="Page sections">
            <a href="#areas">Coverage</a>
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#estimate">Estimate</a>
          </nav>

          <div className="nav-contact">
            <button
              className="contact-trigger"
              type="button"
              aria-haspopup="true"
            >
              Contact Us
            </button>
            <div className="contact-card" role="group" aria-label="Contact info">
              <div className="contact-card-head">
                <span className="mini-label">Get in touch</span>
                <p>For mowing, cleanup, mulch, or snow help.</p>
              </div>

              <div className="contact-methods">
                <a className="contact-method" href="tel:+15515022099">
                  <span className="contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M6.6 3.8 9 3.2l2.2 5-1.5 1.3a10.2 10.2 0 0 0 4.8 4.8l1.3-1.5 5 2.2-.6 2.4c-.3 1.2-1.3 2-2.5 2A14.7 14.7 0 0 1 3.6 5.9c0-1.1.8-2.1 2-2.4Z" />
                    </svg>
                  </span>
                  <span>
                    <small>Call or text</small>
                    <strong>551.502.2099</strong>
                  </span>
                </a>

                <a
                  className="contact-method"
                  href="mailto:hello@gardenstategreenery.co"
                >
                  <span className="contact-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" focusable="false">
                      <path d="M4.5 6h15c.8 0 1.5.7 1.5 1.5v9c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5v-9C3 6.7 3.7 6 4.5 6Zm.7 2 6.8 4.6L18.8 8H5.2Zm13.8 8v-6.2l-7 4.7-7-4.7V16h14Z" />
                    </svg>
                  </span>
                  <span>
                    <small>Email</small>
                    <strong>hello@gardenstategreenery.co</strong>
                  </span>
                </a>
              </div>

              <details className="backup-contact">
                <summary>
                  <span className="backup-closed-label">Show backup number</span>
                  <span className="backup-hide-label">Hide</span>
                </summary>
                <a className="backup-number" href="tel:+15512982835">
                  551.298.2835
                </a>
              </details>
              <p className="contact-note">
                Text the address, a couple photos, and what you want handled.
              </p>
            </div>
          </div>
        </header>

        <div className="hero-content">
          <p className="eyebrow">Local Lawn Care in Bergen County</p>
          <h1 className="hero-logo-heading">
            <Image
              src="/hero-wordmark-glass-flat.png?v=1"
              alt="Garden State Greenery"
              width={1641}
              height={596}
              priority
              sizes="(max-width: 820px) 92vw, 790px"
              className="hero-wordmark"
              unoptimized
            />
          </h1>
          <p className="hero-lede">
            We handle the yard work that piles up: mowing, edging, blowing,
            mulch, leaves, and snow shoveling in River Edge, Oradell, and
            Paramus.
          </p>

          <div className="hero-actions" aria-label="Primary actions">
            <a className="button button-primary" href="#estimate">
              Request an estimate
            </a>
            <a className="button button-secondary" href="#work">
              View the work
            </a>
          </div>

          <SeasonalServices />
        </div>
      </section>

      <section
        className="pitch-section"
        id="areas"
        aria-label="Services and areas served"
      >
        <div className="pitch-copy">
          <p className="section-kicker">Local Lawn Care</p>
          <h2>Routine yard work, done without a fuss.</h2>
          <p>
            Cuts, edges, walkways, mulch, leaves, and snow help when you need
            it. Nothing fancy, just a yard that looks kept.
          </p>
        </div>

        <div className="pitch-panel">
          <div className="pitch-card">
            <span className="mini-label">Areas served</span>
            <div className="area-list">
              {areasServed.map((area) => (
                <span
                  className="area-pill"
                  key={area.town}
                  tabIndex={0}
                  aria-label={`${area.town}, ZIP code ${area.zip}`}
                >
                  <span className="area-name">{area.town}</span>
                  <span className="area-zip" aria-hidden="true">
                    {area.zip}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="pitch-card">
            <span className="mini-label">A typical visit</span>
            <ul className="visit-list">
              {visitItems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <p className="section-kicker">Services</p>
          <h2>The regular jobs, handled cleanly.</h2>
        </div>

        <div className="service-grid">
          {serviceCards.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-dot" aria-hidden="true" />
              <h3>{service.title}</h3>
              <p>{service.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-heading work-heading">
          <div>
            <p className="section-kicker">Work</p>
            <h2>A look at the work we do most often.</h2>
          </div>
          <p>
            Regular cuts, mulch refreshes, seasonal cleanups, and the kind of
            small details that make the yard feel cared for.
          </p>
        </div>

        <div className="project-grid">
          {projectSlots.map((project) => (
            <article className="project-card" key={project.title}>
              <div
                className="project-photo"
                aria-label={`${project.title} example`}
              >
                <span>{project.number}</span>
              </div>
              <div className="project-copy">
                <h3>{project.title}</h3>
                <p>{project.scope}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="review-strip" aria-label="Service priorities">
          <div className="review-strip-copy">
            <p className="mini-label">What matters</p>
            <h3>Details that make the yard look finished.</h3>
          </div>

          <div className="review-note-list">
            {reviewNotes.map((review) => (
              <article className="review-note" key={review.town}>
                <p>{review.note}</p>
                <span>{review.town}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="estimate-section" id="estimate">
        <div>
          <p className="section-kicker">Start Here</p>
          <h2>Tell us what you need done.</h2>
          <p>
            Send the address, a couple photos, and the services you have in
            mind. We will give you a rough estimate and confirm the final price
            after seeing the property.
          </p>
        </div>
        <div className="estimate-card">
          <span className="mini-label">Quick estimate</span>
          <strong>Mowing, cleanup, mulch, or snow help</strong>
          <p>Pick the services, town, yard size, and timing.</p>
          <EstimateWizard />
        </div>
      </section>

      <footer className="footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true">
            <Image
              src="/squareicongreen.png?v=1"
              alt=""
              width={48}
              height={48}
              className="brand-icon"
              unoptimized
            />
          </span>
          <span className="brand-copy">
            <span>Garden State Greenery</span>
            <small>Lawn care + seasonal cleanup</small>
          </span>
        </a>
        <div className="footer-socials" aria-label="Social media links">
          <a
            className="footer-social-link"
            href="https://www.instagram.com/"
            aria-label="Instagram"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="4" y="4" width="16" height="16" rx="5" />
              <circle cx="12" cy="12" r="3.4" />
              <circle cx="17.2" cy="6.8" r="1" />
            </svg>
          </a>
          <a
            className="footer-social-link"
            href="https://www.facebook.com/"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M14.1 8.1H16V4.8c-.9-.1-1.7-.2-2.6-.2-2.6 0-4.3 1.6-4.3 4.5v2.5H6.2v3.7h2.9v8.1h3.8v-8.1h2.9l.5-3.7h-3.4V9.5c0-.9.4-1.4 1.2-1.4Z" />
            </svg>
          </a>
        </div>
      </footer>
    </main>
  );
}
