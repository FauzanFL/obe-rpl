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
