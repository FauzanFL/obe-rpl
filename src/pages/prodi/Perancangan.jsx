import {
  CursorArrowRippleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Pagination from '../../components/Pagination';
import { useEffect, useState } from 'react';
import {
  activatePerancangan,
  deletePerancangan,
  getPerancangan,
  searchPerancangan,
} from '../../api/perancanganObe';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserRole } from '../../api/user';
import ModalTambahPerancangan from '../../components/modal/perancangan/ModalTambahPerancangan';
import ModalEditPerancangan from '../../components/modal/perancangan/ModalEditPerancangan';
import {
  alertActivate,
  alertDelete,
  alertFailed,
  alertSuccess,
} from '../../utils/alert';
import Loader from '../../components/Loader';

export default function Perancangan() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [listPerancangan, setListPerancangan] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const listNav = [{ name: 'Perancangan', link: '/prodi/perancangan-obe' }];

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages =
    listPerancangan != null
      ? Math.ceil(listPerancangan.length / itemsPerPage)
      : 1;

  let displayedItems;
  if (listPerancangan != null) {
    displayedItems = listPerancangan.slice(startIndex, endIndex);
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

    async function fetchList() {
      try {
        const res = await getPerancangan();
        if (res) {
          setListPerancangan(res);
        }
        setIsLoading(false);
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

    fetchUser();
    fetchPage();
    fetchList();
  }, [navigate, location]);

  const render = async () => {
    try {
      const res = await getPerancangan();
      if (res) {
        setListPerancangan(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (key) => {
    if (key.length > 1) {
      try {
        const res = await searchPerancangan(key);
        if (res) {
          setListPerancangan(res);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (key.length === 0) {
      try {
        const res = await getPerancangan();
        if (res) {
          setListPerancangan(res);
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

  const ActiveSign = () => {
    return (
      <>
        <div className="flex justify-center items-center w-5 h-5 mr-1 border rounded-full">
          <div className="w-3 h-3 border rounded-full bg-green-400"></div>
        </div>
        Aktif
      </>
    );
  };

  const InactiveSign = () => {
    return (
      <>
        <div className="flex justify-center items-center w-5 h-5 mr-1 border rounded-full">
          <div className="w-3 h-3 border rounded-full bg-gray-400"></div>
        </div>
        Tidak Aktif
      </>
    );
  };

  return (
    <>
      <div className="flex">
        <div className="fixed top-0 bottom-0 z-50 bg-indigo-500 md:static">
          <Sidebar typeUser={'prodi'} page={'perancangan-obe'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Perancangan</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Perancangan OBE</h3>
              <div className="flex flex-col md:flex-row items-start justify-between md:items-center">
                <div className="py-2">
                  <label htmlFor="simple-search" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                  onClick={() => setIsTambahOpen(true)}
                  type="button"
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
                        Nama
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Kurikulum
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedItems.map((item, i) => {
                      const handleEdit = () => {
                        setSelectedId(item.id);
                        setIsEditOpen(true);
                      };
                      const handleDelete = async () => {
                        try {
                          const res = await deletePerancangan(item.id);
                          if (res) {
                            alertSuccess('Berhasil menghapus data');
                            render();
                          }
                        } catch (e) {
                          alertFailed('Gagal menghapus data');
                          console.error(e);
                        }
                      };
                      const handleActivate = async () => {
                        try {
                          const res = await activatePerancangan(item.id);
                          if (res) {
                            alertSuccess('Berhasil mengaktifkan');
                            render();
                          }
                        } catch (e) {
                          alertFailed('Gagal mengaktifkan');
                        }
                      };
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 border-b"
                        >
                          <td className="px-6 py-4">{item.nama}</td>
                          <td className="flex items-center px-6 py-4">
                            {item.status === 'active' ? (
                              <ActiveSign />
                            ) : (
                              <InactiveSign />
                            )}
                          </td>
                          <td className="px-6 py-4">{item.kurikulum}</td>
                          <td className="flex px-6 py-4">
                            <button
                              type="button"
                              onClick={handleEdit}
                              className="flex justify-center items-center focus:outline-none text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <PencilSquareIcon className="w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => alertDelete(handleDelete)}
                              className="flex justify-center items-center focus:outline-none text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <TrashIcon className="w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => alertActivate(handleActivate)}
                              className="flex justify-center items-center focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                            >
                              <CursorArrowRippleIcon className="w-5 mr-1" />
                              Aktivasi
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
                  totalData={listPerancangan.length}
                  pageSize={itemsPerPage}
                />
              </div>
            </div>
          </main>
        </div>
        {isTambahOpen && (
          <ModalTambahPerancangan
            close={() => setIsTambahOpen(false)}
            render={render}
          />
        )}
        {isEditOpen && (
          <ModalEditPerancangan
            close={() => setIsEditOpen(false)}
            render={render}
            id={selectedId}
          />
        )}
        {isLoading && <Loader />}
      </div>
    </>
  );
}
