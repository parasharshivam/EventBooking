import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../api/axios";
import AvailabilityList from "../components/AvailabilityList";
import AddAvailabilityDialog from "../components/AddAvailabilityDialog";

const VenueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAvailability, setOpenAvailability] = useState(false);

  // 🔐 user & role
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role;

  const isOwnerOrAdmin =
    role === "VENUE_OWNER" || role === "ADMIN";
  const isCustomer = role === "CUSTOMER";

  const loadVenue = () => {
    setLoading(true);
    api.get(`/api/venues/${id}`)
      .then(res => setVenue(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVenue();
  }, [id]);

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading venue...</Typography>;
  }

  if (!venue) {
    return <Typography sx={{ p: 3 }}>Venue not found</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* ================= VENUE DETAILS ================= */}
      <Card elevation={4}>
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography variant="h4">{venue.name}</Typography>

            <Chip
              label={venue.active ? "Active" : "Inactive"}
              color={venue.active ? "success" : "default"}
            />
          </Stack>

          <Typography variant="body1" mb={2}>
            {venue.description}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Typography>
            📍 {venue.address}, {venue.city}, {venue.state} - {venue.zipCode}
          </Typography>

          <Typography mt={1}>
            👤 Owner: <strong>{venue.ownerName}</strong>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography>
            💰 Price / Hour: ₹{venue.pricePerHour}
          </Typography>

          <Typography>
            👥 Capacity: {venue.capacity} People
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" display="block">
            Created: {new Date(venue.createdAt).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {/* ================= OWNER ACTION ================= */}
      {isOwnerOrAdmin && (
        <Button
          sx={{ mt: 3 }}
          variant="outlined"
          onClick={() => setOpenAvailability(true)}
        >
          Add Availability
        </Button>
      )}

      {/* ================= AVAILABILITY SECTION ================= */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" mb={2}>
          Available Slots
        </Typography>

        <AvailabilityList
          venueId={venue.id}
          canBook={isCustomer}
        />
      </Box>

      {/* ================= DIALOG ================= */}
      <AddAvailabilityDialog
        open={openAvailability}
        onClose={() => setOpenAvailability(false)}
        venueId={venue.id}
        onAdded={loadVenue}
      />

      {/* ================= BACK ================= */}
      <Button
        sx={{ mt: 3 }}
        variant="outlined"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>
  );
};

export default VenueDetailsPage;
