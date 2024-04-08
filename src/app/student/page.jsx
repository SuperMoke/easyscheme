"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavbarComponent from "./navbar";
import { Card, Typography } from "@material-tailwind/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function ViewSavedSched() {
  const [exams, setExams] = useState([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {

      try {
        const examSchedulesRef = collection(db, "examSchedules");
        const querySnapshot = await getDocs(examSchedulesRef);
        const examSchedulesData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const examsWithMeta = data.exams.map((exam) => ({
            ...exam,
            examType: data.examType,
            semester: data.semester,
            schoolYear: data.schoolYear,
            yearLevel: data.yearLevel,
            program: data.program,
            section: data.section,
          }));
          examSchedulesData.push({ id: doc.id, exams: examsWithMeta });
        });
        setExams(examSchedulesData);
      } catch (error) {
        console.error("Error fetching exam schedules:", error);
      }
    };

    fetchData();
  }, [session, status, router]);

  const renderExams = () => {
    const TABLE_HEAD = [
      "Course Code",
      "Course Title",
      "Exam Date",
      "Start Time",
      "End Time",
      "Room",
      "Proctor"
    ];


    return exams.map(({ id, exams }) => (
      <div key={id}>
        <div className="mb-10">
          <Card style={{ width: "80rem" }}>
            <div className="flex justify-center item mb-5">
              <div>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {exams[0].examType} Examination Schedule
                </h1>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {exams[0].semester} {exams[0].schoolYear}
                </h1>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {exams[0].yearLevel} {exams[0].program} Students
                </h1>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {exams[0].section}
                </h1>
              </div>
            </div>
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th
                      key={head}
                      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {exams.map(
                  ({
                    id,
                    courseCode,
                    courseTitle,
                    examDate,
                    startTime,
                    endTime,
                    room,
                    proctor,
                  }) => (
                    <tr key={id}>
                      <td className="p-4 border-b border-blue-gray-50">
                        {courseCode}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {courseTitle}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {examDate &&
                          new Date(examDate.seconds * 1000).toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {startTime}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {endTime}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">{room}</td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {proctor}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    ));
  };

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-5 text-center text-black">
            Exam Schedule
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center">
          {renderExams()}
        </div>
      </div>
    </>
  );
}
