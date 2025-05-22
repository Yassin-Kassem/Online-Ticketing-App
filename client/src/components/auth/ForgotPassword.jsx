import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylesheets/ForgotPassword.css'; 
import { toast } from 'react-toastify';
import { forgotPassword as sendOTP, verifyOTP } from '../../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async () => {
        if (!email) return;

        try {
            await sendOTP({ email });
            toast.success("OTP has been sent to your email.");
        } catch (error) {
            setMessage(error.message || "Failed to send OTP. Please try again.");
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!email || !otp) return;

        try {
            await verifyOTP({ email, otp });
            toast('OTP verified successfully!');
            navigate(`/reset-password?email=${encodeURIComponent(email)}`);
        } catch (error) {
            setMessage(error.message || 'Invalid or expired OTP.');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleVerifyOTP}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="button" onClick={handleSendOTP} className="send-otp-btn">
                    Send OTP
                </button>

                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                />

                <button type="submit" className="verify-otp-btn">
                    Verify OTP
                </button>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default ForgotPassword;