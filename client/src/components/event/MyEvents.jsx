import React, { useEffect, useState } from 'react';
import { getUserEvents } from '../../services/api';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events created by the current organizer
    const fetchEvents = async () => {
      try {
        const response = await getUserEvents();
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = (eventId) => {
    // Redirect to the edit page for the event
    window.location.href = `/edit-event/${eventId}`;
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/api/events/${eventId}`); // Adjust API endpoint as needed
        setEvents(events.filter((event) => event.id !== eventId));
      } catch (err) {
        alert('Failed to delete the event.');
      }
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <button onClick={() => handleEdit(event.id)}>Edit</button>
              <button onClick={() => handleDelete(event.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyEvents;