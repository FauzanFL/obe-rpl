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
} from '../../../api/lembarAssessment';
import { getUserRole } from '../../../api/user';
import ModalTambahAssessment from '../../../components/modal/assessment/ModalTambahAssessment';
import ModalEditAssessment from '../../../components/modal/assessment/ModalEditAssessment';
import { alertDelete, alertFailed, alertSuccess } from '../../../utils/alert';
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
    fetchMk();
    fetchClo();
    fetchPage();
    fetchAssessment();
    setIsLoading(false);
  }, [params, navigate, location]);

  const formatBobot = (bobot) => {
    return bobot * 100 + '%';
  };

  const handleTambahOpen = () => {
    const sum = listAssessment.reduce((acc, item) => acc + item.bobot, 0);
    const bobotMax = (clo.bobot - sum) * 100;
    if (bobotMax <= 0) {
      console.log(
        `Tidak dapat menambah lembar assessment lagi karena bobot sudah ${
          clo.bobot * 100
        } persen`
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
        <div className="">
          <Sidebar typeUser={'dosen'} page={'rps'} />
        </div>
        <div className="flex-1 h-screen overflow-auto">
          <Header typeUser={'dosen'} />
          <div className="px-7 pt-4">
            <Breadcrumb listNav={listNav} />
          </div>
          <main className="p-7 text-wrap">
            <h2 className="text-semibold text-3xl">{clo.nama}</h2>
            <div className="block mt-3 p-5 bg-white border border-gray-200 rounded-lg shadow">
              <h3 className="text-semibold text-2xl">
                Daftar Lembar Assessment
              </h3>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleTambahOpen}
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
