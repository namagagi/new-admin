/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { encryptId } from "../crypto";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ResetPassword = ({ userId }) => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState(""); 
  const navigate = useNavigate("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    userId = encryptId(userId);
    if (password === rePassword) {
      try {
        const response = await fetch(
          // "http://localhost:2000/resetpassword", 
          `${backendUrl}/resetpassword`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword: password, userId }),
          credentials: "include",
        });
        const result = await response.json();
        if (response.status === 200) {
          navigate("/");
        } else {
          console.error("Error signing up");
        }
      } catch (error) {
        alert("Not Correct");
        console.error("Error signing up:", error);
      }
    } else {
      setPassword("");
      setRePassword("");
      alert("Password is incorrect");
    }
  };

  return (
    <>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="password"
          value={rePassword}
          placeholder="Re-Type Password"
          onChange={(e) => setRePassword(e.target.value)}
        />
        <button type="submit1">Reset Password</button>
      </form>
    </>
  );
};

export default ResetPassword;
