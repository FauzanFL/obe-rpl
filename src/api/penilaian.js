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

export const getDataPenilaianMatakuliahByTahun = async (tahunId) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/penilaian/data/matakuliah/tahun/${tahunId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getDataPenilaianMatakuliahByMk = async (mkId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/penilaian/data/matakuliah/${mkId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getDataPenilaianCloPloByMk = async (mkId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/penilaian/data/clo_plo/matakuliah/${mkId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getDataPenilaianPlo = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/penilaian/data/plo`,
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
    `${import.meta.env.VITE_API_URL}/penilaian/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deletePenilaian = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/penilaian/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const uploadEvidnce = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/penilaian/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    }
  );
  return result.data;
};
