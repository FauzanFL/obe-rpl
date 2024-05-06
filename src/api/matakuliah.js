import axios from 'axios';

export const getMataKuliah = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getMataKuliahById = async (id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getMataKuliahActiveByTahunId = async (tahunId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/tahun/${tahunId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getMataKuliahByObeId = async (tahunId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/tahun/${tahunId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchMataKuliahActiveByTahunId = async (tahunId, key) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/mata_kuliah/tahun/${tahunId}/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getRpsMataKuliah = async (id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/rps/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createMataKuliah = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateMataKuliah = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteMataKuliah = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/mata_kuliah/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
