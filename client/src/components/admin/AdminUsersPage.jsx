import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, updateUserRole } from '../../services/api';  
import './stylesheets/userList.css';
import useRequireRole from '../../routes/roleCheck';

export default function UsersList() {
  useRequireRole(['System Admin']); // 🔐 Hook handles auth + redirect

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUser, setDeletingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);

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

  // === ROLE MODAL HANDLERS ===
  const openRoleModal = (user) => {
    setEditingUser(user);
    setNewRole(user.role || '');
    setStatusMessage('');
    setIsClosing(false);
  };

  const closeRoleModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setEditingUser(null);
      setNewRole('');
      setIsLoading(false);
      setStatusMessage('');
      setIsClosing(false);
    }, 300);
  };

  const handleRoleChange = async () => {
    if (!newRole) return;
    try {
      setIsLoading(true);
      await updateUserRole(editingUser._id, { role: newRole });
      await fetchUsers();
      setStatusMessage('✅ Role updated successfully');
      setTimeout(() => {
        closeRoleModal();
      }, 1000);
    } catch (error) {
      console.error('Failed to update role:', error);
      setStatusMessage('❌ Failed to update role. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // === DELETE MODAL HANDLERS ===
  const openDeleteModal = (user) => {
    setDeletingUser(user);
    setStatusMessage('');
    setIsClosing(false);
  };

  const closeDeleteModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDeletingUser(null);
      setIsLoading(false);
      setStatusMessage('');
      setIsClosing(false);
    }, 300);
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      setIsLoading(true);
      await deleteUser(deletingUser._id);
      await fetchUsers();
      setStatusMessage('✅ User deleted successfully');
      setTimeout(() => {
        closeDeleteModal();
      }, 1000);
    } catch (error) {
      console.error('Failed to delete user:', error);
      setStatusMessage('❌ Failed to delete user. Check console for details.');
    } finally {
      setIsLoading(false);
    }
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
                      onClick={() => openRoleModal({ _id, email, role })}
                      disabled={isLoading}
                    >
                      Edit Role
                    </button>
                    <button
                      className="btn delete"
                      onClick={() => openDeleteModal({ _id, email })}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Role Edit Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className={`modal-content ${isClosing ? 'slide-out' : ''}`}>
            <h2>Edit Role for {editingUser.email}</h2>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select Role</option>
              <option value="System Admin">System Admin</option>
              <option value="Standard User">Standard User</option>
              <option value="Organizer">Organizer</option>
            </select>
            {isLoading && <div className="loading-spinner"></div>}
            {statusMessage && (
              <p className={`status-message ${statusMessage.includes('❌') ? 'error' : ''}`}>
                {statusMessage}
              </p>
            )}
            <div className="modal-buttons">
              <button
                onClick={handleRoleChange}
                className="btn save-btn"
                disabled={isLoading}
              >
                Confirm Edit
              </button>
              <button
                onClick={closeRoleModal}
                className="btn cancel-btn"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUser && (
        <div className="modal-overlay">
          <div className={`modal-content ${isClosing ? 'slide-out' : ''}`}>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{deletingUser.email}</strong>?</p>
            {isLoading && <div className="loading-spinner"></div>}
            {statusMessage && (
              <p className={`status-message ${statusMessage.includes('❌') ? 'error' : ''}`}>
                {statusMessage}
              </p>
            )}
            <div className="modal-buttons">
              <button
                onClick={handleDelete}
                className="btn delete"
                disabled={isLoading}
              >
                Confirm Delete
              </button>
              <button
                onClick={closeDeleteModal}
                className="btn cancel-btn"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}