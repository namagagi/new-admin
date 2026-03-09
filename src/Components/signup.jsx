import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [rePassword, setRePassword] = useState("");

  const navigate = useNavigate("");

  const RoleChange = (e) => {
    setUserID(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === rePassword) {
      try {
        const response = await fetch(
          // "http://localhost:2000/signup", 
          `${backendUrl}/signup`,
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, userID ,contact}),
          credentials: "include",
        });

        if (response.status === 200) {
          setShowModal(true);
        } else {
          console.error("Error signing up");
        }
      } catch (error) {
        console.error("Error signing up:", error);
      }
    } else {
      setPassword("");
      setRePassword("");
      alert("Password is incorrect");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="APP">
      <header className="App-header">
        <h1>Dakshina Kannada</h1>
        <div className="login-container">
          <h2>Signup</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact Number"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
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
            <div onChange={RoleChange}>
              <input type="radio" name="role" value="1" />
              <label>Admin</label>
              <input type="radio" name="role" value="2" />
              <label>Nodal Officer</label>
            </div>
            <button type="submit1">Sign Up</button>
            <Link to={"/"} style={{ color: "black" }}>
              Login
            </Link>
          </form>
        </div>
      </header>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Signup Successful</h2>
            <p>
              A confirmation email has been sent to your email address. Please
              check your email and follow the instructions to verify your
              account.
            </p>
            <button onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
          width: 400px;
          max-width: 80%;
        }
        .modal-content h2 {
          margin-bottom: 10px;
        }
        .modal-content p {
          margin-bottom: 20px;
        }
        .modal-content button {
          padding: 10px 20px;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 5px;
          cursor: pointer;
        }
        .modal-content button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default SignUp;
