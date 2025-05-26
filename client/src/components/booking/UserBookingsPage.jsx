import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getBookings, deleteBooking, getDetailsOfEvent } from '../../services/api';
import EventCard from '../event/EventCard';
import { toast } from 'react-toastify';

const UserBookingsPage = () => {
  const { user, isLoggedIn, loading: authLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookingsAndEvents = async () => {
      if (authLoading) return;
      if (!isLoggedIn) {
        setError('Please log in to view your bookings.');
        setLoading(false);
        navigate('/register');
        return;
      }

      try {
        const response = await getBookings();
        const bookingsData = response.data || [];
        setBookings(bookingsData);

        const eventPromises = bookingsData
          .filter((booking) => booking.event)
          .map((booking) =>
            getDetailsOfEvent(booking.event).then((res) => ({
              eventId: booking.event,
              data: res.data,
            }))
          );
        const eventResults = await Promise.allSettled(eventPromises);
        const eventsMap = {};
        eventResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            eventsMap[result.value.eventId] = result.value.data;
          }
        });
        setEvents(eventsMap);
        setLoading(false);

        if (location.state?.showBookingId) {
          const newBooking = bookingsData.find(
            (b) => b._id === location.state.showBookingId
          );
          if (newBooking && eventsMap[newBooking.event]) {
            setSelectedBooking({
              ...newBooking,
              event: eventsMap[newBooking.event],
            });
          }
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          'Failed to load bookings. Please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        setLoading(false);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/login');
        }
      }
    };

    fetchBookingsAndEvents();
  }, [authLoading, isLoggedIn, location.state, navigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!isLoggedIn) {
      toast.error('Please log in to cancel bookings.');
      navigate('/login');
      return;
    }

    try {
      await deleteBooking(bookingId);
      setBookings(
        bookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: 'canceled' }
            : booking
        )
      );
      setError('');
      setSelectedBooking(null);
      toast.success('Booking canceled successfully!');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to cancel booking.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const openBookingModal = async (booking) => {
    if (!isLoggedIn) {
      toast.error('Please log in to view booking details.');
      navigate('/register');
      return;
    }

    try {
      let eventData = events[booking.event];
      if (!eventData) {
        const response = await getDetailsOfEvent(booking.event);
        eventData = response.data;
        setEvents((prev) => ({ ...prev, [booking.event]: eventData }));
      }
      setSelectedBooking({ ...booking, event: eventData });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to load event details.';
      toast.error(errorMessage);
    }
  };

  const closeBookingModal = () => {
    setSelectedBooking(null);
  };

  const getTotalPrice = (booking) => {
    if (booking?.totalPrice) return booking.totalPrice.toFixed(2);
    if (booking?.numberOfTickets && booking?.event?.ticketPricing) {
      return (booking.numberOfTickets * booking.event.ticketPricing).toFixed(2);
    }
    return 'N/A';
  };

  if (authLoading || loading) return <p className="text-center text-light">Loading bookings...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
