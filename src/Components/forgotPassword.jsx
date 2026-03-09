/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ForgotOtpForm from "../Components/forgotOtpForm";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [verified, setVerified] = useState(false);
  const [userId, setUserId] = useState(null);
  const [otpStep, setOtpStep] = useState(false);

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
      setVerified(true);
      const response = await fetch(
        // "http://localhost:2000/forgotpassword",
        `${backendUrl}/forgotpassword`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const result = await response.json();

      if (response.status === 200) {
        handleSnackbar("OTP sent successfully!", "success");
        setUserId(result.userId);
        setOtpStep(true);
      } else {
        handleSnackbar(result.message, "error");
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
    <div className="APP">
      <header className="App-header">
        <h1>Dakshina Kannada</h1>
        <div className="login-container">
          {otpStep ? (
            <ForgotOtpForm userId={userId} />
          ) : (
            <>
              <div className="otp-container">
                <h2>Verify your email-id</h2>
                <form onSubmit={verifyOtp}>
                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
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
        </div>
      </header>
    </div>
  );
};

export default ForgotPassword;
