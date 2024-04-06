import axios from 'axios';

export const getKurikulum = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/kurikulum/`, {
    withCredentials: true,
  });
  return result.data;
};

export const createKurikulum = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/kurikulum/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteKurikulum = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/kurikulum/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
