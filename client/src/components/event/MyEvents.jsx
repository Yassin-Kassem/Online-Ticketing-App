import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUserEvents } from '../../services/api';
import { deleteEvent } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'; // Import Link for routing
import './events.css';
import useRequireRole from '../../routes/roleCheck';

const MyEvents = () => {
  useRequireRole(['Organizer']);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getUserEvents();
        console.log('Fetched events:', response.data);
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load events.');
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEdit = (event) => {
    const eventId = event.id || event._id;
    if (!eventId) {
      alert('Event ID is missing!');
      return;
    }
    window.location.href = `/my-events/${eventId}/edit`;
  };

  const handleDelete = async (eventId) => {
    if (!eventId) {
      alert('Invalid event ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId); // Use the helper
        setEvents(events.filter((event) => (event.id || event._id) !== eventId));
        toast.success('Event deleted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (err) {
        console.error('Error deleting event:', err);
        toast.error('Failed to delete event.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="event-container">
      <h1 className="page-title">My Events</h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <div key={event.id || event._id} className="event-item">
              <div className="event-details">
                <h3 className="event-name">{event.title || event.name}</h3>
                <p className="event-description">{event.description}</p>
              </div>
              <div className="event-actions">
                <button onClick={() => handleEdit(event)}>Edit</button>
                <button onClick={() => handleDelete(event.id || event._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Button Section */}
      <div className="bottom-buttons">
        <Link to="/my-events/analytics" className="animated-button">Analytics</Link>
        <Link to="/create-event" className="animated-button">Create Event</Link>
      </div>

      <ToastContainer />
    </div>
  );
};

export default MyEvents;