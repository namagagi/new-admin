/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@splidejs/react-splide/css";
import "../Styles/App.css";
import "../Styles/viewEventDetails.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;


const DonatorDetails = () => {
    const [donatorDeatilData, setDonatorData] = useState(null);
    const [educationData, setEducationData] = useState(null);
    const navigate = useNavigate("");
    const params = useParams();

    useEffect(() => {
        donatorData();
    }, []);



    const donatorData = async () => {
        const url1 = `${backendUrl}/admin/getDonatorsDetails/${params.id}`;
        const url2 = `${backendUrl}/admin/getVerifiedDonatorsDetails/${params.id}`;
        try {
            let response = await fetch(
                url1,
                {
                    headers: {
                        authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                    },
                    credentials: "include",
                }
            );
            if (!response.ok) {
                response = await fetch(
                    url2,
                    {
                        headers: {
                            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
                        },
                        credentials: "include",
                    }
                );
            }
            let result = await response.json();
            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
            } else if (result) {
                setDonatorData(result.donator);
                setEducationData(result.education)
            } else {
                console.error("Error fetching data");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };


    if (!donatorDeatilData) {
        return 0;
    }


    return (
        <div className="details-container">
            <h1
                className="event-title"
                style={{ textAlign: "center", width: "100%" }}
            >
                Donator's Detail
            </h1>
            <main>
                <h1 className="text-body-emphasis">
                    Details about {donatorDeatilData.donatorName}
                </h1>
                <hr className="col-12 col-md-12 mb-5" />
            </main>
            <div className="row funding-amount ">
                <div className="amount-card col-lg-10"
                    style={{ marginTop: "30px" }}>
                    <div
                        style={{ marginBottom: "-20px" }}>
                        <h2>Donator's Detail:</h2>
                    </div>
                    <br />
                    <table className="event-table">
                        <tbody>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Name:</td>
                                <td>{donatorDeatilData.donatorName}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Phone No:</td>
                                <td>{donatorDeatilData.donatorPhone}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Mail</td>
                                <td>{donatorDeatilData.donatorMail}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Address</td>
                                <td>{donatorDeatilData.donatorAddress}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Donation Cost:</td>
                                <td>{donatorDeatilData.totalDonationCost}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                <div className="amount-card col-lg-10" style={{ marginTop: "30px" }}>
                    <div style={{ marginBottom: "-20px" }}>
                        <h2>Project's Donated:</h2>
                    </div>
                    <br />
                    <table className="event-table">
                        <tbody>

                            <tr style={{ fontSize: "1.5rem" }}>
                                <td>Item No.</td>
                                <td>Item Name</td>
                                <td>Quantity</td>
                                <td>Total Cost</td>
                            </tr>
                            {donatorDeatilData?.donatedItems?.map((item, index) => (
                                <tr key={index} style={{ fontSize: "1.3rem" }}>
                                    <td>{`Item ${index + 1}`}</td>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.totalCost}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
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
                                <td>{educationData.zone}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >School</td>
                                <td>{educationData.schoolName}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Village</td>
                                <td>{educationData.village}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Headmaster/Headmistress Name</td>
                                <td>{educationData.fundRaiserName}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Contact No</td>
                                <td>{educationData.contact}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Email-id</td>
                                <td>{educationData.email}</td>
                            </tr>
                            <tr style={{ fontSize: "1.3rem" }}>
                                <td >Description</td>
                                <td>{educationData.description}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

};
export default DonatorDetails;
