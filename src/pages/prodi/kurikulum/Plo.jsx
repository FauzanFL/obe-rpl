import {
  PencilSquareIcon,
  PlusCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import Breadcrumb from '../../../components/Breadcrumb';
import Header from '../../../components/Header';
import Pagination from '../../../components/Pagination';
import Sidebar from '../../../components/Sidebar';
import { useEffect, useState } from 'react';
import { deletePlo, getPloByObeId, searchPloByObeId } from '../../../api/plo';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserRole } from '../../../api/user';
import { getActivePerancangan } from '../../../api/perancanganObe';
import ModalTambahPlo from '../../../components/modal/plo/ModalTambahPlo';
import ModalEditPlo from '../../../components/modal/plo/ModalEditPlo';
import { alertDelete, alertFailed, alertSuccess } from '../../../utils/alert';
import Loader from '../../../components/Loader';

export default function Plo() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listPlo, setListPlo] = useState([]);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPlo, setSelectedPlo] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const listNav = [{ name: 'PLO', link: '/prodi/plo' }];

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages =
    listPlo != null ? Math.ceil(listPlo.length / itemsPerPage) : 1;

  let displayedItems;
  if (listPlo != null) {
    displayedItems = listPlo.slice(startIndex, endIndex);
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
      try {
        const obeActive = await getActivePerancangan();
        const res = await getPloByObeId(obeActive.id);
        if (res) {
          setListPlo(res);
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
    fetch();
  }, [navigate, location]);

  const render = async () => {
    try {
      const obeActive = await getActivePerancangan();
      const res = await getPloByObeId(obeActive.id);
      if (res) {
        setListPlo(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (key) => {
    if (key.length > 1) {
      try {
        const obeActive = await getActivePerancangan();
        const res = await searchPloByObeId(obeActive.id, key);
        if (res) {
          setListPlo(res);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (key.length === 0) {
      try {
        const obeActive = await getActivePerancangan();
        const res = await getPloByObeId(obeActive.id);
        if (res) {
          setListPlo(res);
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
          <Sidebar typeUser={'prodi'} page={'plo'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">PLO</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar PLO</h3>
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
                      className="bg-gray-50 w-72 max-w-96 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5"
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
                        Nama
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Deskripsi
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedItems.map((item, i) => {
                      const handleEdit = () => {
                        setSelectedPlo(item);
                        setIsEditOpen(true);
                      };
                      const handleDelete = async () => {
                        try {
                          const res = await deletePlo(item.id);
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
                          <td className="px-6 py-4">{item.nama}</td>
                          <td className="px-6 py-4">{item.deskripsi}</td>
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
                  totalData={listPlo.length}
                  pageSize={itemsPerPage}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isTambahOpen && (
        <ModalTambahPlo close={() => setIsTambahOpen(false)} render={render} />
      )}
      {isEditOpen && (
        <ModalEditPlo
          close={() => setIsEditOpen(false)}
          render={render}
          data={selectedPlo}
        />
      )}
      {isLoading && <Loader />}
    </>
  );
}
