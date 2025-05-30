import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/shared/Navbar';
import AdminUsersPage from './components/admin/AdminUsersPage';
import AdminDashboard from './components/admin/AdminDashboard';
import Profile from './components/UserManagement/Profile'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import EventDetailsPage from './components/event/EventDetails';
import EventListPage from './components/event/EventList'; 
import EventForm from './components/event/EventForm';
import Unauthorized from './routes/Unauthorized';
import MyEvents from './components/event/MyEvents';
import AdminEventsPage from './components/admin/AdminEventsPage';
import UserBookingsPage from './components/booking/UserBookingsPage';
import EventAnalytics from './components/event/EventAnalytics';
import EditEventForm from './components/event/EditForm';


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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path='/admin-events' element={<AdminEventsPage/>} />
            <Route path="/profile" element={<Profile />} /> 
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/my-events/analytics" element={<EventAnalytics />} />
            <Route path="/create-event" element={<EventForm />} />
            <Route path="/edit-event/:id" element={<EventForm />} />
            <Route path="/unauthorized" element={<Unauthorized/>} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/my-events/:id/edit" element={<EditEventForm />} />
            <Route path="/bookings" element={<UserBookingsPage />} />
          </Routes>
        </AuthProvider>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default App;
