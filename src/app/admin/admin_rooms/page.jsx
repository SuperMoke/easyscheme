"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarComponent from "../navbar";
import {
  Button,
  Card,
  CardBody,
  Typography,
  Input,
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

export default function RoomManagement() {
  const [roomNumber, setRoomNumber] = useState("");
  const [rooms, setRooms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const roomsData = [];
      querySnapshot.forEach((doc) => {
        roomsData.push({ id: doc.id, ...doc.data() });
      });
      setRooms(roomsData);
    };
    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    await addDoc(collection(db, "rooms"), {
      roomNumber: roomNumber,
    });

    const querySnapshot = await getDocs(collection(db, "rooms"));
    const roomsData = [];
    querySnapshot.forEach((doc) => {
      roomsData.push({ id: doc.id, ...doc.data() });
    });
    setRooms(roomsData);

    setRoomNumber("");
  };

  const TABLE_HEAD = ["Room Number", "Action"];

  const handleDeleteRoom = async (id) => {
    await deleteDoc(doc(db, "rooms", id));
    const updatedRooms = rooms.filter((room) => room.id !== id);
    setRooms(updatedRooms);
  };

  const handleEditRoom = async (id) => {
    setIsEditing(true);
    setEditRoomId(id);
    const room = rooms.find((room) => room.id === id);
    setRoomNumber(room.roomNumber);
  };

  const handleUpdateRoom = async () => {
    await updateDoc(doc(db, "rooms", editRoomId), {
      roomNumber: roomNumber,
    });
    setIsEditing(false);
    setEditRoomId(null);

    setRoomNumber("");

    const querySnapshot = await getDocs(collection(db, "rooms"));
    const roomsData = [];
    querySnapshot.forEach((doc) => {
      roomsData.push({ id: doc.id, ...doc.data() });
    });
    setRooms(roomsData);
  };

  const filteredRooms = rooms.filter((room) =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-black">
            Room Management
          </h1>
        </div>
        <div className="flex items-center justify-center mt-4 space-x-8">
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
                {filteredRooms.map(({ id, roomNumber }) => (
                  <tr key={id}>
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {roomNumber}
                      </Typography>
                    </td>
                    <td className="p-4 border-b border-blue-gray-50">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="mr-5"
                        onClick={() => handleEditRoom(id)}
                        style={{ cursor: "pointer" }}
                      ></FontAwesomeIcon>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteRoom(id)}
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
                Add/Edit Room
              </h1>
              <Input
                color="green"
                label="Room Number"
                crossOrigin={undefined}
                required
                size="lg"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
              />
              <Button
                className="mt-4"
                onClick={isEditing ? handleUpdateRoom : handleAddRoom}
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
