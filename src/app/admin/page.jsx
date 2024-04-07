"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/navigation";
import NavbarComponent from "./navbar";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function admin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);

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
          <Button>View Published Exam Schedules/s</Button>
        </div>
      </div>
    </>
  );
}
