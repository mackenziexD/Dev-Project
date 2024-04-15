"use client";

import useSWR, { mutate } from "swr";
import { fetcher, deleter } from "@/app/fetcher";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar";
import Link from "next/link";
import { toast } from "react-toastify";
import { DateComponent } from "@/app/components/date";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, getDay, endOfWeek, startOfWeek } from 'date-fns';

export default function allClasses() {
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: AllClasses, error } = useSWR(`/classes`, fetcher);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const firstDayOfWeek = startOfWeek(firstDayOfMonth);
  const lastDayOfWeek = endOfWeek(lastDayOfMonth);
  const days = eachDayOfInterval({ start: firstDayOfWeek, end: lastDayOfWeek });

  function getTimefromDate(date) {
    return format(new Date(date), 'HH:mm');
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <>
        <Sidebar />
        <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72 h-auto">
          <div className="flex justify-between items-center p-4">
            <button onClick={handlePrevMonth} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
              Previous
            </button>
            <span className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={handleNextMonth} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
              Next
            </button>
          </div>

          <div className="text-xs leading-6 text-gray-700 dark:text-slate-400 lg:flex-auto">
            <div className="grid grid-cols-5 grid-rows-6 gap-px">
              {days.map((day, index) => {
                const dayClasses = AllClasses?.results.filter(
                  (cls) => format(new Date(cls.schedule), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                );

                return (
                  <div key={index} className={`p-3 bg-gray-50 dark:bg-gray-800 relative`}>
                    <time dateTime={format(day, 'yyyy-MM-dd')} className={`
                    ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'bg-blue-700 dark:bg-gray-700 rounded-full p-2 pl-2.5 pr-2.5' : 'text-gray-300'}
                    ${format(day, 'MM') !== format(currentMonth, 'MM') ? '' : 'dark:text-slate-400'}
                    `}>
                      {format(day, 'd')}
                    </time>
                    <ol className="mt-1">
                      {dayClasses?.map((cls) => (
                        <li key={cls.id}>
                          <a href="#" className="mt-1 block truncate text-white hover:text-gray-400 rounded-full bg-yellow-40 dark:bg-gray-900 pl-2">
                            ({getTimefromDate(cls.schedule)}) {cls.course_name} - {cls.teacher}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

    </>
  );
}