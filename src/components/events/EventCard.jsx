import React from 'react';
import './eventcard.css';

const EventCard = ({ event, variant = 'card' }) => {
  if (!event) return null;

  if (variant === 'grid') {
    return (
      <article className="grid-card">
        <img src={event.image} alt={event.title} />
        <div className="grid-meta">
          <div className="grid-date">{event.date}</div>
          <h4>{event.title}</h4>
          <div className="grid-footer">{event.place} · {event.price} · ★{event.interested}</div>
        </div>
      </article>
    );
  }

  return (
    <article className="event-card">
      <img src={event.image} alt={event.title} />
      <div className="event-meta">
        <div className="event-date">{event.date}</div>
        <h4 className="event-title">{event.title}</h4>
        <div className="event-place">{event.place}</div>
        <div className="event-footer">
          <div className="price">{event.price}</div>
          <div className="interested">★ {event.interested} interested</div>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
