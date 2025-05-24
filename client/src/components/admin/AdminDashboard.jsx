import React, { useEffect, useRef, useState } from 'react';
import { getAllEvents, getAllUsers, getApprovedEvents } from '../../services/api';
import './stylesheets/AdminDashboard.css';

export default function AdminDashboard() {
  const [eventCounts, setEventCounts] = useState({
    approved: 0,
    others: 0
  });
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allRes, approvedRes] = await Promise.all([
          getAllEvents(),
          getApprovedEvents()
        ]);

        const allEvents = Array.isArray(allRes?.data) ? allRes.data : [];
        const approvedEvents = Array.isArray(approvedRes?.data) ? approvedRes.data : [];

        const approved = approvedEvents.length;
        const total = allEvents.length;
        const others = total - approved;

        setEventCounts({ approved, others });
      } catch (error) {
        console.error('Failed to fetch event stats:', error);
      } finally {
        setLoading(false);
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

  // Draw chart after data loads
  useEffect(() => {
    if (!loading && chartRef.current) {
      drawPieChart(eventCounts.approved, eventCounts.others);
    }
  }, [loading, eventCounts]);

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
          legend: {
            position: 'bottom'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  };

  return (
    <div className="centered-dashboard-container">
      <div className="dashboard-wrapper">
        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            {/* USERS CARD */}
            <div className="card users-card">
            <h2>Total Users</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <p className="count">{userCount}</p>
                )}
              <button className="view-btn" onClick={() => window.location.href = '/admin-users'}>
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
              <button className="view-btn" onClick={() => window.location.href = '/admin/events'}>
                View All Events
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}