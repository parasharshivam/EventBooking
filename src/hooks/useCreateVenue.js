import { useState } from "react";
import api from "../api/axios";

const useCreateVenue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createVenue = async (venueData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/api/venues", venueData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create venue");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createVenue, loading, error };
};

export default useCreateVenue;
