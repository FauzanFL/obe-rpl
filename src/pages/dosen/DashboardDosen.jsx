import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useState, useEffect, useRef } from 'react';
import { getUserRole } from '../../api/user';
import Loader from '../../components/Loader';
import { getDataPenilaianCloPloByMk } from '../../api/penilaian';
import { getDosenMataKuliahByTahun } from '../../api/dosen';
import { Bar, BarChart, Legend, XAxis, YAxis, Tooltip } from 'recharts';
import { getTahunAjaranNow } from '../../api/tahunAjaran';

export default function DashboardDosen() {
  const [isLoading, setIsLoading] = useState(false);
  const [listMk, setListMk] = useState([]);
  const [listClo, setListClo] = useState([]);
  const [listPlo, setListPlo] = useState([]);
  const mkFirst = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    async function fetchUser() {
      try {
        const res = await getUserRole();
        if (res.role !== 'dosen') {
          navigate('/');
        }
      } catch (e) {
        navigate('/');
      }
    }

    async function fetch() {
      try {
        const tahun = await getTahunAjaranNow();
        try {
          const res = await getDosenMataKuliahByTahun(tahun.id);
          if (res) {
            setListMk(res);
            mkFirst.current = res[0];
            const resData = await getDataPenilaianCloPloByMk(res[0].id);
            if (resData) {
              setListClo(resData.clo);
              setListPlo(resData.plo);
            }
          }
          setIsLoading(false);
        } catch (e) {
          console.error(e);
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchUser();
    fetch();
  }, [navigate]);

  const handleChooseMk = async (mkId) => {
    setIsLoading(true);
    try {
      const resData = await getDataPenilaianCloPloByMk(mkId);
      setListClo(resData.clo);
      setListPlo(resData.plo);
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };

  const renderCustomBarLabel = ({ x, y, width, value }) => {
    return (
      <text
        x={x + width / 2}
        y={y}
        fill="#666"
        textAnchor="middle"
        dy={-6}
      >{`${value}`}</text>
    );
  };
  const listNav = [{ name: 'Dashboard', link: '/dosen/dashboard' }];
  return (
    <>
      <div className="flex">
        <div className="">
          <Sidebar typeUser={'dosen'} page={'dashboard'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'dosen'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl mb-3">Dashboard</h2>
            <select
              name="mk"
              id="mk"
              className="bg-gray-50 border border-gray-300 mb-1
               text-gray-900 text-sm rounded-lg block w-96 p-2.5"
              defaultValue={mkFirst.current.id}
              onChange={({ target }) => handleChooseMk(target.value)}
            >
              {listMk.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {item.nama}
                  </option>
                );
              })}
            </select>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <div className="block p-5 bg-white border border-gray-200 rounded-lg shadow overflow-auto">
                <h3 className="font-semibold text-center text-xl">
                  Total Capaian CLO
                </h3>
                <BarChart width={450} height={300} data={listClo}>
                  <XAxis dataKey={'nama'} />
                  <YAxis />
                  <Tooltip
                    wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
                  />
                  <Bar
                    dataKey={'nilai'}
                    barSize={40}
                    label={renderCustomBarLabel}
                    fill="#337cf2"
                  />
                  <Legend />
                </BarChart>
              </div>
              <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow overflow-auto">
                <h3 className="font-semibold text-center text-xl">
                  Total Capaian PLO
                </h3>
                <BarChart width={450} height={300} data={listPlo}>
                  <XAxis dataKey={'nama'} />
                  <YAxis />
                  <Tooltip
                    wrapperStyle={{ width: 100, backgroundColor: '#ccc' }}
                  />
                  <Bar
                    dataKey={'nilai'}
                    barSize={40}
                    label={renderCustomBarLabel}
                    fill="#337cf2"
                  />
                  <Legend />
                </BarChart>
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
