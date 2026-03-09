
import React, { useState, useEffect } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../Styles/SideBar.css";

const Sidebar = ({ children }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  let ID = JSON.parse(localStorage.getItem("user"));
  const userName = JSON.parse(localStorage.getItem("userName"));
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  

  const menuItemStyle = {
    transition: "background-color 0.3s",
    borderRadius: "10px",
    padding: "10px 20px",
    textDecoration: "none",
    color: "#fff",
    boxSizing: "border-box",
    margin: "10px 0",
  };

  const menuItemHoverStyle = {
    backgroundColor: "lightblue",
  };

  const menuItemActiveStyle = {
    backgroundColor: "lightblue",
  };

  const getMenuItemStyle = (index) => {
    const baseStyle = { ...menuItemStyle };
    if (activeIndex === index) {
      return { ...baseStyle, ...menuItemActiveStyle };
    }
    if (hoverIndex === index) {
      return { ...baseStyle, ...menuItemHoverStyle };
    }
    return baseStyle;
  };

  useEffect(() => {
    if (location.pathname === `/operatorDashboard/${ID}` || location.pathname === `/adminDashboard/${ID}`) {
      setActiveIndex(1);
    } else if (location.pathname === "/addProject") {
      setActiveIndex(2);
    } else if (location.pathname === "/viewProjects") {
      setActiveIndex(3);
    } else if (location.pathname === "/donatorList") {
      setActiveIndex(4);
    }
  }, [location, ID]);

  const logout = async () => {
    await fetch(
      `${backendUrl}/logout`,
      {
        method: "POST",
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`,
        },
        credentials: "include",
      }
    );
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar for larger screens */}
        <div className="col-auto col-md-3 sidebar col-xl-2 px-sm-2 px-0 d-none d-md-block" style={{ backgroundColor: "#1995AD" }}>
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <h4 className="text-decoration-none text-center" style={{ color: "inherit", marginBottom: "30px", padding: "20px", width: "100%" }}>
              {ID === "1" ? (
                <span className="fs-5 d-none d-sm-inline" style={{ fontWeight: "bold" }}>Admin Panel <br /><i> {userName} </i></span>
              ) : (
                <span className="fs-5 d-none d-sm-inline" style={{ fontWeight: "bold" }}>Nodal Officer <br /> Panel <br /><i> {userName}</i> </span>
              )}
            </h4>
            <hr />

            <NavLink
              exact
              to={ID === "1" ? `/adminDashboard/${ID}` : `/operatorDashboard/${ID}`}
              className="nav-link px-3"  
              onClick={() => setActiveIndex(1)}
              style={getMenuItemStyle(1)}
              onMouseEnter={() => setHoverIndex(1)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <i className="fs-3 bi-house"></i>
              <span className="ms-3 d-none d-sm-inline">Dashboard</span>
            </NavLink>

            <NavLink
              exact
              to="/addProject"
              className="nav-link px-3"
              onClick={() => setActiveIndex(2)}
              style={getMenuItemStyle(2)}
              onMouseEnter={() => setHoverIndex(2)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <i className="fs-3 bi-bar-chart"></i>
              <span className="ms-3 d-none d-sm-inline">Add School Details</span>
            </NavLink>

            <NavLink
              exact
              to="/viewProjects"
              className="nav-link px-3"
              onClick={() => setActiveIndex(3)}
              style={getMenuItemStyle(3)}
              onMouseEnter={() => setHoverIndex(3)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <i className="fs-3 bi-table"></i>
              <span className="ms-3 d-none d-sm-inline">View School Details</span>
            </NavLink>

            <NavLink
              exact
              to="/donatorList"
              className="nav-link px-3"
              onClick={() => setActiveIndex(4)}
              style={getMenuItemStyle(4)}
              onMouseEnter={() => setHoverIndex(4)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <i className="fs-3 bi-people"></i>
              <span className="ms-3 d-none d-sm-inline">Donator List</span>
            </NavLink>


            <hr />
            <div className="mt-auto w-100">  {/* Added w-100 to make it align like others */}
              <NavLink
                exact
                to="#"
                className="nav-link px-3"  // Consistent padding with other items
                onClick={logout}
                style={menuItemStyle}
                onMouseEnter={() => setHoverIndex(5)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <i className="fs-3 bi-box-arrow-right"></i>
                <span className="ms-3 d-none d-sm-inline">Sign out</span>
              </NavLink>
            </div>

          </div>
        </div>

        {/* Topbar for smaller screens */}
        <div className="col-12 d-md-none topbar">
          <div className="d-flex justify-content-around p-3 shadow-sm">
            <NavLink to={ID === "1" ? `/adminDashboard/${ID}` : `/operatorDashboard/${ID}`}>
              <i className="fs-4 bi-house text-dark"></i>
            </NavLink>
            <NavLink to="/addProject">
              <i className="fs-4 bi-bar-chart text-dark"></i>
            </NavLink>
            <NavLink to="/viewProjects">
              <i className="fs-4 bi-table text-dark"></i>
            </NavLink>
            <NavLink to="/donatorList">
              <i className="fs-4 bi-people text-dark"></i>
            </NavLink>
            <NavLink to="#" onClick={logout}>
              <i className="fs-4 bi-box-arrow-right text-dark"></i>
            </NavLink>
          </div>
        </div>

        {/* Content */}
        <div className="col py-3">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
