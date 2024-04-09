"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Link from "next/link";

export default function allUsers() {
  
    const [currentPage, setCurrentPage] = useState(1);
    const [noMorePages, setNoMorePages] = useState(false);
    const { data: users, error } = useSWR(`/users?page=${currentPage}`, fetcher);

    function determineUserRole(user: any) {
        if (user.is_superuser) {
        return "Superuser";
        } else if (user.is_staff) {
        return "Staff";
        } else {
        return "Student";
        }
    }

    useEffect(() => {
        if (users?.next === null) {
            setNoMorePages(true);
        } else {
            setNoMorePages(false);
        }
    }, [error, users]); 

  return (
    <>
            <Sidebar />
                <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
                    <h1 className="text-2xl font-bold dark:text-white text-black">
                        Global Users
                        <Link href="/admin/user-groups/add">
                            <button type="button" className="float-end py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                Add Group
                            </button>
                        </Link>
                    </h1>

                    <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white border-b border-gray-600">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="border overflow-hidden dark:border-gray-700">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email Address</th>
                                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Role</th>
                                            <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                            {users?.results.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{user.username}</td>
                                                    <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{user.email || 'None'}</td>
                                                    <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{determineUserRole(user)}</td>
                                                    <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                                                        <button type="button" className="inline-flex items-center gap-x-2 pr-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                            Edit
                                                        </button>
                                                        <button type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="py-1 px-4">
                                    <nav className="flex items-center space-x-1">
                                        <button type="button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                            <span aria-hidden="true">«</span>
                                            <span className="sr-only">Previous</span>
                                        </button>

                                        <span>Page {currentPage}</span>
                                        
                                        <button type="button" onClick={() => setCurrentPage(currentPage + 1)} disabled={noMorePages} className="p-2.5 inline-flex items-center gap-x-2 text-sm rounded-full text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                            <span className="sr-only">Next</span>
                                            <span aria-hidden="true">»</span>
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

        </>
  );
}