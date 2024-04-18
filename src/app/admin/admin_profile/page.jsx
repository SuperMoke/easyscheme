"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavbarComponent from "../navbar";
import { Alert, Button, Card, CardBody, Input } from "@material-tailwind/react";
import { auth } from "../../firebase";
import { useAuth } from "next-auth/react";
import {
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { EmailAuthProvider } from "firebase/auth";

export default function AdminProfile() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserEmail(user.email);
      }
    });
  }, []);

  const handleSaveChanges = async () => {
    setIsError(false);
    setIsSuccess(false);
    if (newPassword !== confirmPassword) {
      setIsError(true);
      setErrorMessage("New password and confirm password do not match.");
      return;
    }
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const Emailcredential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );
      await reauthenticateWithCredential(user, Emailcredential);
      await updatePassword(user, newPassword).then(() => {
        setIsSuccess(true);
        setSuccessMessage("Password changed successfully");
        setIsError(false);
        setNewPassword("");
        setConfirmPassword("");
        setOldPassword("");
      });
    } catch (error) {
      console.error("Error changing password:", error);
      setIsError(true);
      setIsSuccess(false);
      setErrorMessage("An error occurred while changing password");
    }
  };

  return (
    <>
      <NavbarComponent />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-center text-black">
            Admin Profile
          </h1>
        </div>
        <div className="flex items-center justify-center space-x-8">
          <Card style={{ width: "50rem" }}>
            <CardBody>
              {isError && (
                <Alert variant="outlined" color="red">
                  {errorMessage}
                </Alert>
              )}
              {isSuccess && (
                <Alert variant="outlined" color="green">
                  {successMessage}
                </Alert>
              )}
              <h1 className=" text-black mt-2 mb-3">Update Account Details</h1>
              <h1 className="text-1xl font-bold mb-3 text-black">UserName:</h1>
              <Input
                color="green"
                label="Enter Username"
                crossOrigin={undefined}
                required
                size="lg"
                value={userEmail}
                disabled={true}
              />
              <h1 className="text-1xl font-bold mb-3 mt-2 text-black">
                Change Password:
              </h1>
              <Input
                color="green"
                label="Type new password"
                crossOrigin={undefined}
                required
                size="lg"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <h1 className="text-1xl font-bold mb-3 mt-2 text-black">
                Confirm Password:
              </h1>
              <Input
                color="green"
                label="Confirm new password"
                crossOrigin={undefined}
                required
                size="lg"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <h1 className="text-1xl font-bold mb-3 mt-2 text-black">
                Enter Old Password to save changes:
              </h1>
              <Input
                color="green"
                label="Type old password"
                crossOrigin={undefined}
                required
                size="lg"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Button className="mt-4" onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}
