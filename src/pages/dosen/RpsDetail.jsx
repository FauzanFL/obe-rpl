import { useEffect, useRef, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import { getRpsMataKuliah } from '../../api/matakuliah';
import { getUserRole } from '../../api/user';
import { PrinterIcon } from '@heroicons/react/24/solid';
import { useReactToPrint } from 'react-to-print';
import Loader from '../../components/Loader';
import RpsPdf2 from '../../utils/RpsPdf2';

export default function RpsDetail() {
  const navigate = useNavigate();
  const [rps, setRps] = useState({});
  const [listClo, setListClo] = useState([]);
  const [listPlo, setListPlo] = useState([]);
  const [listAssessment, setListAssessment] = useState([]);
  const [dosenPengampu, setDosenPengampu] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const pdfRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: `RPS ${rps.kode_mk}`,
  });

  useEffect(() => {
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

    async function fetchRps() {
      try {
        const res = await getRpsMataKuliah(params.mkId);
        if (res) {
          setRps(res);
          setDosenPengampu(res.dosen_pengampu);
          setListClo(res.clo);
          setListPlo(res.plo);
          setListAssessment(res.lembar_assessment);
          setIsLoading(false);
        }
      } catch (e) {
        console.error(e);
      }
    }

    setIsLoading(true);
    fetchUser();
    fetchRps();
  }, [params, navigate]);

  const listNav = [
    { name: 'RPS', link: '/dosen/rps' },
    { name: `${rps.kode_mk} / Detail`, link: '/dosen/rps/detail' },
  ];
  return (
    <>
      <div className="flex">
        <div className="fixed top-0 bottom-0 z-50 bg-indigo-500 md:static">
          <Sidebar typeUser={'dosen'} page={'rps'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'dosen'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <div className="">
              <div className="hidden">
                <RpsPdf2
                  ref={pdfRef}
                  rps={rps}
                  listClo={listClo}
                  listPlo={listPlo}
                  dosenPengampu={dosenPengampu}
                />
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="flex justify-center items-center focus:outline-none text-white bg-lime-600 hover:bg-lime-700 focus:ring-4 focus:ring-lime-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
              >
                Cetak RPS
                <PrinterIcon className="w-5 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="block bg-white border border-gray-200 rounded-lg shadow">
                <div className="rounded-t-lg bg-slate-200 px-4 py-2">
                  <h3 className="text-xl font-semibold">Detail Mata Kuliah</h3>
                </div>
                <div className="p-4">
                  <table>
                    <tbody>
                      <tr className="py-2">
                        <td className="font-semibold">Prodi</td>
                        <td>:</td>
                        <td className="px-1.5">{rps.prodi}</td>
                      </tr>
                      <tr className="py-2">
                        <td className="font-semibold">Nama</td>
                        <td>:</td>
                        <td className="px-1.5">{rps.nama_mk}</td>
                      </tr>
                      <tr className="py-2">
                        <td className="font-semibold">Kode</td>
                        <td>:</td>
                        <td className="px-1.5">{rps.kode_mk}</td>
                      </tr>
                      <tr className="py-2">
                        <td className="font-semibold">Deskripsi</td>
                        <td>:</td>
                        <td className="px-1.5">{rps.deskripsi_mk}</td>
                      </tr>
                      <tr className="py-2">
                        <td className="font-semibold">SKS</td>
                        <td>:</td>
                        <td className="px-1.5">{rps.sks}</td>
                      </tr>
                      <tr className="py-2">
                        <td className="font-semibold">Semester</td>
                        <td>:</td>
                        <td className="px-1.5">{rps.semester}</td>
                      </tr>
                      <tr className="py-2">
                        <td className="font-semibold">Dosen Pengampu</td>
                        <td>:</td>
                        <td className="px-1.5">
                          <ol className="list-decimal">
                            {dosenPengampu.map((item, i) => {
                              return (
                                <li key={i} className="ml-3.5">
                                  {item.nama}
                                </li>
                              );
                            })}
                          </ol>
                        </td>
                      </tr>
                      <tr className="py-2">
                        <td className="font-semibold">Prasyarat</td>
                        <td>:</td>
                        <td className="px-1.5">{rps.prasyarat}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="block bg-white border border-gray-200 rounded-lg shadow">
                <div className="rounded-t-lg bg-slate-200 px-4 py-2">
                  <h3 className="text-xl font-semibold">CLO</h3>
                </div>
                <div className="p-4">
                  <ol className="list-decimal">
                    {listClo.map((item, i) => {
                      return (
                        <li key={i} className="my-2 ml-4">
                          <span className="font-semibold mr-2 min-w-max">
                            {item.nama},
                          </span>
                          {item.deskripsi}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
              <div className="block bg-white border border-gray-200 rounded-lg shadow">
                <div className="rounded-t-lg bg-slate-200 px-4 py-2">
                  <h3 className="text-xl font-semibold">PLO</h3>
                </div>
                <div className="p-4">
                  <ol className="list-decimal">
                    {listPlo.map((item, i) => {
                      return (
                        <li key={i} className="my-2 ml-4">
                          <span className="font-semibold mr-2 min-w-max">
                            {item.nama},
                          </span>
                          {item.deskripsi}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
              <div className="block bg-white border border-gray-200 rounded-lg shadow">
                <div className="rounded-t-lg bg-slate-200 px-4 py-2">
                  <h3 className="text-xl font-semibold">Lembar Assessment</h3>
                </div>
                <div className="p-4">
                  <ol className="list-decimal">
                    {listAssessment.map((item, i) => {
                      return (
                        <li key={i} className="my-2 ml-4">
                          <span className="font-semibold mr-2 min-w-max">
                            {item.nama},
                          </span>
                          {item.deskripsi}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
