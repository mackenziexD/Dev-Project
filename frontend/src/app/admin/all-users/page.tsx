"use client";

import useSWR, { mutate } from "swr";
import { fetcher, deleter } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import { toast } from "react-toastify";

export default function allUsers() {
  
    const [currentPage, setCurrentPage] = useState(1);
    const [noMorePages, setNoMorePages] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { data: users, error } = useSWR(`/users?page=${currentPage}`, fetcher);
    const { data: me, meError } = useSWR(`/me`, fetcher);

    function determineUserRole(user: any) {
        if (user.is_superuser) {
        return "Superuser";
        } else if (user.is_staff) {
        return "Staff";
        } else {
        return "Student";
        }
    }

    // Toggle modal and set the selected group ID
    const handleDeactivateClick = (groupId: any) => {
        setSelectedUserId(groupId);
        setShowModal(true);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleConfirmDeactivation = async () => {
        if (selectedUserId) {
            await deleter(`/users/${selectedUserId}/`);
            setShowModal(false);
            mutate(`/users?page=${currentPage}`);

            toast.success(`User has been deleted!`, {
                position: "top-right",
                theme: "dark",
            });
        }
    };

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
        <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72 h-auto">
            <h1 className="text-2xl font-bold dark:text-white text-black">
                Staff
                <Link href="/admin/all-users/add">
                    <button type="button" className="float-end py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                        Add User
                    </button>
                </Link>
            </h1>

            <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white border-b border-gray-600">
                <div className="-m-1.5">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border overflow-hidden dark:border-gray-700">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead>
                                    <tr>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Email Address</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Group</th>
                                    <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {users?.results.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{user.username}</td>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{user.email || 'None'}</td>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{determineUserRole(user)}</td>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{user.group_names}</td>
                                            <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm font-medium">
                                                <Link href={`/admin/all-users/edit/${user.id}`}>
                                                    <button type="button" className="inline-flex items-center gap-x-2 pr-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                        Edit
                                                    </button>
                                                </Link>
                                                {user.id !== me?.id && (
                                                    <button onClick={() => handleDeactivateClick(user.id)} type="button" className="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                                        Delete
                                                    </button>
                                                )}
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
        
        {showModal && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-black dark:bg-opacity-50 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-500 dark:text-gray-400 dark:text-white" id="modal-title">Delete User</h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">Are you sure you want to delete this user? This action cannot be undone.</p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={handleConfirmDeactivation}>Delete</button>
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
        )}

        </>
  );
}