<style>
        {`
          body {
            font-family: 'Montserrat', sans-serif;
            color: #1A1A1A;
          }
          h2 {
            font-size: 2.5rem;
            font-weight: 700;
            letter-spacing: 1px;
            margin-bottom: 3rem;
            text-align: center;
          }
          .booking-card {
            background: #FFFFFF;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
            overflow: hidden;
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            position: relative;
            margin-bottom: 2rem;
          }
          .booking-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 36px rgba(0, 0, 0, 0.12);
          }
          .booking-header {
            padding: 2rem;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
          }
          .booking-body {
            padding: 2rem;
          }
          .btn-primary {
            background: linear-gradient(135deg, #FF6B6B 0%, #FFA96C 100%);
            border: none;
            border-radius: 8px;
            padding: 0.8rem 2rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: white;
            transition: all 0.3s ease;
          }
          .btn-primary:hover {
            background: linear-gradient(135deg, #FF5252 0%, #FF8A5F 100%);
            transform: translateY(-2px);
          }
          .btn-danger {
            background: #FF4D4F;
            border: none;
            border-radius: 8px;
            padding: 0.8rem 2rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: white;
            transition: all 0.3s ease;
          }
          .btn-danger:hover {
            background: #d62c2f;
            transform: translateY(-2px);
          }
          .modal-content {
            background: #FFFFFF;
            border: none;
            border-radius: 16px;
            box-shadow: 0 10px 50px rgba(0, 0, 0, 0.15);
          }
          .modal-header {
            background: #F8FAFC;
            border-bottom: none;
            padding: 1.5rem 2rem;
          }
          .modal-footer {
            border-top: none;
            padding: 1rem 2rem;
            background: #F8FAFC;
          }
          .event-title {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            letter-spacing: 0.5px;
          }
          .event-detail {
            font-size: 1rem;
            color: #555;
            margin-bottom: 0.75rem;
            line-height: 1.6;
          }
          .status-confirmed {
            color: #4CAF50;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-canceled {
            color: #FF4D4F;
            font-weight: 600;
            text-transform: uppercase;
          }
          .d-flex.gap-3 {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }
          .logo-badge {
            width: 40px;
            height: 40px;
            background: #FF6B6B;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            margin-right: 1rem;
          }
        `}
      </style>
  
      {/* Rest of your content stays the same */}
      <h2 className="mb-5 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-center text-muted" style={{ fontSize: '1.2rem', color: '#888' }}>
          No bookings found.
        </p>
      ) : (
        <div className="row justify-content-center">
          {bookings.map((booking) => {
            const event = events[booking.event] || {};
            return (
              <div key={booking._id} className="col-md-6 col-lg-4 mb-4">
                <div className="booking-card">
                  <div className="booking-header">
                    <h5 className="event-title">{event.title || 'Unknown Event'}</h5>
                    <p className="event-detail mb-0">
                      Date: {event.date ? new Date(event.date).toLocaleDateString() : 'N/A'}
                    </p>
                    <p className="event-detail mb-0">
                      Location: {event.location || 'Unknown Location'}
                    </p>
                    <p className="event-detail mb-0">
                      Price: ${event.ticketPricing ? event.ticketPricing.toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div className="booking-body">
                    <p className="event-detail">
                      <strong>Quantity:</strong> {booking.numberOfTickets || 'N/A'}
                    </p>
                    <p className="event-detail">
                      <strong>Total Price:</strong> ${getTotalPrice({ ...booking, event })}
                    </p>
                    <p className="event-detail">
                      <strong>Status:</strong>{' '}
                      <span
                        className={
                          booking.status === 'confirmed'
                            ? 'status-confirmed'
                            : 'status-canceled'
                        }
                      >
                        {booking.status
                          ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
                          : 'Unknown'}
                      </span>
                    </p>
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => openBookingModal(booking)}
                      >
                        View Details
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelBooking(booking._id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
  
      {/* Modal remains unchanged */}
      {selectedBooking && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details</h5>
                <button className="btn-close" onClick={closeBookingModal}></button>
              </div>
              <div className="modal-body">
                <EventCard
                  event={{
                    _id: selectedBooking.event?._id || '',
                    title: selectedBooking.event?.title || 'Unknown Event',
                    description: selectedBooking.event?.description || 'No description available',
                    date: selectedBooking.event?.date
                      ? new Date(selectedBooking.event.date).toLocaleString()
                      : 'N/A',
                    location: selectedBooking.event?.location || 'Unknown Location',
                    category: selectedBooking.event?.category || 'Unknown Category',
                    ticketPricing: selectedBooking.event?.ticketPricing || 0,
                    remainingTickets: selectedBooking.event?.remainingTickets || 0,
                  }}
                />
                <p className="event-detail">
                  <strong>Booking ID:</strong> {selectedBooking._id || 'N/A'}
                </p>
                <p className="event-detail">
                  <strong>Quantity:</strong> {selectedBooking.numberOfTickets || 'N/A'}
                </p>
                <p className="event-detail">
                  <strong>Total Price:</strong> ${getTotalPrice(selectedBooking)}
                </p>
                <p className="event-detail">
                  <strong>Status:</strong>{' '}
                  <span
                    className={
                      selectedBooking.status === 'confirmed'
                        ? 'status-confirmed'
                        : 'status-canceled'
                    }
                  >
                    {selectedBooking.status
                      ? selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)
                      : 'Unknown'}
                  </span>
                </p>
              </div>
              <div className="modal-footer">
                {selectedBooking.status === 'confirmed' && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleCancelBooking(selectedBooking._id)}
                  >
                    Cancel Booking
                  </button>
                )}
                <button className="btn btn-secondary" onClick={closeBookingModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;