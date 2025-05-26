import React, { useState } from 'react';
import { AuthContext } from '../../context/AuthContext'; // Adjust path as needed
import { createEvent } from '../../services/api';
import { toast } from 'react-toastify';
import useRequireRole from '../../routes/roleCheck';

// Styled using inline style tag
const styles = `
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 420px;
    min-height: 100vh;
    background-color: #FFFFFF;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    width: 100%;
  }

  .form-card {
    background: white;
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 1600px;
    margin: 0 auto;
  }

  .form-card h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: #333;
  }

  .form-group {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }

  .form-group label {
    margin-bottom: 0;
    margin-right: 1rem;
    font-weight: 600;
    color: #555;
    flex-basis: 150px;
    flex-shrink: 0;
    text-align: right;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 600px;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: #007bff;
    outline: none;
  }

  .submit-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    transition: background-color 0.3s ease;
  }

  .submit-button:hover {
    background-color: #0056b3;
  }

  .error-message {
    color: red;
    margin-bottom: 1rem;
  }

  #description {
    min-height: 150px;
    background-color: white;
  }
`;

const CreateEventForm = () => {
  useRequireRole(['Organizer']);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'concert',
    ticketPricing: '',
    totalTicketsAvailable: '',
    remainingTickets: '',
  });

  const { user } = React.useContext(AuthContext);
  const userId = user?.id || user?._id;
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError("You must be logged in to create an event.");
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        ticketPricing: parseFloat(formData.ticketPricing),
        totalTicketsAvailable: parseInt(formData.totalTicketsAvailable, 10),
        remainingTickets: parseInt(formData.remainingTickets || formData.totalTicketsAvailable, 10),
        organizer: userId,
      };

      const response = await createEvent(dataToSend); // Axios POST /api/v1/events
      console.log('Event created:', response.data);

      // Show success toast
      toast.success('🎉 Event created successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'concert',
        ticketPricing: '',
        totalTicketsAvailable: '',
        remainingTickets: '',
      });
    } catch (err) {
      console.error('Error creating event:', err.response?.data || err.message);
      toast.error(`❌ Failed to create event: ${err.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="form-container">
        <div className="form-card">
          <h2>Create New Event</h2>

          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date and Time:</label>
              <input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="ticketPricing">Ticket Price ($):</label>
              <input
                type="number"
                step="0.01"
                id="ticketPricing"
                name="ticketPricing"
                value={formData.ticketPricing}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="totalTicketsAvailable">Total Tickets Available:</label>
              <input
                type="number"
                id="totalTicketsAvailable"
                name="totalTicketsAvailable"
                value={formData.totalTicketsAvailable}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="remainingTickets">Remaining Tickets (optional):</label>
              <input
                type="number"
                id="remainingTickets"
                name="remainingTickets"
                value={formData.remainingTickets}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-button">
              Create Event
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateEventForm;