import axios from 'axios';

export const createBeritaAcaraBatch = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/berita_acara/batch`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
