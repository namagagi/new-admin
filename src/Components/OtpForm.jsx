import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { decryptId, encryptId } from "../crypto";
const backendUrl = process.env.REACT_APP_BACKEND_URL;



const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

const OtpForm = ({ userId, userName }) => {
  const [otp, setOtp] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    try {
      if (otp.length === 6) {
        setVerified(true);
        userId = encryptId(userId);

        const response = await fetch(
          // "http://localhost:2000/verify-otp", 
          `${backendUrl}/verify-otp`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, otp }),
            credentials: "include",
          });

        const result = await response.json();
        userId = decryptId(userId);

        if (response.status === 200) {
          if (userId === result.userId) {
            handleSnackbar("OTP verified successfully!", "success");
            localStorage.setItem("token", JSON.stringify(result.auth));
            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("userName", JSON.stringify(userName));

            if (result.user === "1") {
              navigate(`/adminDashboard/${result.user}`);
            } else if (result.user === "2") {
              navigate(`/operatorDashboard/${result.user}`);
            }
          } else {
            navigate("/");
            window.location.reload();
          }
        } else if (response.status === 403) {
          handleSnackbar(result.message, "error");
          navigate("/");
          window.location.reload();
        } else {
          handleSnackbar(result.message, "error");
        }
      } else {
        handleSnackbar("OTP must be 6 digits.", "error");
      }
    } catch (error) {
      handleSnackbar(
        "An unexpected error occurred. Please try again.",
        "error"
      );
    } finally {
      setVerified(false);
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter OTP</h2>
      <form onSubmit={verifyOtp}>
        <input
          type="text"
          pattern="\d*"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="OTP"
          maxLength={6}
          required
        />
        <button type="submit1" className="loader" disabled={verified}>{verified ? "Verifying.." : "Verify OTP"}</button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default OtpForm;
