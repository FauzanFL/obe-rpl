import axios from 'axios';

export const getPerancangan = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchPerancangan = async (key) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getActivePerancangan = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/active`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const activatePerancangan = async (id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/activate/${id}`,
    {},
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getPerancanganById = async (id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createPerancangan = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updatePerancangan = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deletePerancangan = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/perancangan_obe/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
