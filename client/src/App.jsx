import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import RegisterForm from './components/auth/RegisterForm'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
const App = () => {
  return (
    <div>
      <Router>
        <AuthProvider>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/register" element={<RegisterForm/>} />
      </Routes> 
      </AuthProvider>
    </Router>
     <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App