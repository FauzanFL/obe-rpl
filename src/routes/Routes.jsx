import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import MataKuliah from '../pages/prodi/MataKuliah';
import Kurikulum from '../pages/prodi/Kurikulum';
import Pengguna from '../pages/prodi/Pengguna';
import Plo from '../pages/prodi/kurikulum/Plo';
import Penilaian from '../pages/prodi/matakuliah/Penilaian';
import PlottingDosen from '../pages/prodi/matakuliah/PlottingDosen';
import NotFound from '../pages/NotFound';
import DashboardProdi from '../pages/prodi/DashboardProdi';
import DashboardDosen from '../pages/dosen/DashboardDosen';
import MataKuliahDosen from '../pages/dosen/MataKuliahDosen';
import Clo from '../pages/dosen/rps/Clo';
import LembarAssessment from '../pages/dosen/rps/LembarAssessment';
import PenilaianDosen from '../pages/dosen/matakuliah/PenilaianDosen';
import Rps from '../pages/dosen/Rps';
import RpsDetail from '../pages/dosen/RpsDetail';
import PenilaianKelasDosen from '../pages/dosen/matakuliah/PenilaianKelasDosen';
import PenilaianKelas from '../pages/prodi/matakuliah/PenilaianKelas';
import Kelas from '../pages/prodi/Kelas';
import TahunAjaran from '../pages/prodi/TahunAjaran';
import IndexPenilaian from '../pages/prodi/IndexPenilaian';
import JenisAssessment from '../pages/prodi/kurikulum/JenisAssessment';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/prodi/dashboard',
    element: <DashboardProdi />,
  },
  {
    path: '/prodi/matakuliah',
    element: <MataKuliah />,
  },
  {
    path: '/prodi/kurikulum',
    element: <Kurikulum />,
  },
  {
    path: '/prodi/pengguna',
    element: <Pengguna />,
  },
  {
    path: '/prodi/plo',
    element: <Plo />,
  },
  {
    path: '/prodi/penilaian',
    element: <Penilaian />,
  },
  {
    path: '/prodi/kelas',
    element: <Kelas />,
  },
  {
    path: '/prodi/tahunAjaran',
    element: <TahunAjaran />,
  },
  {
    path: '/prodi/jenisAssessment',
    element: <JenisAssessment />,
  },
  {
    path: '/prodi/indexPenilaian',
    element: <IndexPenilaian />,
  },
  {
    path: '/prodi/penilaian/matakuliah/:mkId',
    element: <PenilaianKelas />,
  },
  {
    path: '/prodi/plotting',
    element: <PlottingDosen />,
  },
  {
    path: '/dosen/dashboard',
    element: <DashboardDosen />,
  },
  {
    path: '/dosen/matakuliah',
    element: <MataKuliahDosen />,
  },
  {
    path: '/dosen/rps/:mkId/clo',
    element: <Clo />,
  },
  {
    path: '/dosen/rps/:mkId/clo/:cloId/assessment',
    element: <LembarAssessment />,
  },
  {
    path: '/dosen/matakuliah/:mkId/penilaian',
    element: <PenilaianDosen />,
  },
  {
    path: '/dosen/matakuliah/:mkId/penilaian/kelas/:kelasId',
    element: <PenilaianKelasDosen />,
  },
  {
    path: '/dosen/rps',
    element: <Rps />,
  },
  {
    path: '/dosen/rps/detail/:mkId',
    element: <RpsDetail />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
