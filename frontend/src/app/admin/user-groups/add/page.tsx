"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Sidebar from "../../../components/sidebar";
import Link from "next/link";

export default function userGroupsAdd() {

  return (
    <>
            <Sidebar />
                <div className="w-full pt-10 px-4 sm:px-6 md:px-8 lg:ps-72">
                    <h1 className="text-2xl font-bold dark:text-white text-black">
                        Create A New User Group
                    </h1>

                    <div className="mt-4 flex flex-col dark:bg-gray-800 dark:text-gray-200 text-gray-600 bg-white ">
                        <div className="-m-1.5 overflow-x-auto">
                            <div className="p-1.5 min-w-full inline-block align-middle">
                                <div className="overflow-hidden">
                                    asd
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

        </>
  );
}