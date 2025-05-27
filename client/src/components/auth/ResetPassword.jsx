import React, { useState } from 'react';
import { resetPassword } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './stylesheets/ResetPassword.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Get email from query params
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const email = params.get('email');

    if (!email) {
        return (
            <div className="reset-password-container">
                <p>Error: Email is required to reset password.</p>
                <button onClick={() => navigate('/forgot-password')}>Go back</button>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate password
        if (!newPassword || newPassword.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }

        try {
            await resetPassword({ email, newPassword });
            toast("Password changed successfully! Redirecting to login...");
            setTimeout(() => {
                navigate('/register');
            }, 2000);
        } catch (error) {
            setMessage(error.message || "Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength="8"
                    required
                />
                <button type="submit" className="reset-btn">Reset Password</button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ResetPassword;