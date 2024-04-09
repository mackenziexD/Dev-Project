"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import Sidebar from "../components/sidebar";
import Date from "@/app/components/date";

export default function Home() {
  const { data: Allclasses } = useSWR("/classes", fetcher);

  return (
        <>
            <Sidebar />
            <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
                <h1 className="text-2xl font-bold dark:text-white text-black">Lessons</h1>

                <div className="grid grid-cols-1 gap-4 mb-4 mt-4">

                    <div className="overflow-hidden shadow-md">
                        <div className="p-2 dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white border-b border-gray-600">

                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Course</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Teacher</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Students Attending</th>
                                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Start Time</th>
                                        <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {Allclasses?.results.map((classes) => (
                                            <tr key={classes.id}>
                                                <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{classes.course}</td>
                                                <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{classes.teacher}</td>
                                                <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{classes.students.length || '0'}</td>
                                                <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200"><Date dateString={classes.schedule} /></td>
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
                    </div>

                </div>

            </div>
        </>
  );
}