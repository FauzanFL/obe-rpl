import axios from 'axios';

export const getKurikulum = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/kurikulum/`, {
    withCredentials: true,
  });
  return result.data;
};
