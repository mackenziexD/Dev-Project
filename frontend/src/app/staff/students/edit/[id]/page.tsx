"use client";

import useSWR, { mutate } from "swr";
import { fetcher, putter } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useParams, notFound } from "next/navigation";
import Sidebar from "../../../../components/sidebar";
import Link from "next/link";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function EditPage() {
  const params = useParams();
  const [selectedGroup, setSelectedGroup] = useState('');

  const { data: user, error } = useSWR(`/users/${params.id}`, fetcher);
  if(error){
    return notFound();
  }
  const { data: groups, error: groupsError } = useSWR(`/groups`, fetcher);

  useEffect(() => {
    if (user && groups && user.groups && groups.results) {
      const userGroup = user.groups.find(groupId => 
        groups.results.some(group => group.id === groupId)
      );
    
      if (userGroup) {
        setSelectedGroup(userGroup);
      }
    }
  }, [user, groups]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    let json = Object.fromEntries(form.entries());

    try {
      await putter(`/users/${params.id}/`, json);
      mutate(`/users/${params.id}`);

      toast.success(`User has been edited!`, {
        position: "top-right",
        theme: "dark",
      });

    } catch (error) {
      console.error(error);
      toast.error('Whoops, something went wrong.', {
        position: "top-right",
        theme: "dark",
      });
    }
  };

  return (
    <>
      <Sidebar />
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72 h-auto">
          <h1 className="text-2xl font-bold dark:text-white text-black">
            Edit User Group: {user?.first_name} {user?.last_name}
          </h1>
          <Link href="/staff/students" 
          className="py-2 px-3 mt-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <FontAwesomeIcon icon="chevron-left" className='flex-shrink-0' style={{width: "1rem", height: "1rem"}} />
            Back to Students List
          </Link>

          <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white ">
              <div className="-m-1.5">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                      <div >
                        <form onSubmit={handleSubmit}>
                          <div className="-m-1.5shadow sm:rounded-md">
                            <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6">
                              <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    First Name
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    name="first_name"
                                    id="name"
                                    autoComplete="name"
                                    defaultValue={user?.first_name}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-black dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Last Name
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    name="last_name"
                                    id="name"
                                    autoComplete="name"
                                    defaultValue={user?.last_name}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-black dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 mt-4">
                                <div className="col-span-1 sm:col-span-1">
                                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Username
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    name="username"
                                    id="username"
                                    autoComplete="username"
                                    defaultValue={user?.username}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-black dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                                <div className="col-span-2 sm:col-span-1 mt-4">
                                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Email
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    defaultValue={user?.email}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-black dark:bg-gray-700 dark:text-white"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 sm:px-6">
                              <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                  </div>
              </div>
          </div>

      </div>

    </>
  );
}
