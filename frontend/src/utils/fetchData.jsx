import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  async function fetchUrl() {
    const response = await axios.get(process.env.URL+path);
    setData(response.data);
    setLoading(false);
  }
  useEffect(() => {
    fetchUrl();
  }, []);
  return [data, loading];
}

export { useFetch };