import React, { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loader from '../shared/Loader';

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  // Get auth state
  const { user, isLoggedIn, loading } = useContext(AuthContext);

  // State for form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    ticketPricing: '',
    totalTicketsAvailable: '',
  });

  // 🔐 Role Check Effect
  useEffect(() => {
    if (loading) return; // Don't check while still loading

    const normalizedRole = user?.role?.toLowerCase();

    if (!isLoggedIn || !user || normalizedRole !== 'organizer') {
      console.warn('Access denied. Redirecting to /unauthorized', {
        isLoggedIn,
        role: user?.role,
      });
      navigate('/unauthorized', { replace: true });
    }
  }, [isLoggedIn, user, loading]);

  // Fetch event data if editing
  useEffect(() => {
    if (!isEdit || loading) return;

    const fetchEvent = async () => {
      try {
        const res = await axios.get(`/api/v1/events/${id}`);
        const formattedDate = new Date(res.data.date).toISOString().slice(0, 16);
        setFormData({
          title: res.data.title || '',
          description: res.data.description || '',
          date: formattedDate,
          location: res.data.location || '',
          category: res.data.category || '',
          ticketPricing: res.data.ticketPricing?.toString() || '',
          totalTicketsAvailable: res.data.totalTicketsAvailable?.toString() || '',
        });
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to load event data');
      }
    };

    fetchEvent();
  }, [id, isEdit, loading]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? value.replace(/^0+/, '') : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = new Date(formData.date).toISOString();
      const payload = {
        title: formData.title,
        description: formData.description,
        date: formattedDate,
        location: formData.location,
        category: formData.category,
        ticketPricing: parseFloat(formData.ticketPricing),
        totalTicketsAvailable: parseInt(formData.totalTicketsAvailable),
      };

      let response;
      if (isEdit) {
        response = await axios.put(`/api/v1/events/${id}`, payload);
      } else {
        response = await axios.post('/api/v1/events', payload);
      }

      if (response.status === 200 || response.status === 201) {
        navigate('/profile'); // Or wherever you want to send them after submit
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  // Show loading UI until auth resolves
  if (loading || !isLoggedIn || user?.role?.toLowerCase() !== 'organizer') {
    return <Loader text="Verifying access..." />;
  }

  // ✅ All good — render the form
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>

        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Date</label>
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <label>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label>Ticket Price ($)</label>
        <input
          type="number"
          name="ticketPricing"
          value={formData.ticketPricing}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />

        <label>Total Tickets Available</label>
        <input
          type="number"
          name="totalTicketsAvailable"
          value={formData.totalTicketsAvailable}
          onChange={handleChange}
          required
          min="1"
          step="1"
        />

        <button type="submit" className="btn btn-primary mt-3">
          {isEdit ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;