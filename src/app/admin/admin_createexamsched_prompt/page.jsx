"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/navigation";
import NavbarComponent from "../navbar";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Option,
  Select,
  Typography,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CreateExamSchedPrompt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [programs, setPrograms] = useState([]);
  const [isChooseProgramDisabled, setIsChooseProgramDisabled] = useState(true);

  useEffect(() => {
    // Enable Choose Program Select when an institute is selected
    setIsChooseProgramDisabled(selectedInstitute === "");
    // Update programs based on the selected institute
    if (selectedInstitute === "ICSLIS") {
      setPrograms([
        "BACHELOR OF SCIENCE IN COMPUTER SCIENCE",
        "BACHELOR OF SCIENCE IN INFORMATION SYSTEMS",
        "ASSOCIATE IN COMPUTER TECHNOLOGY",
      ]);
    } else if (selectedInstitute === "IBM") {
      setPrograms([
        "BACHELOR OF SCIENCE IN TOURISM MANAGEMENT",
        "BACHELOR OF SCIENCE IN ENTREPRENEURSHIP",
        "BACHELOR OF SCIENCE IN ACCOUNTANCY",
      ]);
    } else if (selectedInstitute === "IEAS") {
      setPrograms([
        "BACHELOR OF PHYSICAL EDUCATION",
        "BACHELOR OF TECHNICAL-VOCATIONAL TEACHER",
        "EDUCATION MAJOR IN FOOD AND SERVICE MANAGEMENT",
        "BACHELOR OF ARTS IN ENGLISH LANGUAGE STUDIES",
        "BACHELOR OF SPECIAL NEEDS EDUCATION",
        "BACHELOR OF SCIENCE IN PSYCHOLOGY",
        "BACHELOR OF SCIENCE IN MATHEMATICS",
      ]);
    }
  }, [selectedInstitute]);

  React.useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);

  function handleInstituteChange(value) {
    setSelectedInstitute(value);
  }

  function handleProgramChange(value) {
    console.log("Selected Program:", value);
    if(value){
      setSelectedProgram(value);
      console.log("Updated Selected Program:", selectedProgram);
    }
  }

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center mb-10 text-black">
            Create Exam Schedule
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <Card style={{ width: "20rem" }}>
            <CardBody>
              <h1 className="text-1xl font-bold mb-3 text-black">
                Choose School Year
              </h1>
              <Input
                color="green"
                label="School Year"
                crossOrigin={undefined}
                required
                size="lg"
              />
              <h1 className="text-1xl font-bold mb-3 text-black">
                Choose Semester
              </h1>
              <Select>
                <Option>1st Semester</Option>
                <Option>2nd Semester</Option>
              </Select>
              <h1 className="text-1xl font-bold mb-3 text-black">
                Choose Exam Type
              </h1>
              <Select>
                <Option>Midterm</Option>
                <Option>Final</Option>
              </Select>
              <h1 className="text-1xl font-bold mb-3 text-black">
                Choose Institute
              </h1>
              <Select
                onChange={(value) => setSelectedInstitute(value)}
                value={selectedInstitute}
              >
                <Option value="">Select Institute</Option>
                <Option value="ICSLIS">ICSLIS</Option>
              </Select>
              <h1 className="text-1xl font-bold mb-3 text-black">
                Choose Program
              </h1>
              <Select
                disabled={isChooseProgramDisabled}
              >
                <Option value="">Select Institute</Option>
                <Option value="BACHELOR OF SCIENCE IN COMPUTER SCIENCE">BACHELOR OF SCIENCE IN COMPUTER SCIENCE</Option>
                <Option value="BACHELOR OF SCIENCE IN INFORMATION SYSTEMS">BACHELOR OF SCIENCE IN INFORMATION SYSTEMS</Option>
                <Option value="ASSOCIATE IN COMPUTER TECHNOLOGY">ASSOCIATE IN COMPUTER TECHNOLOGY</Option>
              </Select>
              <h1 className="text-1xl font-bold mb-3 text-black">
                Choose Year Level
              </h1>
              <Select
              value="">
              <Option value="">Select Institute</Option>
                <Option value="1st Year">1st Year</Option>
                <Option value="2nd Year">2nd Year</Option>
                <Option value="3rd Year">3rd Year</Option>
                <Option value="4th Year">4th Year</Option>
              </Select>
              <Link href="/admin/admin_createexamsched">
              <Button
                className="mt-4 justify-center align-center"
              >
                Start Creating
              </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
