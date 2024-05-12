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
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMataKuliahById } from '../../../api/matakuliah';
import { getCloById } from '../../../api/clo';
import {
  deleteAssessment,
  getAssessmentByCloId,
  searchAssessment,
} from '../../../api/lembarAssessment';
import { getUserRole } from '../../../api/user';
import ModalTambahAssessment from '../../../components/modal/assessment/ModalTambahAssessment';
import ModalEditAssessment from '../../../components/modal/assessment/ModalEditAssessment';
import {
  alertDelete,
  alertFailed,
  alertInfo,
  alertSuccess,
} from '../../../utils/alert';
import Loader from '../../../components/Loader';

export default function LembarAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mk, setMk] = useState({});
  const [clo, setClo] = useState({});
  const [listAssessment, setListAssessment] = useState([]);
  const [isTambahOpen, setIsTambahOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const totalPages =
    listAssessment != null
      ? Math.ceil(listAssessment.length / itemsPerPage)
      : 1;

  let displayedItems;
  if (listAssessment != null) {
    displayedItems = listAssessment.slice(startIndex, endIndex);
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

    async function fetchMk() {
      try {
        const res = await getMataKuliahById(params.mkId);
        if (res) {
          setMk(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function fetchClo() {
      try {
        const res = await getCloById(params.cloId);
        if (res) {
          setClo(res);
        }
      } catch (e) {
        console.error(e);
      }
    }

    async function fetchAssessment() {
      try {
        const res = await getAssessmentByCloId(params.cloId);
        if (res) {
          setListAssessment(res);
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
    fetchMk();
    fetchClo();
    fetchPage();
    fetchAssessment();
  }, [params, navigate, location]);

  const formatBobot = (bobot) => {
    return bobot * 100 + '%';
  };

  const maxBobot = () => {
    const sum = listAssessment.reduce((acc, item) => acc + item.bobot, 0);
    const bobotMax = (clo.bobot - sum) * 100;
    return bobotMax;
  };

  const handleTambahOpen = () => {
    if (maxBobot() <= 0) {
      alertInfo(
        `Tidak dapat menambah lagi karena bobot sudah mencapai max (${
          clo.bobot * 100
        }%)`
      );
    } else {
      setIsTambahOpen(true);
    }
  };

  const render = async () => {
    try {
      const res = await getAssessmentByCloId(params.cloId);
      if (res) {
        setListAssessment(res);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = async (key) => {
    if (key.length > 1) {
      try {
        const res = await searchAssessment(params.cloId, key);
        if (res) {
          setListAssessment(res);
        }
      } catch (e) {
        console.error(e);
      }
    } else if (key.length === 0) {
      render();
    }
  };

  const listNav = [
    { name: 'RPS', link: '/dosen/rps' },
    { name: `CLO / ${mk.kode_mk}`, link: `/dosen/rps/${mk.id}/clo` },
    {
      name: `Assessment / ${clo.nama}`,
      link: `/dosen/rps/${mk.id}/clo/${clo.id}/assessment`,
    },
  ];

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
            <h2 className="text-semibold text-3xl">{`${clo.nama} (${formatBobot(
              clo.bobot
            )})`}</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">
                Daftar Lembar Assessment
              </h3>
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
                      className="bg-gray-50 w-72 max-w-96 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Search..."
                      required
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleTambahOpen}
                  className="flex justify-center items-center focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-1.5 me-2 mb-2"
                >
                  Tambah
                  <PlusCircleIcon className="w-6 ml-1" />
                </button>
              </div>
              {maxBobot() > 0 && (
                <div
                  id="alert-3"
                  className="flex items-center p-3 mb-2 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-400"
                  role="alert"
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ms-3 text-sm font-medium">
                    {`Perlu penambahan assessment karena bobot masih belum maksimal. Sisa bobot (${maxBobot()}%)`}
                  </div>
                </div>
              )}
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
                        Bobot
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Jenis Assessment
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedItems.map((item, i) => {
                      const handleEdit = () => {
                        setSelectedAssessment(item);
                        setIsEditOpen(true);
                      };
                      const handleDelete = async () => {
                        try {
                          const res = await deleteAssessment(item.id);
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
                          <td className="px-6 py-4">
                            {formatBobot(item.bobot)}
                          </td>
                          <td className="px-6 py-4">{item.jenis}</td>
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
                  totalData={listAssessment.length}
                  pageSize={itemsPerPage}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
      {isTambahOpen && (
        <ModalTambahAssessment
          close={() => setIsTambahOpen(false)}
          render={render}
          clo={clo}
          listAssessment={listAssessment}
        />
      )}
      {isEditOpen && (
        <ModalEditAssessment
          close={() => setIsEditOpen(false)}
          render={render}
          clo={clo}
          data={selectedAssessment}
          listAssessment={listAssessment}
        />
      )}
      {isLoading && <Loader />}
    </>
  );
}
