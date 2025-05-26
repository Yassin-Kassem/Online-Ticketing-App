import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../../services/api'; // Correct import

const BookTicketsForm = ({ eventId, maxTickets, ticketPrice }) => {
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
      const res = await createBooking(bookingData); // Corrected to createBooking
      setSuccessMessage(    );
      setTotalPrice(res.data.totalPrice);
      setTimeout(() => {
        navigate('/bookings', { state: { showBookingId: res.data._id } }); // Navigate to UserBookingsPage with modal trigger
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h3 className="mb-4 text-center">Book Tickets</h3>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {successMessage ? (
              <div className="text-success text-center">
                <p>{successMessage}</p>
                {totalPrice && (
                  <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="tickets" className="form-label fw-bold">
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
                    className="form-control"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading || !eventId}
                >
                  {loading ? 'Booking...':`Book ${numberOfTickets} Ticket(s)`}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTicketsForm;