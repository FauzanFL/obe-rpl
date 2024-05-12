import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { HomeIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';

/* eslint-disable react/prop-types */
export default function Breadcrumb({ listNav }) {
  const list = listNav !== undefined ? listNav : [];
  return (
    <>
      <nav className="flex">
        <ol className="inline-flex flex-wrap items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
          <li className="inline-flex items-center">
            <Link
              to={'/'}
              className="inline-flex items-center text-sm font-medium text-blue-500 hover:underline hover:text-blue-600"
            >
              <HomeIcon className="w-4 mr-2" />
              Home
            </Link>
          </li>
          {list.length !== 0 &&
            list.map((item, i) => {
              return (
                <li key={i} className="flex items-center">
                  <ChevronRightIcon className="w-4 mr-1" />
                  <Link
                    to={item.link}
                    className="inline-flex items-center text-sm font-medium text-blue-500 hover:underline hover:text-blue-600"
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
        </ol>
      </nav>
    </>
  );
}
