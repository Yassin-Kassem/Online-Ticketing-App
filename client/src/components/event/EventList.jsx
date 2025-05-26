    import React, { useEffect, useState } from 'react';
    import { getApprovedEvents } from '../../services/api';
    import EventCard from './EventCard';
    import './eventList.css'; // Make sure this path matches where you saved the CSS

    const EventList = () => {
      const [events, setEvents] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      useEffect(() => {
        const fetchEvents = async () => {
          try {
            const res = await getApprovedEvents();
            setEvents(res.data);
          } catch (err) {
            setError('Failed to load events');
          } finally {
            setLoading(false);
          }
        };

        fetchEvents();
      }, []);

      if (loading) return <p className="loading-text">Loading events...</p>;
      if (error) return <p className="error-text">{error}</p>;

      return (
        <div className="event-list-container">
          <h1>Upcoming Events</h1>
          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      );
    };

    export default EventList;