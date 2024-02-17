import axios from 'axios';

export const getPenilaian = async () => {
  const result = await axios.get(`${import.meta.env.VITE_API_URL}/penilaian/`, {
    withCredentials: true,
  });
  return result.data;
};

export const getDataPenilaian = async (mkId, kelasId) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/penilaian/data/matakuliah/${mkId}/kelas/${kelasId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createPenilaian = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/penilaian/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updatePenilaian = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/penilaian/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deletePenilaian = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/penilaian/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
