import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const { title, date, location, ticketPricing } = event;

  return (
    <Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        padding: '20px',
        width: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
        fontFamily: "'Montserrat', sans-serif",
        border: '1px solid #eee',
        overflow: 'hidden',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(-6px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
      >
        {/* Optional subtle overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(2px)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 1
        }}></div>

        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#111',
          marginBottom: '12px',
          zIndex: 2,
          position: 'relative'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '14px',
          color: '#555',
          margin: '6px 0',
          zIndex: 2,
          position: 'relative'
        }}>
          <strong>Date:</strong> {new Date(date).toLocaleDateString()}
        </p>
        <p style={{
          fontSize: '14px',
          color: '#555',
          margin: '6px 0',
          zIndex: 2,
          position: 'relative'
        }}>
          <strong>Location:</strong> {location}
        </p>
        <p style={{
          fontSize: '14px',
          color: '#333',
          margin: '6px 0',
          fontWeight: '500',
          zIndex: 2,
          position: 'relative'
        }}>
          <strong>Price:</strong> ${ticketPricing}
        </p>
      </div>
    </Link>
  );
};

export default EventCard;