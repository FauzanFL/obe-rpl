import axios from 'axios';

export const getDosen = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/dosen/`, {
    withCredentials: true,
  });
  return result.data;
};

export const getDosenMataKuliah = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/dosen/mata_kuliah`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
