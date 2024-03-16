import axios from 'axios';

export const getJenisAssessment = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/jenis_assessment/`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createJenisAssessment = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/jenis_assessment/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateJenisAssessment = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/jenis_assessment/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteJenisAssessment = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/jenis_assessment/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
