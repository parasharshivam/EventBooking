import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import AppLayout from './App.jsx';
import { AuthProvider } from './AuthContext.jsx';

import AuthPage from './pages/AuthPage.jsx';
import VenuesPage from './pages/VenuesPage.jsx';
import BookingsPage from './pages/BookingsPage.jsx';
import VenueDetailsPage from './pages/VenueDetailsPage.jsx';

// 👇 NEW booking pages
import BookingCreatePage from './pages/BookingCreatePage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            {/* VENUES */}
            <Route index element={<VenuesPage />} />
            <Route path="venues/:id" element={<VenueDetailsPage />} />

            {/* BOOKINGS */}
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/new" element={<BookingCreatePage />} />
            <Route path="bookings/payment/:bookingId" element={<PaymentPage />} />

            {/* AUTH */}
            <Route path="auth" element={<AuthPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
