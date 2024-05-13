import { PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import Breadcrumb from '../../components/Breadcrumb';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import Pagination from '../../components/Pagination';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserRole } from '../../api/user';
import { alertDelete, alertFailed, alertSuccess } from '../../utils/alert';
import Loader from '../../components/Loader';
import { deleteKurikulum, getKurikulum } from '../../api/kurikulum';
import ModalTambahKurikulum from '../../components/modal/kurikulum/ModalTambahKurikulum';

export default function Kurikulum() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [listKurikulum, setListKurikulum] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const listNav = [{ name: 'Kurikulum', link: '/prodi/kurikulum' }];

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages =
    listKurikulum != null ? Math.ceil(listKurikulum.length / itemsPerPage) : 1;

  let displayedItems;
  if (listKurikulum != null) {
    displayedItems = listKurikulum.slice(startIndex, endIndex);
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
        const res = await getKurikulum();
        if (res) {
          setListKurikulum(res);
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
      const res = await getKurikulum();
      if (res) {
        setListKurikulum(res);
      }
    } catch (e) {
      console.error(e);
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
          <Sidebar typeUser={'prodi'} page={'kurikulum'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'prodi'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">Kurikulum</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">Daftar Kurikulum</h3>
              <div className="flex justify-start md:justify-end items-center">
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
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedItems.map((item, i) => {
                      const handleDelete = async () => {
                        try {
                          const res = await deleteKurikulum(item.id);
                          if (res) {
                            alertSuccess('Berhasil menghapus data');
                            render();
                          }
                        } catch (e) {
                          alertFailed('Gagal menghapus data');
                          console.error(e);
                        }
                      };
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 border-b"
                        >
                          <td className="px-6 py-4">{item.nama}</td>
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
                  totalData={listKurikulum.length}
                  pageSize={itemsPerPage}
                />
              </div>
            </div>
          </main>
        </div>
        {isTambahOpen && (
          <ModalTambahKurikulum
            close={() => setIsTambahOpen(false)}
            render={render}
          />
        )}
        {isLoading && <Loader />}
      </div>
    </>
  );
}
