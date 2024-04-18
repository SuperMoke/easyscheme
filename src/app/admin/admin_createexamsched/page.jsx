"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import { useRouter } from "next/navigation";
import NavbarComponent from "../navbar";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Select,
  Option,
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
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function CreateExamSched() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [examDate, setExamDate] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [proctor, setProctor] = useState("");
  const [exams, setExams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editExamId, setEditExamId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [courseCodes, setCourseCodes] = useState([]);
  const [roomdata, setRoomData] = useState([]);
  const [proctordata, setProctorData] = useState([]);
  const router = useRouter();
  const [sectionValue, setSectionValue] = useState("");
  const [schoolYearValue, setSchoolYearValue] = useState("");
  const [semesterValue, setSemesterValue] = useState("");
  const [examTypeValue, setExamTypeValue] = useState("");
  const [instituteValue, setInstituteValue] = useState("");
  const [programValue, setProgramValue] = useState("");
  const [yearLevelValue, setYearLevelValue] = useState("");

  useEffect(() => {
    const fetchCourseCodes = async () => {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const codes = querySnapshot.docs.map((doc) => doc.data().courseCode);
      setCourseCodes(codes);
    };
    fetchCourseCodes();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const roomData = querySnapshot.docs.map((doc) => doc.data().roomNumber);
      setRoomData(roomData);
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchProctor = async () => {
      const querySnapshot = await getDocs(collection(db, "faculty"));
      const proctorNames = querySnapshot.docs.map((doc) => {
        const firstName = doc.data().firstName;
        const lastName = doc.data().lastName;
        return `${firstName} ${lastName}`;
      });
      setProctorData(proctorNames);
    };
    fetchProctor();
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      const querySnapshot = await getDocs(collection(db, "exams"));
      const examsData = [];
      querySnapshot.forEach((doc) => {
        examsData.push({ id: doc.id, ...doc.data() });
      });
      setExams(examsData);
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get("section");
    const schoolYear = params.get("schoolYear");
    const semester = params.get("semester");
    const examType = params.get("examType");
    const institute = params.get("institute");
    const program = params.get("program");
    const yearLevel = params.get("yearLevel");
    fetchData(
      section,
      schoolYear,
      semester,
      examType,
      institute,
      program,
      yearLevel
    );
  }, []);

  const fetchData = (
    section,
    schoolYear,
    semester,
    examType,
    institute,
    program,
    yearLevel
  ) => {
    setSectionValue(section);
    setSchoolYearValue(schoolYear);
    setSemesterValue(semester);
    setExamTypeValue(examType);
    setInstituteValue(institute);
    setProgramValue(program);
    setYearLevelValue(yearLevel);
  };

  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(":");
    let formattedTime = "";
    let period = "AM";
    if (hours > 12) {
      formattedTime = `${hours - 12}:${minutes}`;
      period = "PM";
    } else if (hours === "12") {
      formattedTime = `${hours}:${minutes}`;
      period = "PM";
    } else if (hours === "00") {
      formattedTime = `12:${minutes}`;
    } else {
      formattedTime = `${hours}:${minutes}`;
    }
    return `${formattedTime} ${period}`;
  };
  const handleAddExam = async () => {
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, where("courseCode", "==", courseCode));
    const courseSnapshot = await getDocs(q);

    let selectedCourseTitle = "";
    courseSnapshot.forEach((doc) => {
      selectedCourseTitle = doc.data().courseTitle;
    });

    await addDoc(collection(db, "exams"), {
      courseTitle: selectedCourseTitle,
      courseCode: courseCode,
      examDate: examDate,
      startTime: startTime,
      endTime: endTime,
      room: room,
      proctor: proctor,
    });
    const querySnapshot = await getDocs(collection(db, "exams"));
    const examsData = [];
    querySnapshot.forEach((doc) => {
      examsData.push({ id: doc.id, ...doc.data() });
    });
    setExams(examsData);
    setCourseTitle("");
    setCourseCode("");
    setExamDate("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setProctor("");
  };

  const TABLE_HEAD = [
    "Course Code",
    "Course Title",
    "Exam Date",
    "Start Time",
    "End Time",
    "Room",
    "Proctor",
    "Action",
  ];

  const handleDeleteExam = async (id) => {
    await deleteDoc(doc(db, "exams", id));
    const updatedExams = exams.filter((exam) => exam.id !== id);
    setExams(updatedExams);
  };

  const handleEditExam = async (id) => {
    setIsEditing(true);
    setEditExamId(id);
    const exam = exams.find((exam) => exam.id === id);
    setCourseCode(exam.courseCode);
    const formattedExamDate = exam.examDate.toDate();
    setExamDate(formattedExamDate);
    setStartTime(exam.startTime);
    setEndTime(exam.endTime);
    setRoom(exam.room);
    setProctor(exam.proctor);
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, where("courseCode", "==", exam.courseCode));
    const courseSnapshot = await getDocs(q);
    let selectedCourseTitle = "";
    courseSnapshot.forEach((doc) => {
      selectedCourseTitle = doc.data().courseTitle;
    });

    setCourseTitle(selectedCourseTitle);
  };

  const handleUpdateExam = async () => {
    await updateDoc(doc(db, "exams", editExamId), {
      courseTitle: courseTitle,
      courseCode: courseCode,
      examDate: examDate,
      startTime: startTime,
      endTime: endTime,
      room: room,
      proctor: proctor,
    });
    setIsEditing(false);
    setEditExamId(null);
    setCourseTitle("");
    setCourseCode("");
    setExamDate("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setProctor("");
    const querySnapshot = await getDocs(collection(db, "exams"));
    const examsData = [];
    querySnapshot.forEach((doc) => {
      examsData.push({ id: doc.id, ...doc.data() });
    });
    setExams(examsData);
  };

  const handleSave = async () => {
    const examSchedule = {
      examType: examTypeValue,
      semester: semesterValue,
      schoolYear: schoolYearValue,
      yearLevel: yearLevelValue,
      program: programValue,
      section: sectionValue,
      exams: exams,
    };

    try {
      await addDoc(collection(db, "examSchedules"), examSchedule);
      console.log("Exam schedule saved successfully!");
      setExams([]);
      const examsRef = collection(db, "exams");
      const querySnapshot = await getDocs(examsRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    } catch (error) {
      console.error("Error saving exam schedule:", error);
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-black">
            Exam Schedule
          </h1>
        </div>
        <div className="flex items-center justify-center space-x-8">
          <Card style={{ width: "80rem" }}>
            <div className="flex justify-center  mb-5">
              <div>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {examTypeValue} Examination Schedule
                </h1>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {semesterValue} {schoolYearValue}
                </h1>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {yearLevelValue} {programValue} Students
                </h1>
                <h1 className="text-1xl text-center font-bold mt-3 mb-2 text-black">
                  {sectionValue}
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
                          new Date(
                            examDate.seconds * 1000
                          ).toLocaleDateString()}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {startTime}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {endTime}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {room}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        {proctor}
                      </td>
                      <td className="p-4 border-b border-blue-gray-50">
                        <FontAwesomeIcon
                          icon={faPenSquare}
                          className="mr-5"
                          onClick={() => handleEditExam(id)}
                          style={{ cursor: "pointer" }}
                        ></FontAwesomeIcon>
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => handleDeleteExam(id)}
                          style={{ cursor: "pointer" }}
                        ></FontAwesomeIcon>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-5">
              <Button style={{ width: "10rem" }} onClick={handleSave}>
                Save
              </Button>
            </div>
          </Card>
          <Card style={{ width: "20rem" }}>
            <CardBody>
              <h1 className="text-1xl font-bold mt-3 mb-2 text-black">
                Exam Details:
              </h1>
              <h1 className="text-1xl  mt-3 mb-2 text-black">Course Code:</h1>
              <Select
                color="green"
                label="Course Code"
                required
                size="lg"
                value={courseCodes}
                onChange={(value) => setCourseCode(value)}
              >
                {courseCodes.map((code, index) => (
                  <Option key={index} value={code}>
                    {code}
                  </Option>
                ))}
              </Select>
              <h1 className="text-1xl  mt-3 mb-2 text-black">Date:</h1>
              <DatePicker
                selected={examDate}
                onChange={(date) => setExamDate(date)}
                dateFormat="MM/dd/yyyy"
                className="border-green-500"
              />

              <h1 className="text-1xl  mt-3 mb-2 text-black">Start Time:</h1>
              <TimePicker
                value={startTime}
                onChange={(time) => setStartTime(convertTo12HourFormat(time))}
                className="border-green-500"
                maxDetail="minute"
                minTime="07:00"
                maxTime="22:00"
              />
              <h1 className="text-1xl  mt-3 mb-2 text-black">End Time:</h1>
              <TimePicker
                value={endTime}
                onChange={(time) => setEndTime(convertTo12HourFormat(time))}
                amPmAriaLabel="Select AM/PM"
                className="border-green-500"
                maxDetail="minute"
                minTime="07:00"
                maxTime="22:00"
              />
              <h1 className="text-1xl  mt-3 mb-2 text-black">Room:</h1>
              <Select
                color="green"
                label="Room"
                required
                size="lg"
                value={roomdata}
                onChange={(value) => setRoom(value)}
              >
                {roomdata.map((code, index) => (
                  <Option key={index} value={code}>
                    {code}
                  </Option>
                ))}
              </Select>
              <h1 className="text-1xl  mt-3 mb-2 text-black">Proctor:</h1>
              <Select
                color="green"
                label="Proctor"
                required
                size="lg"
                value={proctordata}
                onChange={(value) => setProctor(value)}
              >
                {proctordata.map((code, index) => (
                  <Option key={index} value={code}>
                    {code}
                  </Option>
                ))}
              </Select>
              <Button
                className="mt-4"
                onClick={isEditing ? handleUpdateExam : handleAddExam}
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
