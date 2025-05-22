import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RegisterForm from './components/auth/RegisterForm'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/shared/Navbar'

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
            </Routes>
          </AuthProvider>
        </Router>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
  )
}

export default App