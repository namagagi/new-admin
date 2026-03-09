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
import { useNavigate, Link } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const DonatorList = () => {
    const [donatorDetails, setDonatorsDetails] = useState([]);
    const [filteredDonatorDetails, setFilteredDonatorDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectVerifiyButtonColor, setVerifyButtonColor] = useState("#000");
    const [selectCertifyButtonColor, setCertifyButtonColor] = useState("#b4b4b4");
    const [selectCertifiedButtonColor, setCertifiedButtonColor] = useState("#b4b4b4");
    const [searchBar, setSearchBar] = useState("none");
    const [DType, setDonatorType] = useState(0);
    const [showDialog, setDialogBox] = useState(false);
    const [donatorId, setDonatorId] = useState(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invoiceId, setInvoiceId] = useState("");
    const [images, setImages] = useState({
        itemPic: null,
       otherImages: []
    });
    const [loader, setLoader] = useState(false);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        if (DType === 0) {
            getDonatorDetails();
        } else {
            CertifyDonatorDetails();
        }
    }, [DType]);


    useEffect(() => {
        const filtered = donatorDetails.filter((donator) =>
            donator._id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDonatorDetails(filtered);
    }, [searchQuery, donatorDetails]);


    const handleSingleImageChange = (event, imageType) => {
        if (!event) {
          setImages((prevImages) => ({
            ...prevImages,
            [imageType]: null, 
          }));
        } else {
          const file = event.target.files[0];
          setImages((prevImages) => ({
            ...prevImages,
            [imageType]: file, 
          }));
        }
      };
      
      const handleOtherImagesChange = (event) => {
        if (!event) {
          setImages((prevImages) => ({
            ...prevImages,
            otherImages: [], 
          }));
          return;
        }
      
        const files = Array.from(event.target.files);
        setImages((prevImages) => ({
          ...prevImages,
          otherImages: [...prevImages.otherImages, ...files],
        }));
        setIsFileUploaded(true);
      };

    const VerifyDetails = (id) => {
        setDonatorId(id);
        setDialogBox(true);
    }

    const RejectData = (id) => {
        setDonatorId(id);
        setShowRejectDialog(true);
    }

    const handleRejectData = async () => {
        try {
            await handleReject(donatorId);
            setShowRejectDialog(false);
            setDonatorId(null);
        } catch (error) {
            console.error("Error approving event:", error);
        }
    }

    const handleApprove = async () => {
        try {
            await handleVerify(donatorId);
            setDialogBox(false);
            setDonatorId(null);
        } catch (error) {
            console.error("Error approving event:", error);
        }
    }

    const handleCancel = () => {
        setDialogBox(false);
        setShowRejectDialog(false);
        setDonatorId(null);
        setIsModalOpen(false);
    }

    const CertifyData = (id) => {
        setDonatorId(id);
        setIsModalOpen(true);
    }




    const getDonatorDetails = async () => {
        try {
            let response = await fetch(`${backendUrl}/admin/getDonatorData`, {
                headers: {
                    authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                },
                credentials: "include"
            });
            let result = await response.json();

            setDonatorsDetails(result.result);
            setFilteredDonatorDetails(result.result);
        } catch (error) {
            console.error("Error Occurred while fetching donator details", error);
        }
    };

    const VerifyDonatorDetails = async () => {
        try {
            let response = await fetch(`${backendUrl}/admin/getDonatorData`, {
                headers: {
                    authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                },
                credentials: "include",
            });
            let result = await response.json();
            setDonatorsDetails(result.result);
            setFilteredDonatorDetails(result.result);
        } catch (error) {
            console.error("Error Occurred while fetching donator details", error);
        }
    };

    const CertifyDonatorDetails = async (certifyType) => {
        try {
            let response = await fetch(`${backendUrl}/admin/getVerifiedDonatorData`, {
                headers: {
                    authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                },
                credentials: "include",
            });
            let result = await response.json();
            if(certifyType === 0)
            {   
                const uncertifiedDonators = result.result.filter(donator => !donator.certify);
                setDonatorsDetails(uncertifiedDonators);
                setFilteredDonatorDetails(uncertifiedDonators);
            }else if(certifyType === 1)
            {
                const certifiedDonators = result.result.filter(donator => donator.certify);
                setDonatorsDetails(certifiedDonators);
                setFilteredDonatorDetails(certifiedDonators);
            }
        } catch (error) {
            console.error("Error Occurred while fetching donator details", error);
        }
    };

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
        "&:last-child td, &:last-child th": {
            border: 0,
        },
    }));

    const handleVerify = async (id) => {
        try {
            setLoader(true);
            const response = await fetch(`${backendUrl}/admin/confirmDonatorDetails/${id}`, {
                headers: {
                    authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                },
                credentials: "include",
            });
            let result = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            } else if (response.status === 200) {
                alert(result.message);
                getDonatorDetails();
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error occurred during confirmation", error);
        }finally{
            setLoader(false);
        }
    };

    const handleCertify = async (e) => {
        e.preventDefault();
        if (!images.itemPic) {
            alert("Recived Items image is mandatory!");
            return;
          }
        const formData = new FormData();
        formData.append("invoiceId", invoiceId);
        const orderedImages = [
            images.itemPic,
            ...images.otherImages
          ].filter(Boolean);
          orderedImages.forEach((image, index) => {
            if (image) {
              formData.append('images', image);
            }
          });
          for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
          }
        try {
            setLoader(true);
            const response = await fetch(
                `${backendUrl}/admin/certifyDonatorsList/${donatorId}`,
                {
                    method: "POST",
                    headers: {
                        authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                    },
                    body: formData,
                    credentials: "include",
                }
            );
            const result = await response.json();
            if (response.ok) {
                alert("Donator certified successfully!");
                setDonatorId(null);
                setIsModalOpen(false);
                setInvoiceId("");
                setImages({itemPic: null, otherImages: []});
                setIsFileUploaded(false);
                setCheckbox1(false);
                setCheckbox2(false);
                CertifyDonatorDetails(0);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error occurred during rejection", error);
        } finally {
            setLoader(false);
        }
    }

    const handleReject = async (id) => {
        try {
            setLoader(true);
            let rejectUrl = "";
            if (DType === 1) {
                rejectUrl = `${backendUrl}/admin/rejectVerifiedDonatorDetails/${id}`;
            } else {
                rejectUrl = `${backendUrl}/admin/rejectDonatorDetails/${id}`;
            }
            const response = await fetch(rejectUrl, {
                headers: {
                    authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                },
                credentials: "include",
            });
            let result = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            } else if (response.status === 200) {
                alert(result.message);
                getDonatorDetails();
            }
        } catch (error) {
            console.error("Error occurred during rejection", error);
        }finally{
            setLoader(false);
        }
    };

    const VerifyDonators = () => {
        setSearchBar("none");
        setCertifiedButtonColor("#b4b4b4");
        setVerifyButtonColor("#000");
        setCertifyButtonColor("#b4b4b4");
        VerifyDonatorDetails();
        setDonatorType(0);
    };

    const CertifyDonators = () => {
        setSearchBar("block");
        setCertifiedButtonColor("#b4b4b4");
        setCertifyButtonColor("#000");
        setVerifyButtonColor("#b4b4b4");
        CertifyDonatorDetails(0);
        setDonatorType(1);
    };

    const CertifiedDonators = () =>{
        setSearchBar("block");
        setCertifiedButtonColor("#000");
        setCertifyButtonColor("#b4b4b4");
        setVerifyButtonColor("#b4b4b4");
        CertifyDonatorDetails(1);
        setDonatorType(2);
    }

    return (
        <>
            <div className="project-button-container">
                <div className="search-container d-flex">
                    <input
                        type="text"
                        placeholder="Search Donators by id..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="form-control search-input"
                        size={50}
                        style={{ visibility: searchBar === "none" ? "hidden" : "visible" }}
                    />
                </div>
                <button
                    className="project-approved-button"
                    onClick={VerifyDonators}
                    style={{ backgroundColor: selectVerifiyButtonColor }}
                >
                    Verify Donator Details
                </button>
                <button
                    className="project-unapproved-button"
                    onClick={CertifyDonators}
                    style={{ backgroundColor: selectCertifyButtonColor }}
                >
                    Certify Donator Details
                </button>
                <button
                    className="project-unapproved-button"
                    onClick={CertifiedDonators}
                    style={{ backgroundColor: selectCertifiedButtonColor }}
                >
                    Certified Donators
                </button>
            </div>

            <TableContainer component={Paper} className="table-container-project">
                <Table sx={{ minWidth: 950 }} aria-label="customized table" className="styled-table">
                    <TableHead>
                        <TableRow sx={{ height: "50px" }}>
                            <StyledTableCell>Sl.no</StyledTableCell>
                            <StyledTableCell align="left">Name</StyledTableCell>
                            <StyledTableCell align="left">Phone</StyledTableCell>
                            <StyledTableCell align="left">Mail-ID</StyledTableCell>
                            <StyledTableCell align="left">Address</StyledTableCell>
                            <StyledTableCell align="left">Total Cost</StyledTableCell>
                            <StyledTableCell align="center">Actions</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDonatorDetails?.map((data, index) => (
                            <StyledTableRow key={data._id}>
                                <StyledTableCell component="th" scope="row">
                                    {index + 1}
                                </StyledTableCell>
                                <StyledTableCell align="left">{data.donatorName}</StyledTableCell>
                                <StyledTableCell align="left">{data.donatorPhone}</StyledTableCell>
                                <StyledTableCell align="left">{data.donatorMail}</StyledTableCell>
                                <StyledTableCell align="left">{data.donatorAddress}</StyledTableCell>
                                <StyledTableCell align="left">{data.totalDonationCost}</StyledTableCell>
                                <StyledTableCell align="center">
                                    <div className="project-action-buttons" style={{ display: "flex", justifyContent: "center" }}>
                                        <Link className="action-button view-button" to={"/donatorDetails/" + data._id}>
                                            View
                                        </Link>
                                        {DType === 0 ? (
                                            <div style={{ display: "flex" }}>
                                                <button
                                                    className="action-button view-button"
                                                    onClick={() => VerifyDetails(data._id)}
                                                >
                                                    Verify
                                                </button>
                                                <button
                                                    className="action-button view-button"
                                                    onClick={() => RejectData(data._id)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : DType === 1 && (<div style={{ display: "flex" }}>
                                                <>
                                                    <button
                                                        className="action-button view-button"
                                                        onClick={() => CertifyData(data._id)}
                                                    >
                                                        Certify
                                                    </button>
                                                    <button
                                                        className="action-button view-button"
                                                        onClick={() => RejectData(data._id)}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                        </div>)}
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
                            <p>Are you sure you want to verify?</p>
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
                            <p>Are you sure you want to reject?</p>
                            <div>
                                <button
                                    className="button confirm-btn loader"
                                    onClick={handleRejectData}
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
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCancel}>&times;</span>
                        <h2>Certify Donator</h2>
                        <form onSubmit={handleCertify}>
                            <label>
                                Invoice ID:
                                <input
                                    type="text"
                                    value={invoiceId}
                                    onChange={(e) => setInvoiceId(e.target.value)}
                                    required
                                />
                            </label>
                            <label>
                                Upload Item image to diplay
                                <input
                                    type="file"
                                    onChange={(e) => handleSingleImageChange(e,"itemPic")}
                                    required
                                />
                            </label>
                            <label>
                                Upload (Other Item's image and certified invoice):
                                <input
                                    type="file"
                                    multiple
                                    onChange={handleOtherImagesChange}
                                />
                            </label>
                            {isFileUploaded && (
                                <>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={checkbox1}
                                            onChange={() => setCheckbox1(!checkbox1)}
                                        />
                                        Details verified by headmaster and checked
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={checkbox2}
                                            onChange={() => setCheckbox2(!checkbox2)}
                                        />
                                        The above-entered details are correct
                                    </label>
                                </>
                            )}
                            <button type="submit" className="loader" disabled={loader || !checkbox1 || !checkbox2}>{loader ? "Submitting..." : "Submit"}</button>
                        </form>
                    </div>
                </div>
            )}
            </>  
    );
};

export default DonatorList;
