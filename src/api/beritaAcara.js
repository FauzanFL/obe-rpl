import axios from 'axios';

export const createBeritaAcara = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/berita_acara/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getBeritaAcaraByPenilaian = async (penilaianId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/berita_acara/penilaian/${penilaianId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteBeritaAcara = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/berita_acara/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
