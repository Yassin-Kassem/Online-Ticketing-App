import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './stylesheets/AdminDashboard.css';
import Loader from '../shared/Loader';
import { useNavigate } from 'react-router-dom';
import useRequireRole from '../../routes/roleCheck';
import { getAllEvents, getAllUsers, getApprovedEvents } from '../../services/api';

export default function AdminDashboard() {
  useRequireRole(['System Admin'])
  const [eventCounts, setEventCounts] = useState({
    approved: 0,
    others: 0
  });
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const chartRef = React.useRef(null);

  const { user, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  

  // Fetch Event Stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, approvedRes] = await Promise.all([getAllEvents(), getApprovedEvents()]);
        const allEvents = Array.isArray(allRes?.data) ? allRes.data : [];
        const approvedEvents = Array.isArray(approvedRes?.data) ? approvedRes.data : [];

        setEventCounts({
          approved: approvedEvents.length,
          others: allEvents.length - approvedEvents.length
        });
      } catch (error) {
        console.error('Error fetching event stats:', error);
        if (error.response?.status === 403) {
          navigate('/unauthorized');
        }
      }
    };

    const fetchUserCount = async () => {
      try {
        const response = await getAllUsers();
        const users = Array.isArray(response?.data) ? response.data : [];
        setUserCount(users.length);
      } catch (error) {
        console.error('Failed to fetch user count:', error);
        setUserCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchUserCount();
  }, []);

  // Draw Chart
  useEffect(() => {
    if (!loading && chartRef.current) {
      drawPieChart(eventCounts.approved, eventCounts.others);
    }
  }, [loading]);

  const drawPieChart = (approved, others) => {
    const ctx = document.getElementById('pieChart');

    if (!ctx) return;

    // Destroy existing chart if any
    if (window.pieChartInstance) {
      window.pieChartInstance.destroy();
    }

    window.pieChartInstance = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Approved', 'Pending / Declined'],
        datasets: [{
          label: 'Event Status',
          data: [approved, others],
          backgroundColor: ['#10b981', '#f59e0b'],
          borderColor: ['#ffffff', '#ffffff'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: { enabled: true }
        }
      }
    });
  };

  // Show loader while checking auth or loading data
  if (loading || !isLoggedIn || user?.role?.toLowerCase() !== 'system admin') {
    return <Loader text="Verifying admin access..." />;
  }

  // ✅ All good — render dashboard
  return (
    <div className="centered-dashboard-container">
      <div className="dashboard-wrapper">
        {/* USERS CARD */}
        <div className="card users-card">
          <h2>Total Users</h2>
          <p className="count">{userCount}</p>
          <button className="view-btn" onClick={() => navigate('/admin-users')}>
            View All Users
          </button>
        </div>

        {/* EVENTS PIE CHART CARD */}
        <div className="card events-card">
          <h2>Event Status</h2>
          <div className="pie-chart" ref={chartRef}>
            <canvas id="pieChart" width="200" height="200"></canvas>
          </div>
          <div className="legend">
            <span><em style={{ backgroundColor: '#10b981' }}></em> Approved ({eventCounts.approved})</span>
            <span><em style={{ backgroundColor: '#f59e0b' }}></em> Pending / Declined ({eventCounts.others})</span>
          </div>
          <button className="view-btn" onClick={() => navigate('/admin-events')}>
            View All Events
          </button>
        </div>
      </div>
    </div>
  );
}