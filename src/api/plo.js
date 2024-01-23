import axios from 'axios';

export const getPlo = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/plo/`, {
    withCredentials: true,
  });
  return result.data;
};

export const getPloById = async (id) => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/plo/${id}`, {
    withCredentials: true,
  });
  return result.data;
};

export const getPloByObeId = async (obeId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/plo/obe/${obeId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createPlo = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/plo/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updatePlo = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/plo/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deletePlo = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/plo/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
