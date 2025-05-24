import React, { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../../services/api';  
import { useNavigate } from 'react-router-dom';
import './stylesheets/userList.css';

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setDeletingId(id);
      await deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error('Failed to delete user:', error.response || error);
      alert('Failed to delete user. Please check console.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (user) => {
    navigate(`/profile?userId=${user._id}`, { state: { user } });
  };

  return (
    <div className="centered-container">
      <div className="scrollable-user-list">
        <div className="users-container">
          <header className="users-header">
            <span className="icon" role="img" aria-label="users">👥</span>
            <h1>User Management</h1>
          </header>
          <hr />
          <div className="users-list">
            {loading && <p>Loading users...</p>}
            {!loading && users.length === 0 && <p>No users found.</p>}
            {!loading &&
              users.map(({ _id, email, role }) => (
                <div key={_id} className="user-row">
                  <div className="user-info">
                    <span className="email">{email}</span>
                    <span className={`role ${role}`}>{role}</span>
                  </div>
                  <div className="user-actions">
                  <button
                    className="btn edit"
                    onClick={() => handleEdit({ _id, email, role })}
                    >
                    Edit
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => handleDelete(_id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}