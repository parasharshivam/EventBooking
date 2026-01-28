import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider
} from "@mui/material";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const BookingsPage = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/bookings/my-bookings");
      setBookings(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading bookings...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        My Bookings
      </Typography>

      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      {bookings.length === 0 && (
        <Typography>No bookings found.</Typography>
      )}

      <Stack spacing={3}>
        {bookings.map((b) => (
          <Card key={b.id} elevation={3}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">
                  {b.venueName}
                </Typography>

                <Divider />

                <Typography>
                  <strong>From:</strong>{" "}
                  {new Date(b.startTime).toLocaleString()}
                </Typography>

                <Typography>
                  <strong>To:</strong>{" "}
                  {new Date(b.endTime).toLocaleString()}
                </Typography>

                <Typography>
                  <strong>Total:</strong> ₹{b.totalAmount}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography>Status:</Typography>
                  <Chip
                    label={b.status}
                    color={
                      b.status === "CONFIRMED"
                        ? "success"
                        : b.status === "PENDING"
                        ? "warning"
                        : "default"
                    }
                  />
                </Stack>

                {/* Pay if pending */}
                {b.status === "PENDING" && (
                  <Button
                    variant="contained"
                    sx={{ mt: 1 }}
                    onClick={() =>
                      navigate(`/bookings/payment/${b.id}`)
                    }
                  >
                    Complete Payment
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default BookingsPage;







// import { useEffect, useState } from 'react';
// import { createBooking, getMyBookings } from '../api';
// import { useAuth } from '../AuthContext';

// function BookingsPage() {
//   const { isAuthenticated } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [form, setForm] = useState({
//     venueId: '',
//     date: '',
//     attendees: '',
//   });

//   const loadBookings = async () => {
//     if (!isAuthenticated) return;
//     setLoading(true);
//     setError('');
//     try {
//       const data = await getMyBookings();
//       setBookings(data || []);
//     } catch (err) {
//       setError(err.message || 'Failed to load bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBookings();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isAuthenticated]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((f) => ({ ...f, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!isAuthenticated) {
//       setError('You must be logged in to create bookings.');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     try {
//       const payload = {
//         venueId: form.venueId,
//         date: form.date,
//         attendees: Number(form.attendees) || 0,
//       };
//       await createBooking(payload);
//       setForm({
//         venueId: '',
//         date: '',
//         attendees: '',
//       });
//       await loadBookings();
//     } catch (err) {
//       setError(err.message || 'Failed to create booking');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="page-container">
//       <h2>Bookings</h2>
//       {error && <p className="status-text error">{error}</p>}
//       {!isAuthenticated && <p>Login to view and create bookings.</p>}

//       {isAuthenticated && (
//         <>
//           <section className="section">
//             <h3>Create Booking</h3>
//             <div className="card">
//               <form onSubmit={handleSubmit} className="form">
//                 <div className="form-row">
//                   <label htmlFor="venueId">Venue ID</label>
//                   <input
//                     id="venueId"
//                     name="venueId"
//                     value={form.venueId}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-row">
//                   <label htmlFor="date">Date</label>
//                   <input
//                     id="date"
//                     name="date"
//                     type="date"
//                     value={form.date}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>
//                 <div className="form-row">
//                   <label htmlFor="attendees">Attendees</label>
//                   <input
//                     id="attendees"
//                     name="attendees"
//                     type="number"
//                     value={form.attendees}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <button type="submit" disabled={loading}>
//                   {loading ? 'Saving...' : 'Create Booking'}
//                 </button>
//               </form>
//             </div>
//           </section>

//           <section className="section">
//             <h3>My Bookings</h3>
//             {loading && <p>Loading...</p>}
//             <ul className="list">
//               {bookings?.map((b) => (
//                 <li key={b.id} className="list-item">
//                   <div>
//                     <strong>Booking #{b.id}</strong>
//                     {b.venueId && <div>Venue ID: {b.venueId}</div>}
//                     {b.date && <div>Date: {b.date}</div>}
//                     {b.attendees != null && <div>Attendees: {b.attendees}</div>}
//                     {b.status && <div>Status: {b.status}</div>}
//                   </div>
//                 </li>
//               ))}
//               {(!bookings || bookings.length === 0) && (
//                 <li>No bookings yet.</li>
//               )}
//             </ul>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

// export default BookingsPage;

