"use client";
import React, { useEffect } from "react";
import NavbarComponent from "./navbar";
import { Button } from "@material-tailwind/react";
import Link from "next/link";

export default function Admin() {
  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center mb-10 text-black">
            Admin Page
          </h1>
        </div>
        <div className="flex items-center justify-center  space-x-8">
          <Link href="admin/admin_createexamsched_prompt">
            <Button>Create Exam Schedule/s</Button>
          </Link>
          <Link href="admin/admin_viewsavedsched">
            <Button>View Published Exam Schedules/s</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
