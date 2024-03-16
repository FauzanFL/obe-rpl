import axios from 'axios';

export const getPlottingByTahun = async (tahunId) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/plotting_dosen_mk/tahun/${tahunId}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getKelasDosenByMkId = async (mkId) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/plotting_dosen_mk/matakuliah/${mkId}/kelas/dosen`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getKelasByMkId = async (mkId) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/plotting_dosen_mk/matakuliah/${mkId}/kelas`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const searchPlottingByTahun = async (tahunId, key) => {
  const result = await axios.get(
    `${
      import.meta.env.VITE_API_URL
    }/plotting_dosen_mk/tahun/${tahunId}/search?keyword=${key}`,
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
