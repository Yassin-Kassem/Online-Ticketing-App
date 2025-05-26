import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../services/api';

const BookTicketsForm = ({ eventId, maxTickets }) => {
  const navigate = useNavigate();
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!eventId || typeof eventId !== 'string') {
      setError('Invalid or missing Event ID');
      setLoading(false);
      return;
    }

    const bookingData = {
      eventId,
      numberOfTickets: parseInt(numberOfTickets) || 1,
    };

    try {
      console.log('Creating booking:', bookingData);
      const res = await createBooking(bookingData);
      setSuccessMessage('Booking successful!');
      setTotalPrice(res.data.totalPrice);
      setTimeout(() => {
        navigate('/bookings', { state: { showBookingId: res.data._id } });
      }, 1500);
    } catch (error) {
      setError(
        error.response?.data?.message || 'An unexpected error occurred'
      );
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <style>
        {`
          .card {
            width: 90%;
            max-width: 400px;
            padding: 3rem;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            background: white;
            border: 1px solid #E0E0E0;
            margin: 2rem auto;
          }
          h3 {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            text-align: center;
            color: #003366;
          }
          label {
            font-size: 1rem;
            font-weight: 600;
            color: #003366;
            margin-bottom: 0.5rem;
            display: block;
          }
          input[type="number"] {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            transition: border-color 0.3s ease-in-out;
          }
          input[type="number"]:focus {
            outline: none;
            border-color: #003366;
            box-shadow: 0 0 0 3px rgba(0, 51, 102, 0.2);
          }
          .btn-primary {
            background-color: #003366;
            color: white;
            border: none;
            padding: 0.75rem;
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
          }
          .btn-primary:hover {
            background-color: #002244;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }
          .alert-danger {
            background-color: #ffebee;
            color: #d32f2f;
            border: none;
            padding: 1rem;
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          .text-success {
            text-align: center;
            font-size: 1.1rem;
            color: #4caf50;
            font-weight: 500;
          }
          @media (max-width: 768px) {
            .card {
              padding: 2rem;
              max-width: 95%;
            }
            h3 {
              font-size: 1.5rem;
            }
          }
        `}
      </style>

      <h3>Book Tickets</h3>

      {error && (
        <div className="alert-danger" role="alert">
          {error}
        </div>
      )}

      {successMessage ? (
        <div className="text-success">
          <p>{successMessage}</p>
          {totalPrice && (
            <p>
              <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
            </p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="tickets">
              Number of Tickets (Max: {maxTickets})
            </label>
            <input
              type="number"
              id="tickets"
              min="1"
              max={maxTickets}
              step="1"
              value={numberOfTickets}
              onChange={(e) =>
                setNumberOfTickets(
                  Math.max(1, Math.min(maxTickets, parseInt(e.target.value) || 1))
                )
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading || !eventId}
          >
            {loading ? 'Booking...' : `Book ${numberOfTickets} Ticket(s)`}
          </button>
        </form>
      )}
    </div>
  );
};

export default BookTicketsForm;