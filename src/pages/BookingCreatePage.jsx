import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Stack,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import { useState } from "react";
import api from "../api/axios";

const BookingCreatePage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  // ✅ values coming from AvailabilityList (Step 4)
  const venueId = params.get("venueId");
  const startTime = params.get("start");
  const endTime = params.get("end");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateBooking = async () => {
    if (!venueId || !startTime || !endTime) {
      setError("Invalid booking details. Please select a slot again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/api/bookings", {
        venueId: Number(venueId),
        startTime,
        endTime
      });

      // ✅ Redirect to payment page
      navigate(`/bookings/payment/${res.data.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={2}>
        Confirm Booking
      </Typography>

      <Card elevation={3} sx={{ maxWidth: 500 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography>
              <strong>Venue ID:</strong> {venueId}
            </Typography>

            <Divider />

            <Typography>
              <strong>Start Time:</strong>{" "}
              {new Date(startTime).toLocaleString()}
            </Typography>

            <Typography>
              <strong>End Time:</strong>{" "}
              {new Date(endTime).toLocaleString()}
            </Typography>

            <Divider />

            {error && (
              <Typography color="error">
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleCreateBooking}
              disabled={loading}
            >
              {loading ? "Creating Booking..." : "Proceed to Payment"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookingCreatePage;
