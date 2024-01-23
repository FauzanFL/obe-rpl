import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/home';
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
    path: '/dosen/matakuliah/penilaian',
    element: <PenilaianDosen />,
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
