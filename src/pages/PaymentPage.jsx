import { useParams, useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import api from "../api/axios";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const handlePaymentSuccess = async () => {
    await api.post("/api/bookings/confirm-payment", {
      razorpayOrderId: "order_xyz",
      razorpayPaymentId: "payment_xyz",
      razorpaySignature: "signature_xyz"
    });

    navigate("/bookings");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Payment</Typography>
      <Typography>Booking ID: {bookingId}</Typography>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handlePaymentSuccess}
      >
        Pay Now
      </Button>
    </Box>
  );
};

export default PaymentPage;
