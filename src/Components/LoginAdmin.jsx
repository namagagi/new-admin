import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "./Nav";
import AdminDashboard from "./AdminDashboard";

const LoginAdmin = () => {
  const userRole = JSON.parse(localStorage.getItem("user"));
  const params = useParams();
  const navigate = useNavigate();

  

  useEffect(() => {
    // Check if the user role does not match the id from params, then navigate to '/'
    if (userRole !== params.id) {
        navigate("/");
        localStorage.clear();
    }
  }, [userRole, params.id, navigate]);

  return (
    <React.Fragment>
      <Nav>
      <AdminDashboard />
      </Nav>
    </React.Fragment>
  );
};

export default LoginAdmin;
