import axios from 'axios';

export const getDosen = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/dosen/`, {
    withCredentials: true,
  });
  return result.data;
};

export const getDosenMataKuliahByTahun = async (tahunId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/dosen/mata_kuliah/tahun/${tahunId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchDosenMataKuliahByTahun = async (tahunId, key) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/dosen/mata_kuliah/tahun/${tahunId}/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
