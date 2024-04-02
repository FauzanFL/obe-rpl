import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useState, useEffect } from 'react';
import { getUserRole } from '../../api/user';
import Loader from '../../components/Loader';
import {
  getDataPenilaianMatakuliahByMk,
  getDataPenilaianMatakuliahByTahun,
} from '../../api/penilaian';
import { getTahunAjaran, getTahunAjaranNow } from '../../api/tahunAjaran';
import { getMataKuliahActiveByTahunId } from '../../api/matakuliah';

export default function DashboardProdi() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tahunAjar, setTahunAjar] = useState({});
  const [listTahun, setListTahun] = useState([]);
  const [listMk, setListMk] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    async function fetchUser() {
      try {
        const res = await getUserRole();
        if (res.role !== 'prodi') {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    }

    async function fetchTahun() {
      try {
        const res = await getTahunAjaran();
        if (res) {
          setListTahun(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function fetch() {
      try {
        const tahun = await getTahunAjaranNow();
        setTahunAjar(tahun);
        const mk = await getMataKuliahActiveByTahunId(tahun.id);
        if (mk) {
          setListMk(mk);
        }
        const res = await getDataPenilaianMatakuliahByTahun(tahun.id);
        console.log(res);
        if (res) {
          setData(res);
        }
        setIsLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetchTahun();
    fetch();
  }, [navigate]);

  const handleChooseTahun = async (tahunId) => {
    setIsLoading(true);
    try {
      const mk = await getMataKuliahActiveByTahunId(tahunId);
      if (mk) {
        setListMk(mk);
      }
      const res = await getDataPenilaianMatakuliahByTahun(tahunId);
      if (res) {
        setData(res);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChooseMk = async (mkId) => {
    setIsLoading(true);
    try {
      const res = await getDataPenilaianMatakuliahByMk(mkId);
      if (res) {
        setData(res);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const listNav = [{ name: 'Dashboard', link: '/prodi/dashboard' }];
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'prodi'} page={'dashboard'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl mb-3">Dashboard</h2>
            <div className="flex justify-between">
              <select
                name="tahun"
                id="tahun"
                className="bg-gray-50 border border-gray-300 mb-1 max-w-fit
               text-gray-900 text-sm rounded-lg block w-96 p-2.5"
                onChange={({ target }) => handleChooseTahun(target.value)}
              >
                {listTahun.map((item, i) => {
                  return (
                    <option
                      key={i}
                      value={item.id}
                      selected={tahunAjar.id == item.id ? true : false}
                    >
                      {`${item.tahun} ${item.semester}`}
                    </option>
                  );
                })}
              </select>
              <select
                name="mk"
                id="mk"
                className="bg-gray-50 border border-gray-300 mb-1 max-w-fit
               text-gray-900 text-sm rounded-lg block w-96 p-2.5"
                onChange={({ target }) => handleChooseMk(target.value)}
              >
                <option value="">Semua</option>
                {listMk.map((item, i) => {
                  return (
                    <option key={i} value={item.id}>
                      {item.nama}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              {data.length > 0 ? (
                data.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="block p-5 bg-white border border-gray-200 rounded-lg shadow overflow-auto"
                    >
                      <h3 className="font-semibold text-lg mb-2">
                        {item.nama}
                      </h3>
                      <table className="w-full text-left rtl:text-right">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Kelas
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Dosen
                            </th>
                            <th scope="col" className="px-6 py-3">
                              Data
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.kelas.length > 0 &&
                            item.kelas.map((kelas, i) => {
                              return (
                                <tr
                                  key={i}
                                  className="odd:bg-white even:bg-gray-50 border-b"
                                >
                                  <td
                                    className={`px-6 py-4 row-span-[${kelas.plo.length}]`}
                                  >
                                    {kelas.nama}
                                  </td>
                                  <td className="px-6 py-4">
                                    {kelas.dosen.kode_dosen}
                                  </td>
                                  <td className="px-6 py-4">
                                    <table className="w-full text-left rtl:text-right border">
                                      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                          <th scope="col" className="px-6 py-3">
                                            PLO
                                          </th>
                                          <th scope="col" className="px-6 py-3">
                                            CLO
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {kelas.plo.map((item, i) => {
                                          return (
                                            <tr
                                              key={i}
                                              className="odd:bg-white even:bg-gray-50 border-b"
                                            >
                                              <td className="p-2">
                                                {`${item.nama} = ${item.nilai}`}
                                              </td>
                                              <td>
                                                <ul>
                                                  {item.clo.map((item, i) => {
                                                    return (
                                                      <li
                                                        key={i}
                                                        className="py-1"
                                                      >
                                                        {`${item.nama} = ${item.nilai}`}
                                                      </li>
                                                    );
                                                  })}
                                                </ul>
                                              </td>
                                            </tr>
                                          );
                                        })}
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 block p-5 bg-white border border-gray-200 rounded-lg shadow overflow-auto">
                  <p className="text-center text-xl text-gray-700">
                    Tidak ada data
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
