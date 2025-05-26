import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getDetailsOfEvent, updateEvent } from '../../services/api'; // Assume you have getEventById
import { toast } from 'react-toastify';
import useRequireRole from '../../routes/roleCheck';

// Inline styles
const styles = `
  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding-top: 120px; */ /* Removed padding-top */
    min-height: 100vh;
    background-color: #f4f6f8;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    width: 100%; /* Added width: 100% */
  }

  .form-card {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 800px;
  }

  .form-card h2 {
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    color: #333;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #555;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    border-color: #007bff;
    outline: none;
  }

  .submit-button {
    background-color: #28a745;
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
    background-color: #218838;
  }

  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
`;

const EditEventForm = () => {
    useRequireRole(['Organizer']);
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    location: '',
    totalTicketsAvailable: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvent = async () => {
    try {
      const response = await getDetailsOfEvent(id); // Make sure this API call exists
      const eventData = response.data;

      setFormData({
        date: new Date(eventData.date).toISOString().slice(0, 16), // Format for datetime-local
        location: eventData.location,
        totalTicketsAvailable: eventData.totalTicketsAvailable,
      });
    } catch (err) {
      setError('Failed to load event data.');
      toast.error('Failed to load event data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        date: formData.date,
        location: formData.location,
        totalTicketsAvailable: parseInt(formData.totalTicketsAvailable, 10),
      };

      const response = await updateEvent(id, updatedData); // Assuming axios PUT /api/v1/events/:id
      console.log('Event updated:', response.data);

      toast.success('✅ Event updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate('/my-events'); // Redirect after success
    } catch (err) {
      console.error('Error updating event:', err.response?.data || err.message);
      toast.error(`❌ Failed to update event: ${err.message}`, {
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

  if (loading) return <p>Loading event data...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <>
      <style>{styles}</style>
      <div className="form-container">
        <div className="form-card">
          <h2>Edit Event</h2>

          <form onSubmit={handleSubmit}>
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

            <button type="submit" className="submit-button">
              Update Event
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditEventForm;