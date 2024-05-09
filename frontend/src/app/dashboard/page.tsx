"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "../components/sidebar";
import { useEffect } from "react";
import { shortDate } from "@/app/components/date";


export default function Home() {
  const router = useRouter();

  const { data: currnetUser } = useSWR("/me", fetcher);
  const { data: upcomingClasses } = useSWR("/me/upcomingClasses", fetcher);

  useEffect(() => {
        if(upcomingClasses){
            console.log(upcomingClasses);
        }
    }, [upcomingClasses]);

  return (
    <>
        <Sidebar />
        <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72 h-auto">
            <h1 className="text-2xl font-bold dark:text-white text-black">Dashboard</h1>
            <p className="text-gray-500 mb-4">
                Welcome, {currnetUser?.username || "Loading..."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">

                <div className="overflow-hidden shadow-md">
                    <div className="px-6 py-4 dark:bg-gray-800 dark:border-gray-600 bg-white border-b dark:text-gray-100 text-gray-700 text-black border-gray-200 font-bold uppercase">
                        10 Latest Upcoming Classes
                    </div>
                    
                    <table className="min-w-full divide-y dark:bg-gray-800 divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Course</th>
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Teacher</th>
                            { currnetUser?.is_staff && (
                                <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Students Attending </th>
                            )}
                            <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Start Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {upcomingClasses?.map((classes) => (
                                <tr key={classes.id}>
                                    <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{classes.course_name}</td>
                                    <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{classes.teacher}</td>
                                    { currnetUser?.is_staff && (
                                        <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200 text-center">{classes.students.length || '0'}</td>
                                    )}
                                    <td className="px-6 py-2.5 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">{shortDate(classes.schedule)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        
            
                

            </div>

        </div>
    </>
  );
}