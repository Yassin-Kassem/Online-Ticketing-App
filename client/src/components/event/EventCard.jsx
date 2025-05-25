import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const { title, date, location, ticketPricing } = event;

  return (
    <Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        width: '250px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        cursor: 'pointer'
      }}>
        <h3>{title}</h3>
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {location}</p>
        <p><strong>Price:</strong> ${ticketPricing}</p>
      </div>
    </Link>
  );
};

export default EventCard;