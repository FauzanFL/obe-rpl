import axios from 'axios';

export const getKelas = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/kelas/`, {
    withCredentials: true,
  });
  return result.data;
};
