"use client";

import useSWR, { mutate } from "swr";
import { fetcher, poster } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/sidebar";
import Link from "next/link";
import Datepicker from "tailwind-datepicker-react";
import { toast } from "react-toastify";

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

export default function LessonAdd() {
  const router = useRouter();
  const [show, setShow] = useState<boolean>(false);
  const [selectedTime, setSelectedTime] = useState('');

  const changeTime = (e) => {
    setSelectedTime(e.target.value);
  };

  const handleChange = (selectedDate: Date) => {
    console.log(selectedDate);
  };
  const handleClose = (state: boolean) => {
    setShow(state);
  };
  const [selectedGroup, setSelectedGroup] = useState('');
  const { data: courses, error: groupsError } = useSWR(`/courses`, fetcher);
  const { data: people, error: peopleError } = useSWR(`/students`, fetcher);
  const { data: students, error: studentsError } = useSWR(`/students`, fetcher);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formElement = e.target;
    const formData = new FormData(formElement);
    
    const dateTime = new Date(
      new Date(formData.get('date')).toISOString().split('T')[0]
      + 'T' + selectedTime
    ).toISOString(); 
    console.log(dateTime);

    const jsonData = {
      course: formData.get('courses'), 
      students: Array.from(formElement.querySelectorAll('[name="students"] option:checked')).map(opt => opt.value),
      schedule: dateTime, 
    };
  

    try {
      await poster(`/classes/`, jsonData);
      router.push("/staff/lessons");
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
            Create A New Lesson
          </h1>

          <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white ">
              <div className="-m-1.5">
                  <div className="p-1.5 min-w-full inline-block align-middle">
                      <div >
                        <form onSubmit={handleSubmit}>
                          <div className="-m-1.5shadow sm:rounded-md">
                            <div className="px-4 py-5 bg-white dark:bg-gray-800 sm:p-6">
                              <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Courses
                                </label>
                                <select 
                                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-black dark:bg-gray-700 dark:text-white"
                                  value={selectedGroup}
                                  name="courses"
                                  onChange={(e) => setSelectedGroup(e.target.value)}
                                >
                                  <option value="">Select a course</option>
                                  {courses?.results.map((course) => (
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-span-6 sm:col-span-3 mt-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Schedule
                                </label>
                                <Datepicker name="date" options={options} onChange={handleChange} show={show} setShow={handleClose} />
                                <div className="relative">
                                  <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                          <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
                                      </svg>
                                  </div>
                                  <input type="time" id="time" onChange={changeTime} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={selectedTime} required />
                                </div>
                              </div>
                              <div className="col-span-6 sm:col-span-3 mt-4">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                  Students
                                </label>
                                <select 
                                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 text-black dark:bg-gray-700 dark:text-white"
                                  name="students"
                                  multiple
                                >
                                  {students?.results.map((student) => (
                                    <option key={student.id} value={student.id} className="dark:bg-gray-700 p-2">{student.first_name} {student.last_name}</option>
                                  ))}
                                </select>
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