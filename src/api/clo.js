import axios from 'axios';

export const getClo = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/clo/`, {
    withCredentials: true,
  });
  return result.data;
};

export const getCloById = async (id) => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/clo/${id}`, {
    withCredentials: true,
  });
  return result.data;
};

export const getMkClo = async (mkId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/clo/mk/${mkId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchMkClo = async (mkId, key) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/clo/mk/${mkId}/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createClo = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/clo/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateClo = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/clo/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteClo = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/clo/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
