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
