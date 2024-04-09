import React, { useEffect, useState } from 'react';
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AuthActions } from "@/app/auth/utils";
import Link from 'next/link';
import SidebarLink from './SidebarLink';
import UserProfile from './UserProfile';

const Sidebar: React.FC = () => {
    const { data: user } = useSWR("/me", fetcher);
  
    library.add(fas);

    return (
        <>
            <header className="top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap z-[48] w-full bg-white border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:bg-gray-800 dark:border-gray-700">
                <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-6 md:px-8" aria-label="Global">
                    <div className="me-5 lg:me-0 lg:hidden">
                        <a className="flex-none text-xl font-semibold dark:text-white" href="#" aria-label="Brand">Brand</a>
                    </div>

                    <div className="w-full flex items-center justify-end ms-auto sm:justify-between sm:gap-x-3 sm:order-3">
                        <div className="sm:hidden">
                        <button type="button" className="w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-gray-700 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                            <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </button>
                        </div>

                        <div className="hidden sm:block">
                        </div>

                        <UserProfile />
                        
                    </div>
                </nav>
            </header>

            <div className="sticky top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center py-4">
                    <button type="button" className="text-gray-500 hover:text-gray-600" data-hs-overlay="#application-sidebar" aria-controls="application-sidebar" aria-label="Toggle navigation">
                        <span className="sr-only">Toggle Navigation</span>
                        <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                    </button>
                </div>
            </div>

            <div id="application-sidebar" className="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform hidden fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-slate-700 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-6">
                <Link className="flex-none text-xl font-semibold dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600" href="/dashboard" aria-label="Brand">Attendance Tracker</Link>
                </div>

                <nav className="hs-accordion-group p-6 w-full flex flex-col flex-wrap" data-hs-accordion-always-open>
                    <ul className="space-y-1.5 pt-3">
                        <SidebarLink href="/dashboard" icon="home">Dashboard</SidebarLink>
                        <SidebarLink href="#" icon="calendar">Calendar</SidebarLink>
                    </ul>
                    <p className="text-sm text-gray-500 mt-6 dark:text-gray-400">Staff</p>
                    <ul className="space-y-1.5 pt-3">
                        <SidebarLink href="#" icon="users-cog">Users</SidebarLink>
                        <SidebarLink href="/lessons" icon="chalkboard-teacher">Lessons</SidebarLink>
                    </ul>
                    <p className="text-sm text-gray-500 mt-6 dark:text-gray-400">Administrator</p>
                    <ul className="space-y-1.5 pt-3">
                        <SidebarLink href="/admin/all-users" icon="globe">Global Users</SidebarLink>
                        <SidebarLink href="/admin/user-groups" icon="layer-group">User Groups</SidebarLink>
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default Sidebar;