import React from 'react';
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation'

const UserProfile = () => {
  const router = useRouter();
  const { data: user } = useSWR("/me", fetcher);
  const { logout, removeTokens } = AuthActions();
  library.add(fas);

  const handleLogout = async () => {
    console.log("awaiting logout");
    try {
      await logout();
      removeTokens();
      console.log("tokens removed");
      router.push("/");
    } catch (error) {
      console.log("Logout failed", error);
    }
  };

  return (
    <div className="flex flex-row items-center justify-end gap-2">
        <div className="hs-dropdown relative inline-flex [--placement:bottom-right]">
            <button id="hs-dropdown-with-header" type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <img className="inline-block size-[38px] rounded-full ring-2 ring-white dark:ring-gray-800" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" alt="Image Description" />
            </button>

            <div className="hs-dropdown-menu z-40 transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-2 dark:bg-gray-800 dark:border dark:border-gray-700" aria-labelledby="hs-dropdown-with-header">
            <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-300">{user?.email}</p>
            </div>
            <div className="mt-2 py-2 first:pt-0 last:pb-0">
                <Link className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="/profile">
                    <FontAwesomeIcon icon="user" className='flex-shrink-0 w-5 h-5 text-xs text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' style={{width: "1rem", height: "1rem"}}/>
                    Profile
                </Link>
                <hr className="my-2 border-t border-gray-200 dark:border-gray-600"/>
                <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" onClick={handleLogout}>
                    <FontAwesomeIcon icon="sign-out" className='flex-shrink-0 w-5 h-5 text-xs text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white' style={{width: "1rem", height: "1rem"}}/>
                    Logout
                </a>
            </div>
            </div>
        </div>
    </div>
  );
};

export default UserProfile;