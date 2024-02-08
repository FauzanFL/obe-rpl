import axios from 'axios';

export const loginUser = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/users/login`,
    data
  );
  return result.data;
};

export const logoutUser = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/logout`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getUser = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/users/`, {
    withCredentials: true,
  });
  return result.data;
};

export const getUserRole = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/users/role`, {
    withCredentials: true,
  });
  return result.data;
};

export const getUserDosen = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/dosen`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchUserDosen = async (key) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/users/dosen/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const addUser = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/users/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateUser = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/users/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteUser = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/users/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
