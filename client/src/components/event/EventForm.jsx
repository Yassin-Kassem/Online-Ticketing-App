import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    ticketPricing: '',
    totalTicketsAvailable: '',
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchEvent = async () => {
        try {
          const res = await axios.get(`/api/v1/events/${id}`);
          console.log('Fetched event data:', res.data); // Debug log
          if (res.data) {
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
          }
        } catch (error) {
          console.error('Error fetching event:', error);
          alert('Failed to load event data');
        }
      };
      fetchEvent();
    }
  }, [id, isEdit]);

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
      // Format the date properly
      const formattedDate = new Date(formData.date).toISOString();
      
      // Prepare the payload with proper data types
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
        if (response.status !== 200) {
          throw new Error('Failed to update event');
        }
      } else {
        response = await axios.post('/api/v1/events', payload);
        if (response.status !== 201) {
          throw new Error('Failed to create event');
        }
      }

      // Only navigate if the request was successful
      if (response.data) {
        navigate('/events');
      }
    } catch (error) {
      console.error('Error details:', error);
      alert(`Error: ${error.response?.data?.message || error.message || 'Something went wrong'}`);
    }
  };

  // Add console log to monitor form data changes
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEdit ? 'Edit Event' : 'Create New Event'}</h2>

      <label>Title</label>
      <input type="text" name="title" value={formData.title} onChange={handleChange} required />

      <label>Description</label>
      <textarea name="description" value={formData.description} onChange={handleChange} required />

      <label>Date</label>
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <label>Location</label>
      <input type="text" name="location" value={formData.location} onChange={handleChange} required />

      <label>Category</label>
      <input type="text" name="category" value={formData.category} onChange={handleChange} required />

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

      <button type="submit">{isEdit ? 'Update Event' : 'Create Event'}</button>
    </form>
  );
};

export default EventForm;