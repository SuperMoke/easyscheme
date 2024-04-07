"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/navigation";
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

export default function FacultyEntry() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [salutation, setSalutation] = useState("");
  const [facultystatus, setStatus] = useState("");
  const [faculty, setFaculty] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFacultyId, setEditFacultyId] = useState(null);
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
    const fetchFaculty = async () => {
      const querySnapshot = await getDocs(collection(db, "faculty"));
      const facultyData = [];
      querySnapshot.forEach((doc) => {
        facultyData.push({ id: doc.id, ...doc.data() });
      });
      setFaculty(facultyData);
    };
    fetchFaculty();
  }, []);

  const handleAddFaculty = async () => {
    await addDoc(collection(db, "faculty"), {
      firstName: firstName,
      lastName: lastName,
      salutation: salutation,
      facultystatus: facultystatus,
    });
    // After adding the faculty, refetch the faculty
    const querySnapshot = await getDocs(collection(db, "faculty"));
    const facultyData = [];
    querySnapshot.forEach((doc) => {
      facultyData.push({ id: doc.id, ...doc.data() });
    });
    setFaculty(facultyData);
    // Clear input fields
    setFirstName("");
    setLastName("");
    setSalutation("");
    setStatus("");
  };

  const TABLE_HEAD = ["First Name", "Last Name", "Salutation", "Status", "Action"];

  const handleDeleteFaculty = async (id) => {
    await deleteDoc(doc(db, "faculty", id));
    const updatedFaculty = faculty.filter((item) => item.id !== id);
    setFaculty(updatedFaculty);
  };

  const handleEditFaculty = async (id) => {
    setIsEditing(true);
    setEditFacultyId(id);
    const facultyItem = faculty.find((item) => item.id === id);
    setFirstName(facultyItem.firstName);
    setLastName(facultyItem.lastName);
    setSalutation(facultyItem.salutation);
    setStatus(facultyItem.facultystatus);
  };

  const handleUpdateFaculty = async () => {
    await updateDoc(doc(db, "faculty", editFacultyId), {
      firstName: firstName,
      lastName: lastName,
      salutation: salutation,
      facultystatus: facultystatus,
    });
    setIsEditing(false);
    setEditFacultyId(null);
    setFirstName("");
    setLastName("");
    setSalutation("");
    setStatus("");
    // Refetch faculty after updating
    const querySnapshot = await getDocs(collection(db, "faculty"));
    const facultyData = [];
    querySnapshot.forEach((doc) => {
      facultyData.push({ id: doc.id, ...doc.data() });
    });
    setFaculty(facultyData);
  };

  const filteredFaculty = faculty.filter(
    (item) =>
      item.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.salutation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.facultystatus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-black">
            Faculty Entry
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
                {filteredFaculty.map(({ id, firstName, lastName, salutation, facultystatus }) => (
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
                        {salutation}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {facultystatus}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="mr-5"
                        onClick={() => handleEditFaculty(id)}
                        style={{ cursor: "pointer" }}
                      ></FontAwesomeIcon>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteFaculty(id)}
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
                Salutation:
              </h1>
              <Select
                label="Select Salutation"
                value={salutation}
                onChange={(value) => setSalutation(value)}
              >
                <Option value="Mr">Mr</Option>
                <Option value="Ms">Ms</Option>
              </Select>
              <h1 className="text-1xl font-bold mt-3 mb-2 text-black">
                Faculty Status:
              </h1>
              <Select
                label="Select Status"
                value={facultystatus}
                onChange={(value) => setStatus(value)}
              >
                <Option value="Part Time">Part Time</Option>
                <Option value="Full Time">Full Time</Option>
              </Select>
              <Button
                className="mt-4"
                onClick={isEditing ? handleUpdateFaculty : handleAddFaculty}
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

