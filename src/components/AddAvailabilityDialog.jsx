import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import api from "../api/axios";
import dayjs from "dayjs";

const AddAvailabilityDialog = ({ open, onClose, venueId, onAdded }) => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!startTime || !endTime) {
      alert("Please select both start and end time");
      return;
    }

    if (endTime.isBefore(startTime)) {
      alert("End time must be after start time");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/api/availabilities/venue/${venueId}`, {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      onAdded();
      onClose();
      setStartTime(null);
      setEndTime(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add availability");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Add Availability</DialogTitle>

        <DialogContent>
          <Stack spacing={3} mt={2}>
            <DateTimePicker
              label="Start Date & Time"
              value={startTime}
              onChange={setStartTime}
              disablePast
            />

            <DateTimePicker
              label="End Date & Time"
              value={endTime}
              onChange={setEndTime}
              minDateTime={startTime}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddAvailabilityDialog;
