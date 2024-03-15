import axios from 'axios';

export const getIndexPenilaian = async () => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/index_penilaian/`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getIndexPenilaianById = async (id) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/index_penilaian/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const getIndexPenilaianByNilai = async (nilai) => {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/index_penilaian/grade?nilai=${nilai}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const createIndexPenilaian = async (data) => {
  const result = await axios.post(
    `${import.meta.env.VITE_API_URL}/index_penilaian/`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const updateIndexPenilaian = async (data, id) => {
  const result = await axios.put(
    `${import.meta.env.VITE_API_URL}/index_penilaian/update/${id}`,
    data,
    {
      withCredentials: true,
    }
  );
  return result.data;
};

export const deleteIndexPenilaian = async (id) => {
  const result = await axios.delete(
    `${import.meta.env.VITE_API_URL}/index_penilaian/delete/${id}`,
    {
      withCredentials: true,
    }
  );
  return result.data;
};
