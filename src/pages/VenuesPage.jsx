import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Box,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import usePublicVenues from "../hooks/usePublicVenues";
import useMyVenues from "../hooks/useMyVenues";
import useCreateVenue from "../hooks/useCreateVenue";

const initialVenueState = {
  name: "",
  description: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  pricePerHour: "",
  capacity: ""
};

const PublicVenues = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const role = storedUser?.role;

  const canAddVenue = role === "VENUE_OWNER" || role === "ADMIN";

  // ✅ ROLE-BASED DATA FETCHING
  const venueHook =
    role === "VENUE_OWNER" ? useMyVenues() : usePublicVenues();

  const { venues, loading, error } = venueHook;

  const { createVenue, loading: creating } = useCreateVenue();

  const [open, setOpen] = useState(false);
  const [venue, setVenue] = useState(initialVenueState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVenue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    await createVenue({
      ...venue,
      pricePerHour: Number(venue.pricePerHour),
      capacity: Number(venue.capacity)
    });

    setOpen(false);
    setVenue(initialVenueState);
    window.location.reload(); // simple refresh
  };

  if (loading) {
    return <Typography sx={{ p: 3 }}>Loading venues...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">
          {role === "VENUE_OWNER" ? "My Venues" : "Public Venues"}
        </Typography>

        {canAddVenue && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Add Venue
          </Button>
        )}
      </Stack>

      {/* VENUE LIST */}
      <Grid container spacing={3}>
        {venues.map((venue) => (
          <Grid item xs={12} md={6} lg={4} key={venue.id}>
            <Card elevation={4} onClick={() => navigate(`/venues/${venue.id}`)}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" mb={1}>
                  <Typography variant="h6">{venue.name}</Typography>
                  <Chip
                    label={venue.active ? "Active" : "Inactive"}
                    color={venue.active ? "success" : "default"}
                    size="small"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" mb={1}>
                  {venue.description}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="body2">
                  📍 {venue.address}, {venue.city}, {venue.state} –{" "}
                  {venue.zipCode}
                </Typography>

                <Typography variant="body2" mt={1}>
                  👤 Owner: <strong>{venue.ownerName}</strong>
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption">Price / Hour</Typography>
                    <Typography variant="subtitle1">
                      ₹{venue.pricePerHour}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="caption">Capacity</Typography>
                    <Typography variant="subtitle1">
                      {venue.capacity} People
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" display="block">
                  Created:{" "}
                  {new Date(venue.createdAt).toLocaleDateString()}
                </Typography>
                <Typography variant="caption" display="block">
                  Updated:{" "}
                  {new Date(venue.updatedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ADD VENUE DIALOG */}
      <Dialog
        open={open && canAddVenue}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Venue</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Name" name="name" value={venue.name} onChange={handleChange} required />
            <TextField label="Description" name="description" value={venue.description} onChange={handleChange} />
            <TextField label="Address" name="address" value={venue.address} onChange={handleChange} required />
            <TextField label="City" name="city" value={venue.city} onChange={handleChange} required />
            <TextField label="State" name="state" value={venue.state} onChange={handleChange} required />
            <TextField label="Zip Code" name="zipCode" value={venue.zipCode} onChange={handleChange} required />
            <TextField label="Price Per Hour" name="pricePerHour" type="number" value={venue.pricePerHour} onChange={handleChange} required />
            <TextField label="Capacity" name="capacity" type="number" value={venue.capacity} onChange={handleChange} required />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={creating}>
            {creating ? "Saving..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublicVenues;
