import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../Styles/LoginForm.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import OtpForm from "../Components/OtpForm";
import { decryptId } from "../crypto";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={5} ref={ref} variant="filled" {...props} />;
});

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(false);
  let userID = role;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [userId, setUserId] = useState(null);
  const [otpStep, setOtpStep] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");

  const RoleChange = (event) => {
    setRole(event.target.value);
  };

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

  const loggedIn = async (event) => {
    event.preventDefault();
    if (!email || !password || !role) {
      setError(true);
      handleSnackbar("Please provide all required fields.", "error");
      return false;
    }

    try {
      setLoading(true);
      
      const response = await fetch(
        // "http://localhost:2000/login", 
        `${backendUrl}/login`,
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, userID }),
        credentials: "include",
      });
      let result = await response.json();

      if (response.status === 200) {
        handleSnackbar("OTP sent successfully!", "success");
        setUserId(decryptId(result.userId));
        setUserName(result.userName);
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
      setLoading(false);
    }
  };


  return (
    <div className="APP">
      <header className="App-header">
        <img src="/favicon.ico" alt="" style={{height:"100px"}}/>
        <h1>Dakshina Kannada</h1>
        <div className="login-container">
          {otpStep ? (
            <OtpForm userId={userId} userName={userName}/>
          ) : (
            <>
              <h2>Login</h2>
              <form>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    name="email"
                    required
                  />
                  {error && !email && (
                    <p className="error">Please specify your email</p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  {error && !password && (
                    <p className="error">Please specify your password</p>
                  )}
                </div>
                <div onChange={RoleChange}>
                  <input type="radio" name="role" value="1" id="admin" />
                  <label htmlFor="admin" style={{ cursor: "pointer" }}>
                    Admin
                  </label>
                  <input type="radio" name="role" value="2" id="operator" />
                  <label htmlFor="operator" style={{ cursor: "pointer" }}>
                    Nodal Officer
                  </label>
                </div>
                {error && !role && (
                  <p className="error" style={{ textAlign: "center" }}>
                    Please specify your role
                  </p>
                )}
                <Link to={"/forgotPassword"} style={{ color: "black" }}>
                  Forgot Password
                </Link>
                <button
                  type="submit1"
                  className="loader"
                  onClick={loggedIn}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
                <Link to={"/signup"} style={{ color: "black" }}>
                  Signup
                </Link>
              </form>
            </>
          )}
        </div>
      </header>
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

export default LoginForm;

