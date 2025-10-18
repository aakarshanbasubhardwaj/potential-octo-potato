import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/Details';
import BookingPage from './pages/BookingPage';
import BookingConfirmation from './pages/BookingConfirmation';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/confirmation/:confirmationNumber" element={<BookingConfirmation />} />
      </Routes>
    </Router>
  );
}
