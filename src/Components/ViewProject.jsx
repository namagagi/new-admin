/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../Styles/viewEvent.css";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, useNavigate } from "react-router-dom";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ViewProjects = () => {
  const [allProjectData, setApprovedAllProjects] = useState({
    education: [],
    publicSpaces: [],
    health: [],
  });
  const [category, setCategory] = useState("");

  const [PNo, setPNo] = useState("");
  const ID = JSON.parse(localStorage.getItem("user"));
  const [showDialog, setShowDialog] = React.useState(false);
  const [selectedProjectId, setSelectedProjectId] = React.useState(null);
  const [showRejectDialog, setShowRejectDialog] = React.useState(false);
  const [rejectedReason, setRejectedReason] = React.useState("");
  const [selectProjectType, setProjectType] = useState(null);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const [buttonsDisabledColor, setButtonsDisabledColor] = useState("");
  const [selectApprovedButtonColor, setApprovedButtonColor] = useState("#000");
  const [selectUnApprovedButtonColor, setUnApprovedButtonColor] = useState("#b4b4b4");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [educationButton, setEducationButtonColor] = useState("");
  const [projects, setProjects] = useState([]);
  const [healthButton, setHealthButtonColor] = useState("");
  const [publicSpacesButton, setPublicSpacesButtonColor] = useState("");
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate("");

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  useEffect(() => {
    getApprovedAllProject();
  }, []);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      (project.name || project.schoolName || project.projectName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setApprovedAllProjects((prev) => ({
      ...prev,
      education: filtered,
    }));
  }, [searchQuery, projects]);

  const getApprovedAllProject = async () => {
    setPNo(1);
    let response = await fetch(
      // "http://localhost:2000/users/getApprovedProjects",
      `${backendUrl}/admin/getApprovedProjects`,
      {
        headers: {
          authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
        },
        credentials: "include",
      }
    );
    const result = await response.json();
    if (response.status === 401) {
      localStorage.removeItem("token");
      navigate("/");
    } else if (response) {
      setApprovedAllProjects(result);
      setProjects(result.education || []);
    }
    if (buttonsDisabled) {
      setButtonsDisabledColor("#b4b4b4");
    }
  };

  const handleButtonClick = (category) => {
    setCategory(category);
  };

  const ApprovedProjects = async (e) => {
    setButtonsDisabled(false);
    setApprovedButtonColor("#000");
    setUnApprovedButtonColor("#b4b4b4");
    setButtonsDisabledColor("#333");
    setEducationButtonColor("#585858");
    setHealthButtonColor("#585858");
    setPublicSpacesButtonColor("#585858");
    setPNo(1);
    let response = await fetch(
      // "http://localhost:2000/users/getApprovedProjects",
      `${backendUrl}/admin/getApprovedProjects`,
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
      setApprovedAllProjects(result);
      setProjects(result.education || []);
    }
    handleButtonClick("");
  };

  const UnApprovedProjects = async () => {
    setButtonsDisabled(false);
    setButtonsDisabledColor("#333");
    setUnApprovedButtonColor("#000");
    setApprovedButtonColor("#b4b4b4");
    setEducationButtonColor("#585858");
    setHealthButtonColor("#585858");
    setPublicSpacesButtonColor("#585858");
    setPNo(2);
    let response = await fetch(
      // "http://localhost:2000/users/getUnApprovedProjects",
      `${backendUrl}/operator/getUnApprovedProjects`,
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
      setApprovedAllProjects(result);
      setProjects(result.education || []);
    }
    handleButtonClick("");
  };

  const handleConfirm = (eventId, projectType) => {
    setSelectedProjectId(eventId);
    setProjectType(projectType);
    setShowDialog(true);
  };
  const handleApprove = async () => {
    try {
      await Approve(selectedProjectId, selectProjectType);
      setShowDialog(false);
      setSelectedProjectId(null);
      setProjectType(null);
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    setSelectedProjectId(null);
  };

  const handleDeleteConfirm = (eventId, projectType) => {
    setSelectedProjectId(eventId);
    setProjectType(projectType);
    setShowDeleteDialog(true);
  }

  const handleDelete = async () => {
    try {
      await Delete(selectedProjectId, selectProjectType);
      setShowDeleteDialog(false);
      setSelectedProjectId(null);
      setProjectType(null);
    } catch (error) {
      console.error("Error approving event:", error);
    }
  }

  const handleRejectConfirm = (eventId, projectType) => {
    setSelectedProjectId(eventId);
    setProjectType(projectType);
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    try {
      await Reject(selectedProjectId, selectProjectType);
      setShowRejectDialog(false);
      setSelectedProjectId(null);
      setProjectType(null);
    } catch (error) {
      console.error("Error approving event:", error);
    }
  };

  const cancelButton = () => {
    setShowRejectDialog(false);
    setSelectedProjectId(null);
    setProjectType(null);
    setShowDeleteDialog(false);
  };

  const Approve = async (id, pType) => {
    try {
      setLoader(true);
      let result = await fetch(
        // `http://localhost:2000/admin/approveProject/${id}/${pType}`,
        `${backendUrl}/admin/approveProject/${id}/${pType}`,
        {
          headers: {
            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
          },
          credentials: "include",
        }
      );
      result = await result.json();
      if (result.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else if (result) {
        alert(result.message);
        ApprovedProjects();
      }
    }
    finally {
      setLoader(false);
    }
  };

  const Reject = async (id, pType) => {
    try {
      setLoader(true);
      let result = await fetch(
        // `http://localhost:2000/admin/rejectProject/${id}/${pType}`,
        `${backendUrl}/admin/rejectProject/${id}/${pType}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
          },
          method: "POST",
          body: JSON.stringify({ rejectedReason }),
          credentials: "include",
        }
      );
      result = await result.json();
      if (result.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else if (result.status === 200) {
        ApprovedProjects();
      }
    } finally {
      setLoader(false);
    }
  };

  const Delete = async (id, pType) => {

    try {
      setLoader(true);
      const response = await fetch(
        // `http://localhost:2000/admin/deleteProject/${id}/${pType}`,
        `${backendUrl}/admin/deleteProject/${id}/${pType}`,
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
          },
          credentials: "include",
        }
      );
      let result = await response.json();
      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      } else if (response.status === 200) {
        alert(result.message);
        if(PNo === 2)
        {
        UnApprovedProjects();
        }else{
        ApprovedProjects();
        }
      }
    } catch (error) {
      console.log(error);

    } finally {
      setLoader(false);
    }
  };

  const getFilteredProjects = () => {
    if (category === "education") {
      return allProjectData.education;
    } else if (category === "health") {
      return allProjectData.health;
    } else if (category === "publicSpaces") {
      return allProjectData.publicSpaces;
    } else {
      return allProjectData.education &&
        allProjectData.health &&
        allProjectData.publicSpaces
        ? [
          ...allProjectData.education,
          ...allProjectData.health,
          ...allProjectData.publicSpaces,
        ]
        : [];
    }
  };

  const filteredProjects = getFilteredProjects();
  return (
    <>
      <div className="project-button-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Schools by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control search-input"
          />
        </div>

        <button
          className="project-approved-button"
          onClick={() => ApprovedProjects()}
          style={{ backgroundColor: selectApprovedButtonColor }}
        >
          Approved School Details
        </button>

        <button
          className="project-unapproved-button"
          onClick={() => UnApprovedProjects()}
          style={{ backgroundColor: selectUnApprovedButtonColor }}
        >
          Unapproved School Details
        </button>
      </div>

      <TableContainer component={Paper} className="table-container-project">
        <Table
          aria-label="customized table"
          className="styled-table"
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Sl.no</StyledTableCell>
              <StyledTableCell align="center">School Name</StyledTableCell>
              <StyledTableCell align="center">Place</StyledTableCell>
              <StyledTableCell align="center">Contact</StyledTableCell>
              <StyledTableCell align="center">Mail-ID</StyledTableCell>
              <StyledTableCell align="center">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody className="bb">
            {filteredProjects?.map((data, index) => (
              <StyledTableRow key={data.id}>
                <StyledTableCell scope="row">
                  {index + 1}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {data.projectName || data.schoolName}
                </StyledTableCell>
                <StyledTableCell align="left">{data.village}</StyledTableCell>
                <StyledTableCell align="left">{data.contact}</StyledTableCell>
                <StyledTableCell align="left">{data.email}</StyledTableCell>
                <StyledTableCell align="left">
                  {" "}
                  <div className="project-action-buttons" style={{ display: "flex" }}>
                    <Link
                      className="action-button view-button"
                      to={"/projectDetails/" + data._id}
                    >
                      View
                    </Link>
                    
                    {ID === "1" && PNo === 2 ? (
                      <>
                      <Link
                      className="action-button edit-button"
                      to={"/editProject/" + data._id + "/" + PNo}
                    >
                      Edit
                    </Link>
                        <button
                          className="action-button view-button"
                          onClick={() =>
                            handleConfirm(data._id, data.projectType)
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="action-button view-button"
                          onClick={() =>
                            handleRejectConfirm(data._id, data.projectType)
                          }
                        >
                          Reject
                        </button>
                      </>
                    ) : ID === "2" && PNo === 2 ? (
                      <>
                      <Link
                      className="action-button edit-button"
                      to={"/editProject/" + data._id + "/" + PNo}
                    >
                      Edit
                    </Link><button
                      className="action-button view-button"
                      onClick={() =>
                        handleDeleteConfirm(data._id, data.projectType)
                      }
                    >
                      Delete
                    </button></>
                    ) : ID === "1" && PNo === 1 ? (
                      <>
                      <Link
                      className="action-button edit-button"
                      to={"/editProject/" + data._id + "/" + PNo}
                    >
                      Edit
                    </Link>
                    <Link
                      className="action-button edit-button"
                      to={"/editQuantity/" + data._id + "/" + PNo}
                    >
                      EditList
                    </Link>
                        <button
                          className="action-button view-button"
                          onClick={() =>
                            handleDeleteConfirm(data._id, data.projectType)
                          }
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                      </>
                    )}
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {showDialog && (
        <>
          <div id="overlay"></div>
          <div id="dialog-container">
            <div className="dialog">
              <p>Are you sure you want to approve?</p>
              <div>
                <button
                  className="button confirm-btn loader"
                  onClick={handleApprove}
                  disabled={loader}
                >
                  Yes
                </button>
                <button className="button cancel-btn" onClick={handleCancel}>
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {showRejectDialog && (
        <>
          <div id="overlay"></div>
          <div id="dialog-container">
            <div className="dialog">
              <p>Please enter the reason for rejection</p>
              <textarea
                cols="30"
                rows="3"
                placeholder="Reason for rejection"
                value={rejectedReason}
                onChange={(e) => setRejectedReason(e.target.value)}
              ></textarea>
              <div>
                <button className="button confirm-btn loader" onClick={handleReject} disabled={loader}>
                  Yes
                </button>
                <button className="button cancel-btn" onClick={cancelButton}>
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {showDeleteDialog && (
        <>
          <div id="overlay"></div>
          <div id="dialog-container">
            <div className="dialog">
              <p>Are you sure you want to delete the project?</p>
              <div>
                <button className="button confirm-btn loader" onClick={handleDelete} disabled={loader}>
                  Yes
                </button>
                <button className="button cancel-btn" onClick={cancelButton}>
                  No
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewProjects;
