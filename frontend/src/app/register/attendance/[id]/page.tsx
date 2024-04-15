"use client";

import useSWR, { mutate } from "swr";
import { fetcher, putter } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function registerAttendance() {
  const params = useParams();

    const { data: classes, error } = useSWR(`/classes/${params.id}`, fetcher);
    const { data: me, errorMe } = useSWR(`/me`, fetcher);
    const { data: attendanceRecords } = useSWR(`/attendancerecords`, fetcher);

    if(error){
      // update the UI to show an error
      
    }

    useEffect(() => {
      if (classes && me && attendanceRecords) {
        async function fetchAndUpdateAttendance() {

          const userAttendance = attendanceRecords.results.find(record => record.student === me.id);
          if (userAttendance) {
            const attednace = await putter(`/attendancerecords/${userAttendance.id}/`, {attended: true, student: me.id, class_instance: classes.id});
            if (attednace) {
              console.log('Attendance taken');
            }
          }
        }
    
        fetchAndUpdateAttendance();
      }
    }, [classes, me, attendanceRecords]);

  return (
    <>
        <div className="w-full pt-10 px-4 sm:px-6 md:px-8 h-screen flex flex-col items-center justify-center">

            <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white">
                <div className="-m-1.5">
                    <div className="p-1.5 m-4 inline-block align-middle text-center mt-4">
                      {!error && !errorMe && classes && me && attendanceRecords && (
                        <>
                          <FontAwesomeIcon icon={faCheck} className='flex-shrink-0 w-20 h-20 bg-lime-600 p-2 rounded-full' style={{width: "1rem", height: "1rem"}} />
                          <h1 className="text-2xl font-bold dark:text-white text-black mt-4">
                              Attendance taken for {classes?.course_name}
                          </h1>
                          <p className="text-lg dark:text-gray-200 text-gray-600 mb-2 mt-2">
                            You can may now close this window.
                          </p>
                        </>
                      )}

                      {error && (
                        <>
                          <FontAwesomeIcon icon={faXmark} className='flex-shrink-0 w-20 h-20 bg-red-700 p-2 rounded-full' style={{width: "1rem", height: "1rem"}} />
                          <h1 className="text-2xl font-bold dark:text-white text-black mt-4">
                              Whoops...
                          </h1>
                          <p className="text-lg dark:text-gray-200 text-gray-600 mb-2 mt-2">
                            Could not find a class your are registered matching this class your are trying to mark your attendance for.
                          </p>
                        </>
                      )}
                    </div>
                </div>
            </div>

        </div>

        </>
  );
}