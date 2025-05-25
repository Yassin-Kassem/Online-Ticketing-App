import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import axios from 'axios';

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null);
  const { id } = useParams(); // Use useParams to get the event ID

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/v1/events/${id}`);
        setEvent(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]); // Add id to dependencies

  if (!event) return <p>Loading event details...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Category:</strong> {event.category}</p>
      <p><strong>Ticket Price:</strong> ${event.ticketPricing}</p>
      <p><strong>Tickets Available:</strong> {event.totalTicketsAvailable}</p>
    </div>
  );
};

export default EventDetailsPage;