import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateProfile, updateUserRole } from '../services/api';
import './stylesheets/EditProfileForm.css';
import { AuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: initialUser } = location.state || {};
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const { user: currentUser, isLoggedIn } = useContext(AuthContext);

  const isCurrentUser = currentUser && initialUser && String(currentUser._id) === String(initialUser._id);
  const isAdmin = currentUser?.role === 'System Admin';
  const canEditRole = !isCurrentUser && isAdmin;

  useEffect(() => {
    if (!isLoggedIn) {
      alert('You must be logged in to view this page.');
      navigate('/login');
      return;
    }

    if (!initialUser) {
      navigate('/admin/users');
      return;
    }

    setUser(initialUser);
    setName(initialUser.name || '');
    setEmail(initialUser.email || '');
    setRole(initialUser.role || 'Standard User');
  }, [initialUser, navigate, isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isCurrentUser) {
        await updateProfile({ name, email });
      } else if (canEditRole) {
        await updateUserRole(user._id, { role });
      }

      alert('✅ Successfully updated!');
      navigate('/admin/users');
    } catch (error) {
      console.error('Update failed:', error);
      alert('❌ Failed to update.');
    }
  };

  if (!currentUser || !user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>{isCurrentUser ? 'Edit Profile' : 'Edit User Role'}</h2>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Name Field */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isCurrentUser}
              placeholder="Enter name"
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isCurrentUser}
              placeholder="Enter email"
            />
          </div>

          {/* Role Dropdown – Only for admins editing others */}
          {canEditRole && (
            <div className="form-group">
              <label>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Standard User">Standard User</option>
                <option value="Organizer">Organizer</option>
                <option value="System Admin">System Admin</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="btn save-btn">
            {isCurrentUser ? 'Save Changes' : 'Update Role'}
          </button>
        </form>
      </div>
    </div>
  );
}