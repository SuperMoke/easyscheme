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
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CourseEntry() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editCourseId, setEditCourseId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();


  React.useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
    }
  }, [session, status, router]);


  useEffect(() => {
    const fetchCourses = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const coursesData = [];
      querySnapshot.forEach((doc) => {
        coursesData.push({ id: doc.id, ...doc.data() });
      });
      setCourses(coursesData);
    };
    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    await addDoc(collection(db, "courses"), {
      courseTitle: courseTitle,
      courseCode: courseCode,
    });
    // After adding the course, refetch the courses
    const querySnapshot = await getDocs(collection(db, "courses"));
    const coursesData = [];
    querySnapshot.forEach((doc) => {
      coursesData.push({ id: doc.id, ...doc.data() });
    });
    setCourses(coursesData);
    // Clear input fields
    setCourseTitle("");
    setCourseCode("");
  };

  const TABLE_HEAD = ["Course Code", "Course Title", "Action"];

  const handleDeleteCourse = async (id) => {
    await deleteDoc(doc(db, "courses", id));
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
  };

  const handleEditCourse = async (id) => {
    setIsEditing(true);
    setEditCourseId(id);
    const course = courses.find((course) => course.id === id);
    setCourseTitle(course.courseTitle);
    setCourseCode(course.courseCode);
  };

  const handleUpdateCourse = async () => {
    await updateDoc(doc(db, "courses", editCourseId), {
      courseTitle: courseTitle,
      courseCode: courseCode,
    });
    setIsEditing(false);
    setEditCourseId(null);
    setCourseTitle("");
    setCourseCode("");
    // Refetch courses after updating
    const querySnapshot = await getDocs(collection(db, "courses"));
    const coursesData = [];
    querySnapshot.forEach((doc) => {
      coursesData.push({ id: doc.id, ...doc.data() });
    });
    setCourses(coursesData);
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-black">
            Course Entry
          </h1>
        </div>
        <div className="flex items-center justify-center space-x-8">
          <Card style={{ width: "40rem" }}>
            <div className="flex justify-end mb-5">
              <div style={{ width: "200px" }}>
                <Input
                  color="green"
                  label="Enter Course Title"
                  crossOrigin={undefined}
                  required
                  size="lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                {filteredCourses.map(({ id, courseTitle, courseCode }) => (
                  <tr key={id}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {courseCode}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {courseTitle}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="mr-5"
                        onClick={() => handleEditCourse(id)}
                        style={{ cursor: "pointer" }}
                      ></FontAwesomeIcon>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteCourse(id)}
                        style={{ cursor: "pointer" }}
                      ></FontAwesomeIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <Card style={{ width: "20rem" }}>
            <CardBody>
              <h1 className="text-1xl font-bold mb-3 text-black">
                Course Title:
              </h1>
              <Input
                color="green"
                label="Enter Course Title"
                crossOrigin={undefined}
                required
                size="lg"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
              />
              <h1 className="text-1xl font-bold mt-3 mb-2 text-black">
                Course Code:
              </h1>
              <Input
                color="green"
                label="Enter Course Code"
                crossOrigin={undefined}
                required
                size="lg"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
              />
              <Button
                className="mt-4"
                onClick={isEditing ? handleUpdateCourse : handleAddCourse}
              >
                {isEditing ? "Update" : "Add"}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
