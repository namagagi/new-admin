import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ResetPassword from "../Components/resetPassword";
import { decryptId, encryptId } from "../crypto";
import { useNavigate } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

const ForgotOtpPassword = ({ userId }) => {
  const [otp, setOtp] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [verified, setVerified] = useState(false);
  const [resetStep, setResetStep] = useState(false);
  const [updatedUserId, setUpdatedUserId] = useState(decryptId(userId));
  const navigate = useNavigate();
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  userId = updatedUserId;

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
        const response = await fetch(
          // "http://localhost:2000/verifyForgotOtp",
          `${backendUrl}/verifyForgotOtp`,

          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: encryptId(updatedUserId), otp }),
            credentials: "include",
          });

        const result = await response.json();

        if (response.status === 200) {
          if (updatedUserId === result.userId) {
            handleSnackbar("OTP sent successfully!", "success");
            setResetStep(true);
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
    <>
      {resetStep ? (
        <ResetPassword userId={userId} />
      ) : (
        <>
          <div className="otp-container">
            <h2>Enter OTP</h2>
            <form onSubmit={verifyOtp}>
              <input
                type="text"
                pattern="\d*"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                required
              />
              <button type="submit1" className="loader" disabled={verified}>
                {verified ? "Verifying.." : "Verify OTP"}
              </button>
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
        </>
      )}
    </>
  );
};

export default ForgotOtpPassword;
