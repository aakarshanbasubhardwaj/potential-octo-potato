import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/Details';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';
import BookingHistory from './pages/BookingHistory';
import Tickets from './pages/Tickets';
import BottomNavLayout from './components/BottomNavLayout.jsx';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Pages with bottom navigation */}
        <Route
          path="/"
          element={
            <BottomNavLayout>
              <Home />
            </BottomNavLayout>
          }
        />
        <Route
          path="/bookingHistory"
          element={
            <BottomNavLayout>
              <BookingHistory />
            </BottomNavLayout>
          }
        />

        {/* Pages without bottom navigation */}
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id/:model" element={<MovieDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/confirmation/:confirmationNumber" element={<BookingConfirmation />} />
        <Route path="/bookingHistory" element={<BookingHistory />} />
        <Route path="/ticket/:confirmationNumber" element={<Tickets />} />
      </Routes>
    </Router>
  );
}
