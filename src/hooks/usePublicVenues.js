import { useEffect, useState } from "react";
import api from "../api/axios";

const usePublicVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get("/api/venues/public/all");
        setVenues(response.data);
      } catch (err) {
        setError(err.response?.data || "Failed to fetch venues");
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  return { venues, loading, error };
};

export default usePublicVenues;
