import axios from 'axios';

export const getTahunAjaran = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/tahun_ajaran/`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getTahunAjaranNow = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/tahun_ajaran/now`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchTahunAjaran = async (key) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/tahun_ajaran/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createTahunAjaran = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/tahun_ajaran/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateTahunAjaran = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/tahun_ajaran/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteTahunAjaran = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/tahun_ajaran/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
