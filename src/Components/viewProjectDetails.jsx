/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@splidejs/react-splide/css";
import "../Styles/App.css";
import "../Styles/viewEventDetails.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const ViewDetails = () => {
  const [projectData, setProjectData] = useState(null);
  const params = useParams();
  const navigate = useNavigate("");
  useEffect(() => {
    viewData();
  }, []);




  const viewData = async () => {
    try {
      let response = await fetch(
        // `http://localhost:2000/admin/viewProjectDetails/${params.id}`,
        `${backendUrl}/admin/viewProjectDetails/${params.id}`,
        {
          headers: {
            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
          },
          credentials: "include",
        }
      );
      let result = await response.json();
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else if (result) {
        setProjectData(result);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!projectData) {
    return <div>Loading...</div>;
  }


  return (
      <div className="details-container">
        <h1
          className="event-title"
          style={{ textAlign: "center", width: "100%" }}
        >
          {projectData.schoolName || projectData.projectName}
        </h1>

        {projectData.imagePath === null ? (
          <></>
        ) : (
          <div
            id="carouselExampleRide"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {projectData.imagePath.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    className="carousel-image"
                    src={`${backendUrl + image}`}
                    alt={`project Image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              style={{ cursor: "unset" }}
            >
              <span
                className="carousel-control-prev-icon"
                data-bs-target="#carouselExampleRide"
                data-bs-slide="prev"
                aria-hidden="true"
                style={{cursor: "pointer", backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='black' viewBox='0 0 16 16'%3E%3Cpath d='M5.854 4.146a.5.5 0 0 1 0 .708L2.707 8l3.147 3.146a.5.5 0 1 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zM11.5 8a.5.5 0 0 1-.5.5H2a.5.5 0 0 1 0-1h9a.5.5 0 0 1 .5.5z'/%3E%3C/svg%3E")`}}
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              style={{ cursor: "unset" }}
            >
              <span
                className="carousel-control-next-icon"
                data-bs-target="#carouselExampleRide"
                data-bs-slide="next"
                aria-hidden="true"
                style={{ cursor: "pointer" , backgroundImage:`url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='black' viewBox='0 0 16 16'%3E%3Cpath d='M10.146 4.146a.5.5 0 0 1 .708 0l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8l-3.147-3.146a.5.5 0 0 1 0-.708zM4.5 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z'/%3E%3C/svg%3E")`}}
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        )}

        <main>
          <h1 className="text-body-emphasis">
            Details About {projectData.schoolName || projectData.projectName}{" "}
          </h1>

          <hr className="col-12 col-md-12 mb-5" />
        </main>
        <div className="row funding-amount">
          <div className="col-lg-6">

            <div className="amount-card">

              <div className="amount">
                <div
                >
                  <h2>Total Amount:</h2>

                  <span className="currency-symbol">₹</span> {projectData.totalAmount}
                </div>
              </div>


              <div className="amount-footer">
                <span className="raised supporters">
                  <span className="numbers">0</span> supporters
                </span>
              </div>
            </div>
          </div>

          <div className="amount-card col-lg-10"
            style={{ marginTop: "30px" }}>
            <div
              style={{ marginBottom: "-20px" }}>
              <h2>School Details:</h2>
            </div>
            <br />
            <table className="event-table">
              <tbody>
                <tr style={{ fontSize: "1.3rem" }}>
                  <td >Block</td>
                  <td>{projectData.zone}</td>
                </tr>
                <tr style={{ fontSize: "1.3rem" }}>
                  <td >School</td>
                  <td>{projectData.schoolName}</td>
                </tr>
                <tr style={{ fontSize: "1.3rem" }}>
                  <td >Village</td>
                  <td>{projectData.village}</td>
                </tr>
                <tr style={{ fontSize: "1.3rem" }}>
                  <td >Headmaster/Headmistress Name</td>
                  <td>{projectData.fundRaiserName}</td>
                </tr>
                <tr style={{ fontSize: "1.3rem" }}>
                  <td >Contact No</td>
                  <td>{projectData.contact}</td>
                </tr>
                <tr style={{ fontSize: "1.3rem" }}>
                  <td >Email-id</td>
                  <td>{projectData.email}</td>
                </tr>
                <tr style={{ fontSize: "1.3rem" }}>
                  <td >Description</td>
                  <td>{projectData.description}</td>
                </tr>

              </tbody>
            </table>
          </div>

          <div className="amount-card col-lg-10"
            style={{ marginTop: "30px" }}>
            <div
              style={{ marginBottom: "-20px" }}
            >
              <h2>Project Requirements:</h2>
            </div>
            <br />
            <table className="event-table ">
              <tbody>
                <tr style={{ fontSize: "1.5rem" }}>
                  <td>Item No.</td>
                  <td>Item Name</td>
                  <td>Quantity</td>
                  <td>Amount</td>
                  <td>Total Amount</td>
                </tr>
                {projectData.items.map((item, index) => (
                  <tr key={index} style={{ fontSize: "1.3rem" }}>
                    <td>{`Item ${index + 1}`}</td>
                    <td>{item.item}</td>
                    <td>{item.quantity}</td>
                    <td>{item.amount}</td>
                    <td>{item.totalAmount}</td>
                  </tr>
                ))}

                <tr style={{ fontSize: "1.3rem" }}>
                  <td colSpan="4" style={{ textAlign: "left" }}>Total Cost:</td>
                  <td>{projectData.totalAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default ViewDetails;
