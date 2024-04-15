"use client";

import useSWR, { mutate } from "swr";
import { fetcher, putter } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useParams, notFound } from "next/navigation";
import Sidebar from "../../../../components/sidebar";
import Link from "next/link";
import Datepicker from "tailwind-datepicker-react";
import { toast } from "react-toastify";
import { DateComponent } from "@/app/components/date";

const options = {
	autoHide: true,
	todayBtn: true,
	clearBtn: true,
	clearBtnText: "Clear",
	maxDate: new Date("2030-01-01"),
	minDate: new Date(),
	theme: {
		background: "bg-gray-700 dark:bg-gray-800",
		todayBtn: "",
		clearBtn: "",
		icons: "",
		text: "",
		disabledText: "hidden",
		input: "",
		inputIcon: "",
		selected: "",
	},
	icons: {
		prev: () => <span>Previous</span>,
		next: () => <span>Next</span>,
	},
	datepickerClassNames: "top-24",
	defaultDate: new Date(),
	language: "en",
	inputNameProp: "date",
	inputIdProp: "date",
	inputPlaceholderProp: "Select Date",
	inputDateFormatProp: {
		day: "numeric",
		month: "long",
		year: "numeric"
	}
}

export default function LessonEdit() {
  const params = useParams();

  const { data: lesson, error } = useSWR(`/classes/${params.id}`, fetcher);

  const markUserAttended = async (studentId) => {
    try {
      await putter(`/attendancerecords/${studentId}/`, {attended: true, student: studentId, class_instance: params.id});
      mutate(`/classes/${params.id}`);
      toast.success("Student marked as attended", {
        position: "top-right",
        theme: "dark",
      });
    } catch (error) {
      toast.error("Failed to mark student as attended", {
        position: "top-right",
        theme: "dark",
      });
    }
  }

  return (
    <>
      <Sidebar />
      <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72 h-auto">
            <h1 className="text-2xl font-bold dark:text-white text-black">
                View Lesson #{params.id}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white border-b border-gray-600">
                <div className="px-6 py-4 dark:bg-gray-800 dark:border-gray-600 bg-white border-b dark:text-gray-100 text-gray-700 text-black border-gray-200 font-bold uppercase">
                  Students
                </div>
                <div className="px-6 py-4 dark:bg-gray-800 dark:border-gray-600 bg-white border-b dark:text-gray-100 text-gray-700 text-black border-gray-200">
                  <table className="min-w-full divide-y dark:bg-gray-800 divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {lesson?.students_attendance.map((student, index) => (
                        <tr key={index}>
                          <td className="px-6 py-2.5 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">{student.student_name}</td>
                          <td className="px-6 py-2.5 whitespace-nowrap text-end text-sm text-gray-800 dark:text-gray-200">
                              {!student.attended && (
                                <button onClick={() => markUserAttended(student.student_id)} type="button" className="inline-flex items-center gap-x-2 pr-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                                  Mark Attended
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white border-b border-gray-600">
                <div className="px-6 py-4 dark:bg-gray-800 dark:border-gray-600 bg-white border-b dark:text-gray-100 text-gray-700 text-black border-gray-200 font-bold uppercase">
                  Lesson Details
                </div>
                <div className="px-6 py-4 dark:bg-gray-800 dark:border-gray-600 bg-white border-b dark:text-gray-100 text-gray-700 text-black border-gray-200">
                  <div className="flex flex-row">
                    <div className="w-1/2">
                      <p className="font-bold">Course</p>
                      <p>{lesson?.course_name}</p>
                    </div>
                    <div className="w-1/2 mt-1">
                      <p className="font-bold">Teacher</p>
                      <p>{lesson?.teacher}</p>
                    </div>
                  </div>
                  <div className="flex flex-row mt-1">
                    <div className="w-1/2">
                      <p className="font-bold">Start Time</p>
                      <p>{lesson?.schedule}</p>
                    </div>
                  </div>
                  <div className="flex flex-row mt-1">
                    <div className="w-1/2">
                      <p className="font-bold">Students Attending</p>
                      <p>{lesson?.students.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

      </div>

        </>
  );
}