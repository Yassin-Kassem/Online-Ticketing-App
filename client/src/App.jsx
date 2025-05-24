import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RegisterForm from './components/auth/RegisterForm'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/shared/Navbar'
import AdminUsersPage from './components/admin/AdminUsersPage'
import AdminDashboard from './components/admin/AdminDashboard'
import ProfilePage from './pages/EditProfileForm'


const App = () => {
  return (
      <div>
        <Router>
          <AuthProvider>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/admin-users" element={<AdminUsersPage />} />
              <Route path="/admin" element={<AdminDashboard/>} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </AuthProvider>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
  )
}

export default App