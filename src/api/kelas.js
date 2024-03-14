import axios from 'axios';

export const getKelas = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/kelas/`, {
    withCredentials: true,
  });
  return result.data;
};

export const getKelasById = async (id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/kelas/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchKelas = async (key) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/kelas/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createKelas = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/kelas/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateKelas = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/kelas/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteKelas = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/kelas/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
