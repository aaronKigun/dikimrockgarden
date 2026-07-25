import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/HomePage';
import CuisinePage from './pages/CuisinePage';
import VIPLoungePage from './pages/VIPLoungePage';
import GardenHallPage from './pages/GardenHallPage';
import ClubPage from './pages/ClubPage';
import BoutiquePage from './pages/BoutiquePage';
import ContactPage from './pages/ContactPage';
import BookingPage from './pages/BookingPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/cuisine" element={<CuisinePage />} />
        <Route path="/vlb" element={<VIPLoungePage />} />
        <Route path="/gh" element={<GardenHallPage />} />
        <Route path="/club" element={<ClubPage />} />
        <Route path="/mall" element={<BoutiquePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/paymentform" element={<BookingPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}
