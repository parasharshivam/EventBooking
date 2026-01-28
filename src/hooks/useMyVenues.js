import { useEffect, useState } from "react";
import api from "../api/axios";

const useMyVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/venues/my-venues")
      .then(res => setVenues(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { venues, loading };
};

export default useMyVenues;
