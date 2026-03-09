import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "./Nav";
import OperatorDashboard from "./OperatorDashboard";

const LoginOperator = () => {
  const userRole = JSON.parse(localStorage.getItem("user"));
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole !== params.id) {
        navigate("/");
        localStorage.clear();
    }
  }, [userRole, params.id, navigate]);

  return (
    <React.Fragment>
      <Nav>
      <OperatorDashboard />
      </Nav>
    </React.Fragment>
  );
};

export default LoginOperator;
