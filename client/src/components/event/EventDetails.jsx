import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookTicketsForm from '../booking/BookTicketForm';
import { getDetailsOfEvent } from '../../services/api';

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getDetailsOfEvent(id);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (!event) return <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#333333' }}>Loading event details...</p>;

  const ticketStatus =
    event.remainingTickets === 0
      ? 'Sold Out'
      : event.remainingTickets <= 5
      ? `Only ${event.remainingTickets} tickets left`
      : `${event.remainingTickets} tickets available`;

  return (
    <div
      className="event-details-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F8FAFC',
        color: '#333333',
        fontFamily: "'Montserrat', sans-serif",
        marginTop: '100px'
      }}
    >
      <style>
        {`
          .event-details-page h2 {
            font-size: 2.5rem;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 2rem;
            color: rgb(23, 103, 182);
          }
          .event-details-page p {
            font-size: 1.3rem;
            margin-bottom: 1.5rem;
            text-align: left;
            line-height: 1.6;
          }
          .event-details-page strong {
            font-weight: 600;
            color:rgb(23, 103, 182);
          }
          .event-card {
            width: 90%;
            max-width: 800px;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            background: white;
            border: 1px solid #E0E0E0;
            margin-top: 2rem;
          }
          .sold-out {
            color: #FF4D4F;
            font-weight: 600;
          }
          .low-tickets {
            color: #FFA500;
            font-weight: 600;
          }
          .available {
            color: #4CAF50;
            font-weight: 600;
          }
          .sold-out-message {
            color: #FF4D4F;
            font-weight: 600;
            margin-top: 2rem;
            font-size: 1.2rem;
          }
          @media (max-width: 768px) {
            .event-card {
              width: 95%;
              padding: 2rem;
            }
            .event-details-page h2 {
              font-size: 2rem;
            }
            .event-details-page p {
              font-size: 1.1rem;
            }
          }
        `}
      </style>

      <div className="event-card">
        <h2>{event.title}</h2>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Category:</strong> {event.category}</p>
        <p><strong>Ticket Price:</strong> ${event.ticketPricing}</p>
        <p>
          <strong>Tickets Available:</strong>{' '}
          <span className={event.remainingTickets === 0 ? 'sold-out' : event.remainingTickets <= 5 ? 'low-tickets' : 'available'}>
            {ticketStatus}
          </span>
        </p>
      </div>

      {event.remainingTickets > 0 ? (
        <BookTicketsForm eventId={id} maxTickets={event.remainingTickets} />
      ) : (
        <p className="sold-out-message">No tickets available for booking.</p>
      )}
    </div>
  );
};

export default EventDetailsPage;