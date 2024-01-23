import axios from 'axios';

export const getPlotting = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/plotting_dosen_mk/`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createPlotting = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/plotting_dosen_mk/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
export const deletePlotting = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/plotting_dosen_mk/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
