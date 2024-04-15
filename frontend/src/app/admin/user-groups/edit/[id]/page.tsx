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

  const { data: group, error } = useSWR(`/groups/${params.id}`, fetcher);

  if(error){
    return notFound();
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get('name');

    try {
      await putter(`/groups/${params.id}/`, { name });
      mutate(`/groups/${params.id}`);

      toast.success(`User Group has been edited!`, {
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
            Edit User Group: {group?.name}
          </h1>
          <Link href="/admin/user-groups" 
          className="py-2 px-3 mt-2 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
            <FontAwesomeIcon icon="chevron-left" className='flex-shrink-0' style={{width: "1rem", height: "1rem"}} />
            Back to Groups List
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
                                    Name
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    defaultValue={group?.name}
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
