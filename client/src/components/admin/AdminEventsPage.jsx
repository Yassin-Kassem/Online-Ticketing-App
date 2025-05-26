import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getAllEvents, updateStatus } from '../../services/api';
import { toast } from 'react-toastify';
import useRequireRole from '../../routes/roleCheck';

const AdminEventsPage = () => {
    useRequireRole(['System Admin']);
  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  // Redirect if not admin
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/register');
    }
  }, [isLoggedIn, user, navigate]);

  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        setEvents(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load events.');
        setLoading(false);
        toast.error('Failed to load events.');
      }
    };

    fetchEvents();
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  // Apply filter
  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  // Handle approve/decline action
  const handleUpdateStatus = async (eventId, newStatus) => {
    try {
      await updateStatus(eventId, { status: newStatus });
      setEvents(
        events.map((event) =>
          event._id === eventId ? { ...event, status: newStatus } : event
        )
      );
      toast.success(`Event ${newStatus} successfully.`);
    } catch (err) {
      toast.error(`Failed to update event status.`);
    }
  };

  if (loading)
    return <p className="text-center" style={{ color: '#555' }}>Loading events...</p>;
  if (error)
    return (
      <div className="alert alert-danger text-center" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        {error}
      </div>
    );

  return (
    <div
      className="container-fluid py-5"
      style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}
    >
      <style>
        {`
          body {
            font-family: 'Montserrat', sans-serif;
            color: #1A1A1A;
            background-color: #F8FAFC;
          }

          h2 {
            font-size: 2.5rem;
            font-weight: 700;
            letter-spacing: 1px;
            background: linear-gradient(135deg, #6C47FF 0%, #00D9E9 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-align: center;
            margin-bottom: 2rem;
          }

          .filter-select {
            background: white;
            border: 1px solid #ddd;
            padding: 0.75rem 1rem;
            border-radius: 10px;
            color: #333;
            font-size: 1rem;
            margin-bottom: 2rem;
            width: 100%;
            max-width: 300px;
            margin-left: auto;
            margin-right: auto;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }

          .filter-select:hover {
            border-color: #6C47FF;
          }

          .table-container {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            font-size: 1rem;
          }

          th,
          td {
            padding: 1rem 1.5rem;
            text-align: left;
            color: #333;
            vertical-align: middle;
          }

          th {
            background: linear-gradient(135deg, #6C47FF 0%, #00D9E9 100%);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          tr:nth-child(even) {
            background-color: #f9f9f9;
          }

          tr:hover {
            background-color: #f1f3f5;
          }

          .status-pill {
            display: inline-block;
            padding: 0.4rem 0.8rem;
            border-radius: 999px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
          }

          .status-approved {
            background-color: #e8f5e9;
            color: #4CAF50;
          }

          .status-pending {
            background-color: #fff8e1;
            color: #FFB300;
          }

          .status-declined {
            background-color: #ffebee;
            color: #EF5350;
          }

          .action-buttons button {
            margin-right: 0.5rem;
            border-radius: 8px;
            padding: 0.5rem 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            transition: all 0.3s ease;
            border: none;
          }

          .btn-approve {
            background: linear-gradient(135deg, #6C47FF 0%, #00D9E9 100%);
            color: white;
          }

          .btn-approve:hover {
            transform: translateY(-2px);
            background: linear-gradient(135deg, #5A3AD9 0%, #00B6CC 100%);
          }

          .btn-decline {
            background: #FF4D4F;
            color: white;
          }

          .btn-decline:hover {
            background: #d62c2f;
            transform: translateY(-2px);
          }

          .no-events {
            text-align: center;
            padding: 3rem;
            color: #888;
            font-size: 1.1rem;
          }
        `}
      </style>

      <h2>Manage Events</h2>

      <div className="mb-4 d-flex justify-content-center">
        <select className="filter-select" value={filter} onChange={handleFilterChange}>
          <option value="all">All Events</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        event.status === 'approved'
                          ? 'status-approved'
                          : event.status === 'pending'
                          ? 'status-pending'
                          : 'status-declined'
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td>{event.location}</td>
                  <td className="action-buttons">
                    {event.status !== 'approved' && (
                      <button
                        className="btn btn-approve"
                        onClick={() => handleUpdateStatus(event._id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {event.status !== 'declined' && (
                      <button
                        className="btn btn-decline"
                        onClick={() => handleUpdateStatus(event._id, 'declined')}
                      >
                        Decline
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-events">
                  No events found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEventsPage;