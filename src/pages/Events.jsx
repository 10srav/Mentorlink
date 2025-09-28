import React, { useMemo, useState, useEffect } from 'react';
import HomeNavbar from '../components/common/HomeNavbar';
import Sidebar from '../components/home/Sidebar';
import './Events.css';

const mockCategories = [
  { id: 'ent', title: 'Entertainment', img: 'https://placehold.co/120x120/eee/aaa?text=ENT' },
  { id: 'edu', title: 'Educational & Business', img: 'https://placehold.co/120x120/eee/aaa?text=EDU' },
  { id: 'cult', title: 'Cultural & Arts', img: 'https://placehold.co/120x120/eee/aaa?text=CULT' },
  { id: 'sports', title: 'Sports & Fitness', img: 'https://placehold.co/120x120/eee/aaa?text=SPORT' },
  { id: 'tech', title: 'Technology & Innovation', img: 'https://placehold.co/120x120/eee/aaa?text=TECH' },
  { id: 'travel', title: 'Travel', img: 'https://placehold.co/120x120/eee/aaa?text=TRAV' },
];

const makeEvent = (id, title, date, place, price = 'FREE', interested = 0) => ({
  id, title, date, place, price, interested,
  image: `https://placehold.co/600x360/ccd/889?text=EV${id}`,
});

const popular = [
  makeEvent(1, 'Lakeside Camping at Beach', 'NOV 25-26', 'Pawna', 'INR 1,400', 14),
  makeEvent(2, 'Sound Of Christmas 2023', 'DEC 02', 'Bhanugudi, Kakinada', 'INR 499', 16),
  makeEvent(3, 'Meet the Royal College of Art', 'DEC 02', 'Kakinada 2025', 'FREE', 9),
  makeEvent(4, 'Global Engineering Education Expo 2023', 'DEC 03', 'The St. Regis, Mumbai', 'FREE', 48),
  makeEvent(5, 'Cricket Business Meetup', 'DEC 08', 'Kiet Cricket Stadium', 'INR 399', 12),
  makeEvent(6, 'Valentine\'s Day Special', 'FEB 14', 'Kakinada', 'INR 2,999', 160),
];

const online = [
  makeEvent(20, 'The Road to Jobs and Internships: Webinar', 'JAN 13', 'Online', 'INR 49', 21),
  makeEvent(21, 'Online Zumba Dance Fitness Class', 'NOV 29', 'Online', 'CAD 7', 5),
  makeEvent(22, 'Easy book folding: craft edition', 'DEC 12', 'Online', 'FREE', 10),
];

const trending = [
  makeEvent(40, 'Voca Loca - Aditya Gadhvi', 'NOV 25', 'Vadodara', 'INR 199', 35),
  makeEvent(41, 'Camp United Nations for Girls', 'DEC 02', 'Los Angeles', 'USD 20-45', 8),
  makeEvent(42, 'Bollywood Gen Z Fest', 'DEC 01-02', 'Melbourne', 'INR 99', 60),
];

const Events = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('India');
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Don't miss out — find events you'll love nearby.",
    'Discover curated experiences and online workshops.',
    'Connect with communities, upskill, and have fun!'
  ];

  useEffect(() => {
    const t = setInterval(() => setQuoteIndex(i => (i + 1) % quotes.length), 4200);
    return () => clearInterval(t);
  }, [quotes.length]);

  const filteredPopular = useMemo(() => popular.filter(e => query === '' || e.title.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <div className="events-page layout-with-sidebar">
      <HomeNavbar />
      <div className="page-body">
        <aside className="left-sidebar">
          <Sidebar />
        </aside>

        <main className="events-content">
          <section className="hero">
            <div className="hero-inner">
              <h2 className="hero-title">Explore the world of events</h2>
              <div className="rotating-quote" aria-hidden>
                <span className="quote-clip">
                  {quotes.map((q, i) => (
                    <span key={i} className={`quote ${i === quoteIndex ? 'active' : ''}`}>{q}</span>
                  ))}
                </span>
              </div>

              <div className="search-row">
                <div className="search-input">
                  <span className="search-icon">🔍</span>
                  <input placeholder="Search Events, Categories, Location..." value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div className="search-location">
                  <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="categories">
            <h3>Explore Categories</h3>
            <div className="cat-list circle-cats">
              {mockCategories.map(c => (
                <div key={c.id} className="cat-item circle">
                  <div className="circle-img"><img src={c.img} alt={c.title} /></div>
                  <div className="cat-title">{c.title}</div>
                </div>
              ))}
            </div>
          </section>

      <section className="popular">
        <div className="section-header">
          <h3>Popular Events in {location}</h3>
          <div className="filters">
            <button className="chip">All</button>
            <button className="chip">Today</button>
            <button className="chip">Tomorrow</button>
            <button className="chip">This Weekend</button>
            <button className="chip">Free</button>
          </div>
        </div>

        <div className="horizontal-scroll">
          <div className="cards-track">
            {filteredPopular.map(e => (
              <article key={e.id} className="event-card">
                <img src={e.image} alt={e.title} />
                <div className="event-meta">
                  <div className="event-date">{e.date}</div>
                  <h4 className="event-title">{e.title}</h4>
                  <div className="event-place">{e.place}</div>
                  <div className="event-footer">
                    <div className="price">{e.price}</div>
                    <div className="interested">★ {e.interested} interested</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="see-more-wrap"><button className="see-more">See More</button></div>
      </section>

      <section className="online">
        <h3>Discover Best of Online Events</h3>
        <div className="cards-grid">
          {online.map(e => (
            <article key={e.id} className="grid-card">
              <img src={e.image} alt={e.title} />
              <div className="grid-meta">
                <div className="grid-date">{e.date}</div>
                <h4>{e.title}</h4>
                <div className="grid-footer">{e.place} · {e.price} · ★{e.interested}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="see-more-wrap"><button className="see-more">See More</button></div>
      </section>

      <section className="cta">
        <div className="cta-inner">
          <h3>Events specially curated for you!</h3>
          <p>Get event suggestions tailored to your interests! Don't let your favorite events slip away.</p>
          <button className="cta-btn">Get Started →</button>
        </div>
      </section>

      <section className="trending">
        <h3>Trending Events around the World</h3>
        <div className="cards-grid">
          {trending.map(e => (
            <article key={e.id} className="grid-card">
              <img src={e.image} alt={e.title} />
              <div className="grid-meta">
                <div className="grid-date">{e.date}</div>
                <h4>{e.title}</h4>
                <div className="grid-footer">{e.place} · {e.price} · ★{e.interested}</div>
              </div>
            </article>
          ))}
        </div>

        <div className="see-more-wrap"><button className="see-more">See More</button></div>
      </section>

        </main>
      </div>
    </div>
  );
};

export default Events;
