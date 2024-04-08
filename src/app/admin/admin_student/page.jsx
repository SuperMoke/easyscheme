"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import NavbarComponent from "../navbar";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
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

export default function StudentEntry() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [section, setSection] = useState("");
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/student");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(db, "students"));
      const studentsData = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentsData);
    };
    fetchStudents();
  }, []);

  const handleAddStudent = async () => {
    await addDoc(collection(db, "students"), {
      firstName: firstName,
      lastName: lastName,
      studentNumber: studentNumber,
      yearLevel: yearLevel,
      section: section,
    });

    const querySnapshot = await getDocs(collection(db, "students"));
    const studentsData = [];
    querySnapshot.forEach((doc) => {
      studentsData.push({ id: doc.id, ...doc.data() });
    });
    setStudents(studentsData);

    setFirstName("");
    setLastName("");
    setStudentNumber("");
    setYearLevel("");
    setSection("");
  };

  const TABLE_HEAD = ["First Name", "Last Name", "Student Number", "Year Level", "Section", "Action"];

  const handleDeleteStudent = async (id) => {
    await deleteDoc(doc(db, "students", id));
    const updatedStudents = students.filter((student) => student.id !== id);
    setStudents(updatedStudents);
  };

  const handleEditStudent = async (id) => {
    setIsEditing(true);
    setEditStudentId(id);
    const student = students.find((student) => student.id === id);
    setFirstName(student.firstName);
    setLastName(student.lastName);
    setStudentNumber(student.studentNumber);
    setYearLevel(student.yearLevel);
    setSection(student.section);
  };

  const handleUpdateStudent = async () => {
    await updateDoc(doc(db, "students", editStudentId), {
      firstName: firstName,
      lastName: lastName,
      studentNumber: studentNumber,
      yearLevel: yearLevel,
      section: section,
    });
    setIsEditing(false);
    setEditStudentId(null);

  
    setFirstName("");
    setLastName("");
    setStudentNumber("");
    setYearLevel("");
    setSection("");

    const querySnapshot = await getDocs(collection(db, "students"));
    const studentsData = [];
    querySnapshot.forEach((doc) => {
      studentsData.push({ id: doc.id, ...doc.data() });
    });
    setStudents(studentsData);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.yearLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.section.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-black">
            Student Entry
          </h1>
        </div>
        <div className="flex items-center justify-center space-x-8">
          <Card style={{ width: "40rem" }}>
            <div className="flex justify-end mb-5">
              <div style={{ width: "200px" }}>
                <Input
                  color="green"
                  label="Search"
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
                {filteredStudents.map(({ id, firstName, lastName, studentNumber, yearLevel, section }) => (
                  <tr key={id}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {firstName}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {lastName}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {studentNumber}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {yearLevel}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {section}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="mr-5"
                        onClick={() => handleEditStudent(id)}
                        style={{ cursor: "pointer" }}
                      ></FontAwesomeIcon>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteStudent(id)}
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
                First Name:
              </h1>
              <Input
                color="green"
                label="Enter First Name"
                crossOrigin={undefined}
                required
                size="lg"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <h1 className="text-1xl font-bold mt-3 mb-2 text-black">
                Last Name:
              </h1>
              <Input
                color="green"
                label="Enter Last Name"
                crossOrigin={undefined}
                required
                size="lg"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <h1 className="text-1xl font-bold mt-3 mb-2 text-black">
                Student Number:
              </h1>
              <Input
                color="green"
                label="Enter Student Number"
                crossOrigin={undefined}
                required
                size="lg"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
              />
              <h1 className="text-1xl font-bold mt-3 mb-2 text-black">
                Year Level:
              </h1>
              <Select
                label="Select Year"
                value={yearLevel}
                onChange={(value) => setYearLevel(value)}
              >
                <Option value="1st Year">1st Year</Option>
                <Option value="2nd Year">2nd Year</Option>
                <Option value="3rd Year">3rd Year</Option>
                <Option value="4th Year">4th Year</Option>
              </Select>
              <h1 className="text-1xl font-bold mt-3 mb-2 text-black">
                Section:
              </h1>
              <Select
                label="Select Section"
                value={section}
                onChange={(value) => setSection(value)}
              >
                <Option value="I301">I301</Option>
                <Option value="I302">I302</Option>
                <Option value="I303">I303</Option>
              </Select>
              <Button
                className="mt-4"
                onClick={isEditing ? handleUpdateStudent : handleAddStudent}
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


