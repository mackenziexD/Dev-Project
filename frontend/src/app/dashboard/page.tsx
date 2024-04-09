"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
import Sidebar from "../components/sidebar";
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
} from "@nextui-org/react";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const { data: currnetUser } = useSWR("/me", fetcher);

  return (
    <>
        <Sidebar />
        <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
            <h1 className="text-2xl font-bold dark:text-white text-black">Dashboard</h1>
            <p className="text-gray-500 mb-4">
                Welcome, {currnetUser?.username || "Loading..."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">

                <div className="overflow-hidden shadow-md">
                    <div className="px-6 py-4 dark:bg-gray-800 dark:border-gray-600 bg-white border-b dark:text-gray-100 text-gray-700 text-black border-gray-200 font-bold uppercase">
                        Last 10 Attended Lessons
                    </div>

                    <div className="p-6 dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white border-b border-gray-600">
                        <Table aria-label="Example table with dynamic content">
                            <TableHeader>
                                <TableColumn>Date</TableColumn>
                                <TableColumn>Class Name</TableColumn>
                                <TableColumn>Checked In At</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>Jane Doe</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>10/02/2024</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>17:00</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
        
            
                <div className="overflow-hidden shadow-md">
                    <div className="px-6 py-4 dark:bg-gray-800 dark:border-gray-600 bg-white border-b dark:text-gray-100 text-gray-700 text-black border-gray-200 font-bold uppercase">
                        Last 10 Attended Lessons
                    </div>

                    <div className="p-6 dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white border-b border-gray-600">
                        
                    </div>
                </div>

            </div>

        </div>
    </>
  );
}