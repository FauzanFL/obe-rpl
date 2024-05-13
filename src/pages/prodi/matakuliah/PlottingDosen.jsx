import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Pagination from '../../../components/Pagination';
import Sidebar from '../../../components/Sidebar';
import { useEffect, useState } from 'react';
import {
  deletePlotting,
  getPlottingByTahun,
  searchPlottingByTahun,
} from '../../../api/plotting';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import ModalTambahPlotting from '../../../components/modal/plotting/ModalTambahPlotting';
import { alertDelete, alertFailed, alertSuccess } from '../../../utils/alert';
import Loader from '../../../components/Loader';
import {
  getTahunAjaran,
  getTahunAjaranById,
  getTahunAjaranNow,
} from '../../../api/tahunAjaran';

export default function PlottingDosen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listPlotting, setListPlotting] = useState([]);
  const [listTahunAjaran, setListTahunAjaran] = useState([]);
  const [tahunSelected, setTahunSelected] = useState({});
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const listNav = [{ name: 'Plotting Dosen', link: '/prodi/plotting' }];

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let totalPages;
  if (listPlotting != null) {
    const total = Math.ceil(listPlotting.length / itemsPerPage);
    if (total > 0) {
      totalPages = total;
    } else {
      totalPages = 1;
    }
  } else {
    totalPages = 1;
  }

  let displayedItems;
  if (listPlotting != null) {
    displayedItems = listPlotting.slice(startIndex, endIndex);
  }

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

    async function fetch() {
      const urlParams = new URLSearchParams(location.search);
      const year = urlParams.get('year');
      if (year === null) {
        try {
          const tahun = await getTahunAjaranNow();
          setTahunSelected(tahun);
          const res = await getPlottingByTahun(tahun.id);
          if (res) {
            setListPlotting(res);
          }
          setIsLoading(false);
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          const tahun = await getTahunAjaranById(year);
          setTahunSelected(tahun);
          const res = await getPlottingByTahun(year);
          if (res) {
            setListPlotting(res);
          }
          setIsLoading(false);
        } catch (e) {
          console.error(e);
        }
      }
    }

    async function fetchTahun() {
      try {
        const res = await getTahunAjaran();
        if (res) {
          setListTahunAjaran(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function fetchPage() {
      const urlParams = new URLSearchParams(location.search);
      const page = urlParams.get('page');
      if (page === null) {
        setCurrentPage(1);
      } else {
        try {
          setCurrentPage(parseInt(page));
        } catch (e) {
          console.error(e);
        }
      }
    }

    fetchUser();
    fetchPage();
    fetch();
    fetchTahun();
  }, [navigate, location]);

  const render = async () => {
    try {
      const res = await getPlottingByTahun(tahunSelected.id);
      if (res) {
        setListPlotting(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (key) => {
    if (key.length > 1) {
      try {
        const res = await searchPlottingByTahun(tahunSelected.id, key);
        if (res) {
          setListPlotting(res);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (key.length === 0) {
      render();
    }
  };

  const handlePageChange = (pageNumber) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', pageNumber);
    urlParams.set('year', tahunSelected.id);
    navigate(`?${urlParams.toString()}`);
  };

  const handlePrev = () => {
    if (currentPage != 1) {
      const current = currentPage - 1;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('page', current);
      urlParams.set('year', tahunSelected.id);
      navigate(`?${urlParams.toString()}`);
    }
  };

  const handleNext = () => {
    if (currentPage != totalPages) {
      const current = currentPage + 1;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('page', current);
      urlParams.set('year', tahunSelected.id);
      navigate(`?${urlParams.toString()}`);
    }
  };

  const handleFirst = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', 1);
    urlParams.set('year', tahunSelected.id);
    navigate(`?${urlParams.toString()}`);
  };

  const handleLast = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', totalPages);
    urlParams.set('year', tahunSelected.id);
    navigate(`?${urlParams.toString()}`);
  };

  const handleChooseTahun = async (tahunId) => {
    setIsLoading(true);
    const tahun = listTahunAjaran.find((item) => item.id === parseInt(tahunId));
    setTahunSelected(tahun);
    setCurrentPage(1);
    try {
      const res = await getPlottingByTahun(tahunId);
      if (res) {
        setListPlotting(res);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <>
      <div className="flex">
        <div className="fixed top-0 bottom-0 z-50 bg-indigo-500 md:static">
          <Sidebar typeUser={'prodi'} page={'plotting'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Plotting Dosen</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Plotting Dosen</h3>
              <select
                name="tahun"
                id="tahun"
                className="bg-gray-50 border border-gray-300 mt-2
               text-gray-900 text-sm rounded-lg block w-40 p-2.5"
                defaultValue={tahunSelected.id}
                onChange={({ target }) => handleChooseTahun(target.value)}
              >
                {listTahunAjaran.map((item, i) => {
                  return (
                    <option
                      key={i}
                      value={item.id}
                      selected={item.id == tahunSelected.id}
                    >
                      {`${item.tahun} ${item.semester}`}
                    </option>
                  );
                })}
              </select>
              <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
                <div className="py-2">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 18 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="simple-search"
                      onChange={({ target }) => handleSearch(target.value)}
                      className="bg-gray-50 w-full md:w-72 max-w-96 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5"
                      placeholder="Search..."
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTambahOpen(true)}
                  className="flex justify-center items-center focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                >
                  Tambah
                  <PlusCircleIcon className="w-6 ml-1" />
                </button>
              </div>
              <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
                <table className="w-full text-left rtl:text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Kode Dosen
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Kelas
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Kode Mata Kuliah
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedItems.map((item, i) => {
                      const handleDelete = async () => {
                        try {
                          const res = await deletePlotting(item.id);
                          if (res) {
                            alertSuccess('Berhasil menghapus data');
                            render();
                          }
                        } catch (e) {
                          alertFailed('Gagal menghapus data');
                        }
                      };
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 border-b"
                        >
                          <td className="px-6 py-4">{item.dosen}</td>
                          <td className="px-6 py-4">{item.kelas}</td>
                          <td className="px-6 py-4">{item.mata_kuliah}</td>
                          <td className="flex px-6 py-4">
                            <button
                              type="button"
                              onClick={() => alertDelete(handleDelete)}
                              className="flex justify-center items-center focus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <TrashIcon className="w-5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onFirst={handleFirst}
                  onLast={handleLast}
                  totalData={listPlotting.length}
                  pageSize={itemsPerPage}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isTambahOpen && (
        <ModalTambahPlotting
          close={() => setIsTambahOpen(false)}
          render={render}
          tahun={tahunSelected}
        />
      )}
      {isLoading && <Loader />}
    </>
  );
}
