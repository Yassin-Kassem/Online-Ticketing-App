import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useRequireRole from '../../routes/roleCheck';

const EventAnalytics = () => {
    useRequireRole(['Organizer']);
    const { user, isLoggedIn, loading: authLoading } = useContext(AuthContext);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
        const fetchData = async () => {
          if (authLoading || !isLoggedIn || !user || !user._id) {
            console.log('Not authenticated yet. Skipping fetch.');
            return;
          }
      
          try {
            const response = await fetch('/api/v1/users/events/analytics', {
              method: 'GET',
              credentials: 'include',
            });
      
            if (!response.ok) {
              if (response.status === 401 || response.status === 403) {
                toast.error('Session expired. Redirecting to login...');
                navigate('/register');
                return;
              }
      
              if (response.headers.get('content-type')?.includes('text/html')) {
                toast.error('Authentication required. Redirecting to login...');
                navigate('/register');
                return;
              }
      
              throw new Error('Failed to load analytics');
            }
      
            const contentType = response.headers.get('content-type');
      
            if (!contentType || !contentType.includes('application/json')) {
              toast.error('Unexpected response from server.');
              navigate('/register');
              return;
            }
      
            const data = await response.json();
      
            const formattedData = data.map((event) => ({
              name: event.title,
              'Tickets Booked': event.ticketsBooked,
              'Booking %': parseFloat(event.bookingPercentage),
            }));
      
            setAnalyticsData(formattedData);
            setLoading(false);
          } catch (err) {
            console.error(err);
            toast.error('Failed to load event analytics.');
            setLoading(false);
          }
        };
      
        fetchData();
      }, [authLoading, isLoggedIn, user, navigate]);

    if (authLoading || loading)
      return <p className="text-center" style={{ color: '#555' }}>Loading analytics...</p>;
  
    if (!analyticsData.length)
      return (
        <div className="text-center" style={{ padding: '3rem', fontSize: '1.2rem', color: '#888' }}>
          No events found or no bookings yet.
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
            background-color: #F8FAFC;
            color: #1A1A1A;
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

          .chart-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
            padding: 2rem;
            margin-top: 2rem;
          }

          .no-data {
            text-align: center;
            padding: 3rem;
            font-size: 1.2rem;
            color: #888;
          }

          .tooltip-title {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .tooltip-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
          }

          .legend-item {
            display: inline-block;
            margin-right: 1rem;
            font-size: 0.9rem;
          }

          .legend-color {
            width: 12px;
            height: 12px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 5px;
            border-radius: 2px;
          }

          .legend-booked {
            background-color: #6C47FF;
          }

          .legend-percentage {
            background-color: #00D9E9;
          }
        `}
      </style>

      <h2>Event Analytics</h2>

      {analyticsData.length === 0 ? (
        <div className="no-data">No events found or no bookings yet.</div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="chart-card">
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={<CustomLegend />} />
                    <Bar dataKey="Tickets Booked" fill="#6C47FF" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Booking %" fill="#00D9E9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '1rem',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{label}</div>
        {payload.map((entry, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>{entry.name}</span>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

// Custom Legend Component
const CustomLegend = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
      <span style={{ marginRight: '1rem', fontSize: '0.9rem' }}>
        <span
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#6C47FF',
            display: 'inline-block',
            verticalAlign: 'middle',
            borderRadius: '2px',
            marginRight: '5px',
          }}
        ></span>
        Tickets Booked
      </span>
      <span style={{ fontSize: '0.9rem' }}>
        <span
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#00D9E9',
            display: 'inline-block',
            verticalAlign: 'middle',
            borderRadius: '2px',
            marginRight: '5px',
          }}
        ></span>
        Booking %
      </span>
    </div>
  );
};

export default EventAnalytics;