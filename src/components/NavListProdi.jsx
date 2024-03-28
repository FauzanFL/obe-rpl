/* eslint-disable react/prop-types */
import {
  AcademicCapIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  DocumentCheckIcon,
  HomeModernIcon,
  PresentationChartLineIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function NavListProdi({ open, page }) {
  const [kOpen, setKOpen] = useState(
    page === 'kurikulum' || page === 'plo' || page == 'jenis-assessment'
      ? true
      : false
  );
  const [mkOpen, setMkOpen] = useState(
    page === 'penilaian' || page === 'plotting' || page === 'matakuliah'
      ? true
      : false
  );

  return (
    <>
      <li
        className={`font-bold cursor-pointer my-1 p-2 px-4 rounded-md ${
          page === 'dashboard' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link to={'/prodi/dashboard'} className="flex items-center gap-x-4 ">
          <PresentationChartLineIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            Dashboard
          </span>
        </Link>
      </li>
      <li
        onClick={() => setKOpen(!kOpen)}
        className="font-bold flex items-center gap-x-4 cursor-pointer my-1 p-2 px-4 rounded-md bg-indigo-300 hover:bg-indigo-200"
      >
        <AcademicCapIcon className="w-7" />
        <span className={`${!open && 'hidden'} origin-left duration-200`}>
          Kurikulum
        </span>
        <div className={`${!open && 'hidden'} flex justify-end flex-1`}>
          <ChevronDownIcon
            className={`${kOpen ? 'rotate-180' : ''} w-5 duration-200`}
          />
        </div>
      </li>
      <ul
        className={`${!kOpen ? 'h-0' : 'h-auto'} overflow-hidden duration-500`}
      >
        <li
          className={`font-medium cursor-pointer my-1 p-2 px-4 rounded-md ${
            page === 'kurikulum' ? 'bg-indigo-200' : 'bg-indigo-400'
          } hover:bg-indigo-200`}
        >
          <Link to={'/prodi/kurikulum'} className="flex items-center gap-x-4">
            <AcademicCapIcon className="w-7" />
            <span className={`${!open && 'hidden'} origin-left duration-200`}>
              Kurikulum
            </span>
          </Link>
        </li>
        <li
          className={`font-medium cursor-pointer my-1 p-2 px-4 rounded-md ${
            page === 'plo' ? 'bg-indigo-200' : 'bg-indigo-400'
          } hover:bg-indigo-200`}
        >
          <Link to={'/prodi/plo'} className="flex items-center gap-x-4">
            <ClipboardDocumentIcon className="w-7" />
            <span className={`${!open && 'hidden'} origin-left duration-200`}>
              PLO
            </span>
          </Link>
        </li>
        <li
          className={`font-medium cursor-pointer my-1 p-2 px-4 rounded-md ${
            page === 'jenis-assessment' ? 'bg-indigo-200' : 'bg-indigo-400'
          } hover:bg-indigo-200`}
        >
          <Link
            to={'/prodi/jenis-assessment'}
            className="flex items-center gap-x-4"
          >
            <ClipboardDocumentListIcon className="w-7" />
            <span className={`${!open && 'hidden'} origin-left duration-200`}>
              Jenis Assessment
            </span>
          </Link>
        </li>
      </ul>
      <li
        onClick={() => setMkOpen(!mkOpen)}
        className="font-bold flex items-center gap-x-4 cursor-pointer my-1 p-2 px-4 rounded-md bg-indigo-300 hover:bg-indigo-200"
      >
        <BookOpenIcon className="w-7" />
        <span className={`${!open && 'hidden'} origin-left duration-200`}>
          Mata Kuliah
        </span>
        <div className={`${!open && 'hidden'} flex justify-end flex-1`}>
          <ChevronDownIcon
            className={`${mkOpen ? 'rotate-180' : ''} w-5 duration-200`}
          />
        </div>
      </li>
      <ul
        className={`${!mkOpen ? 'h-0' : 'h-auto'} overflow-hidden duration-500`}
      >
        <li
          className={`font-medium cursor-pointer my-1 p-2 px-4 rounded-md ${
            page === 'matakuliah' ? 'bg-indigo-200' : 'bg-indigo-400'
          }  hover:bg-indigo-200`}
        >
          <Link to={'/prodi/matakuliah'} className="flex items-center gap-x-4">
            <BookOpenIcon className="w-7" />
            <span className={`${!open && 'hidden'} origin-left duration-200`}>
              Mata Kuliah
            </span>
          </Link>
        </li>
        <li
          className={`font-medium cursor-pointer my-1 p-2 px-4 rounded-md ${
            page === 'plotting' ? 'bg-indigo-200' : 'bg-indigo-400'
          }  hover:bg-indigo-200`}
        >
          <Link to={'/prodi/plotting'} className="flex items-center gap-x-4">
            <BriefcaseIcon className="w-7" />
            <span className={`${!open && 'hidden'} origin-left duration-200`}>
              Plotting Dosen
            </span>
          </Link>
        </li>
        <li
          className={`font-medium cursor-pointer my-1 p-2 px-4 rounded-md ${
            page === 'penilaian' ? 'bg-indigo-200' : 'bg-indigo-400'
          } hover:bg-indigo-200`}
        >
          <Link to={'/prodi/penilaian'} className="flex items-center gap-x-4">
            <DocumentCheckIcon className="w-7" />
            <span className={`${!open && 'hidden'} origin-left duration-200`}>
              Penilaian
            </span>
          </Link>
        </li>
      </ul>
      <li
        className={`font-bold cursor-pointer p-2 px-4 rounded-md ${
          page === 'pengguna' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link to={'/prodi/pengguna'} className="flex items-center gap-x-4">
          <UsersIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            Pengguna
          </span>
        </Link>
      </li>
      <li
        className={`font-bold cursor-pointer my-1 p-2 px-4 rounded-md ${
          page === 'kelas' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link to={'/prodi/kelas'} className="flex items-center gap-x-4">
          <HomeModernIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            Kelas
          </span>
        </Link>
      </li>
      <li
        className={`font-bold cursor-pointer my-1 p-2 px-4 rounded-md ${
          page === 'tahun-ajaran' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link to={'/prodi/tahun-ajaran'} className="flex items-center gap-x-4">
          <CalendarDaysIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            Tahun Ajaran
          </span>
        </Link>
      </li>
      <li
        className={`font-bold cursor-pointer my-1 p-2 px-4 rounded-md ${
          page === 'index-penilaian' ? 'bg-indigo-200' : 'bg-indigo-300'
        } hover:bg-indigo-200`}
      >
        <Link
          to={'/prodi/index-penilaian'}
          className="flex items-center gap-x-4"
        >
          <BookOpenIcon className="w-7" />
          <span className={`${!open && 'hidden'} origin-left duration-200`}>
            Index Penilaian
          </span>
        </Link>
      </li>
    </>
  );
}
