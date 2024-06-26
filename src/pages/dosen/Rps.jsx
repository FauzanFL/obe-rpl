import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Breadcrumb from '../../components/Breadcrumb';
import Pagination from '../../components/Pagination';
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/solid';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  getDosenMataKuliahByTahun,
  searchDosenMataKuliahByTahun,
} from '../../api/dosen';
import { getUserRole } from '../../api/user';
import Loader from '../../components/Loader';
import { getTahunAjaranNow } from '../../api/tahunAjaran';

export default function Rps() {
  const [listMk, setListMk] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const tahunAjaran = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const listNav = [{ name: 'RPS', link: '/dosen/rps' }];

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages =
    listMk != null ? Math.ceil(listMk.length / itemsPerPage) : 1;

  let displayedItems;
  if (listMk != null) {
    displayedItems = listMk.slice(startIndex, endIndex);
  }

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
        tahunAjaran.current = tahun;
        try {
          const res = await getDosenMataKuliahByTahun(tahun.id);
          if (res) {
            setListMk(res);
          }
          setIsLoading(false);
        } catch (e) {
          console.error(e);
        }
      } catch (e) {
        console.error(e);
      }
    }
    function fetchPage() {
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

    setIsLoading(true);
    fetchUser();
    fetchPage();
    fetch();
  }, [navigate, location]);

  const handleSearch = async (key) => {
    if (key.length > 1) {
      try {
        const res = await searchDosenMataKuliahByTahun(
          tahunAjaran.current.id,
          key
        );
        if (res) {
          setListMk(res);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (key.length === 0) {
      try {
        const res = await getDosenMataKuliahByTahun(tahunAjaran.current.id);
        if (res) {
          setListMk(res);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', pageNumber);
    navigate(`?${urlParams.toString()}`);
  };

  const handlePrev = () => {
    if (currentPage != 1) {
      const current = currentPage - 1;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('page', current);
      navigate(`?${urlParams.toString()}`);
    }
  };

  const handleNext = () => {
    if (currentPage != totalPages) {
      const current = currentPage + 1;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('page', current);
      navigate(`?${urlParams.toString()}`);
    }
  };

  const handleFirst = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', 1);
    navigate(`?${urlParams.toString()}`);
  };

  const handleLast = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('page', totalPages);
    navigate(`?${urlParams.toString()}`);
  };
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
            <h2 className="text-semibold text-3xl">RPS</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
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
              <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
                <table className="w-full text-left rtl:text-right">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Kode
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Nama
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedItems.map((item, i) => {
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 border-b"
                        >
                          <td className="px-6 py-4">{item.kode_mk}</td>
                          <td className="px-6 py-4">{item.nama}</td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/dosen/rps/${item.id}/clo`}
                              className="flex justify-center items-center focus:outline-none text-white bg-lime-500 hover:bg-lime-600 focus:ring-4 focus:ring-lime-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <ClipboardDocumentListIcon className="w-5 mr-1" />
                              CLO
                            </Link>
                            <Link
                              to={`/dosen/rps/detail/${item.id}`}
                              className="flex justify-center items-center focus:outline-none text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <DocumentTextIcon className="w-5 mr-1" />
                              Lihat RPS
                            </Link>
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
                  totalData={listMk.length}
                  pageSize={itemsPerPage}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isLoading && <Loader />}
    </>
  );
}
