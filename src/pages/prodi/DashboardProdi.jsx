import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useState, useEffect } from 'react';
import { getUserRole } from '../../api/user';
import Loader from '../../components/Loader';
import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts';
import { getDataPenilaianPlo } from '../../api/penilaian';
import { getTahunAjaran, getTahunAjaranNow } from '../../api/tahunAjaran';

export default function DashboardProdi() {
  const [isLoading, setIsLoading] = useState(false);
  const [tahunAjar, setTahunAjar] = useState({});
  const [ListTahunAjar, setListTahunAjar] = useState([]);
  const [data, setData] = useState([]);
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
    async function getListTahun() {
      try {
        const res = await getTahunAjaran();
        setListTahunAjar(res);
      } catch (e) {
        console.error(e);
      }
    }

    async function fetch() {
      try {
        const data = await getTahunAjaranNow();
        setTahunAjar(data);
        try {
          const res = await getDataPenilaianPlo(data.id);
          if (res) {
            setData(res);
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
    getListTahun();
  }, [navigate]);

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

  const handleChooseTahun = async (tahunId) => {
    setIsLoading(true);
    try {
      const resData = await getDataPenilaianPlo(tahunId);
      if (resData) {
        setData(resData);
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
            <select
              name="mk"
              id="mk"
              className="bg-gray-50 border border-gray-300 mb-1
               text-gray-900 text-sm rounded-lg block w-40 p-2.5"
              defaultValue={tahunAjar.id}
              onChange={({ target }) => handleChooseTahun(target.value)}
            >
              {ListTahunAjar.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {`${item.tahun} ${item.semester}`}
                  </option>
                );
              })}
            </select>
            <div className="block p-5 bg-white border border-gray-200 rounded-lg shadow overflow-auto">
              <h3 className="font-semibold text-center text-xl">
                Total Capaian PLO
              </h3>
              <BarChart width={800} height={300} data={data}>
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
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
