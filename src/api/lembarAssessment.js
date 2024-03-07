import axios from 'axios';

export const getAssessment = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/lembar_assessment/`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getAssessmentById = async (id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/lembar_assessment/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getAssessmentByCloId = async (cloId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/lembar_assessment/clo/${cloId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getAssessmentByMkId = async (mkId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/lembar_assessment/matakuliah/${mkId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchAssessment = async (cloId, key) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/lembar_assessment/clo/${cloId}/search?keyword=${key}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createAssessment = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/lembar_assessment/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateAssessment = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/lembar_assessment/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteAssessment = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/lembar_assessment/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
