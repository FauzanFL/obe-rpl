/* eslint-disable react/prop-types */
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid';
import { logoutUser } from '../api/user';
import RemoveCookie from '../hooks/RemoveCookie';
import { useNavigate } from 'react-router-dom';
import { alertFailed, alertSuccess } from '../utils/alert';

export default function Header({ typeUser }) {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res) {
        RemoveCookie('usrin');
        RemoveCookie('Authorization');
        navigate('/');
      }
      alertSuccess('Logout success');
    } catch (e) {
      alertFailed('Logout failed');
    }
  };
  return (
    <>
      <header className="p-2 bg-indigo-900 flex justify-end sticky z-30 top-0">
        <div className="mr-2 h-7">
          {typeUser !== 'all' && (
            <button
              onClick={handleLogout}
              type="button"
              className="flex focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Log out
              <ArrowRightStartOnRectangleIcon className="ml-1 w-5" />
            </button>
          )}
        </div>
      </header>
    </>
  );
}
