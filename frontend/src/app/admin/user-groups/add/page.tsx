"use client";

import useSWR, { mutate } from "swr";
import { fetcher, poster } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/sidebar";
import Link from "next/link";
import { toast } from "react-toastify";

export default function LessonAdd() {
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const name = form.get('name');

    try {
      await poster(`/groups/`, { name });
      router.push("/admin/user-groups");
    } catch (error) {
      console.error('Request Error:', error);
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
            Create A New Group
          </h1>

          <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white ">
              <div className="-m-1.5">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                      <div >
                        <form onSubmit={handleSubmit}>
                          <div className="-m-1.5shadow sm:rounded-md">
                            <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6">
                                <div className="col-span-6 sm:col-span-3">
                                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Name
                                  </label>
                                  <input
                                    required
                                    type="text"
                                    name="name"
                                    id="name"
                                    autoComplete="name"
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-black dark:bg-gray-700 dark:text-white"
                                  />
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