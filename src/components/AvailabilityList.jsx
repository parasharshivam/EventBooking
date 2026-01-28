import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AvailabilityList = ({ venueId }) => {
  const [slots, setSlots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/api/availabilities/venue/${venueId}`)
      .then(res => setSlots(res.data));
  }, [venueId]);

  if (slots.length === 0) {
    return <Typography>No availability</Typography>;
  }

  return (
    <Stack spacing={2}>
      {slots.map(slot => (
        <Card key={slot.id}>
          <CardContent>
            <Typography>
              🕒 {new Date(slot.startTime).toLocaleString()}
              {" "}–{" "}
              {new Date(slot.endTime).toLocaleString()}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 1 }}
              onClick={() =>
                navigate(
                  `/bookings/new?venueId=${venueId}&start=${slot.startTime}&end=${slot.endTime}`
                )
              }
            >
              Book This Slot
            </Button>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default AvailabilityList;
