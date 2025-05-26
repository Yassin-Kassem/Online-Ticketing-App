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

  if (!event) return <p>Loading event details...</p>;

  // Display ticket availability
  const ticketStatus =
    event.remainingTickets === 0
      ? 'Sold Out'
      : event.remainingTickets <= 5
      ? `Only ${event.remainingTickets} tickets left`
      : `${event.remainingTickets} tickets available`
  return (
    <div className="container mt-5">
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Ticket Price:</strong> ${event.ticketPricing}</p>
      <p><strong>Tickets Available:</strong> {ticketStatus}</p>
      {event.totalTicketsAvailable > 0 ? (
        <BookTicketsForm eventId={id} maxTickets={event.remainingTickets} />
      ) : (
        <p className="text-danger">No tickets available for booking.</p>
      )}
    </div>
  );
};

export default EventDetailsPage;