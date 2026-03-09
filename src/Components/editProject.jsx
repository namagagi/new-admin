/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AllItems from "../Components/AllItems";
import "../Styles/App.css";
import "../Styles/addEvent.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditEvent = () => {
  const [schoolName, setSchoolName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [edate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIFSC] = useState("");
  const [upiNumber, setUPI] = useState("");
  const [recommended, setRecommendBY] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectSector, setProjectSector] = useState("");
  const [totalAmount, setAmount] = useState("");
  const [fundRaiserName, setFundRaiserName] = useState("");
  const [village, setVillage] = useState("");
  const [zone, setZone] = useState("");
  const [taluk, setTaluk] = useState("");
  const [district, setDistrict] = useState("");
  const [landDetails, setLandDetails] = useState("");
  const [totalPopulation, setTotalPopulation] = useState("");
  const [projectParticular, setProjectParticular] = useState("");
  const [projectObjective, setProjectObjective] = useState("");
  const [items, setItems] = useState([]);

  const [submited, setSubmited] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  let navigate = useNavigate();
  let params = useParams();
  let ID = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    getUpdateData();
  }, []);

  useEffect(() => {
    const total = items.reduce((acc, item) => acc + item.totalAmount, 0);
    setAmount(total)
  }, [items]);



  const getUpdateData = async () => {
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
    }
    setSchoolName(result.schoolName);
    setContact(result.contact);
    setEmail(result.email);
    setEndDate(result.edate);
    setDescription(result.description);
    setAccountNumber(result.accountNumber);
    setIFSC(result.ifscCode);
    setUPI(result.upiNumber);
    setRecommendBY(result.recommended);
    setProjectName(result.projectName);
    setLandDetails(result.landDetails);
    setTaluk(result.taluk);
    setZone(result.zone);
    setVillage(result.village);
    setDistrict(result.district);
    setProjectObjective(result.projectObjective);
    setProjectParticular(result.projectParticular);
    setTotalPopulation(result.totalPopulation);
    setProjectType(result.projectType);
    setProjectSector(result.projectSector);
    setAmount(result.totalAmount);
    setFundRaiserName(result.fundRaiserName);
    setItems(result.items);
  };


  // const handleItemChange = (index, field, value) => {
  //   const updatedItems = [...items];
  //   const updatedItem = { ...updatedItems[index], [field]: value };

  //   if (field === "quantity" || field === "amount") {
  //     const quantity = Number(updatedItem.quantity) || 0;
  //     const amount = Number(updatedItem.amount) || 0;
  //     updatedItem.totalAmount = quantity * amount;
  //   }

  //   updatedItems[index] = updatedItem;
  //   setItems(updatedItems);

  //   const totalAmountSum = updatedItems.reduce((acc, item) => acc + item.totalAmount, 0);
  //   setAmount(totalAmountSum); 
  // };


  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    if (field === 'item') {
      updatedItems[index].item = value;

      // If 'Other' is selected, set isOther to true and reset item
      if (value === 'Other') {
        updatedItems[index].isOther = true;
        updatedItems[index].item = ''; // Start the input box for 'Other' as empty
        updatedItems[index].amount = ''; // Allow user to input their amount
        updatedItems[index].totalAmount = ''; // Reset total amount
      } else {
        updatedItems[index].isOther = false;

        // Find the selected item to get its cost
        const selectedItem = AllItems.find(item => item.item === value);
        if (selectedItem) {
          updatedItems[index].amount = selectedItem.cost; // Set the amount to the cost of the selected item
          updatedItems[index].totalAmount = selectedItem.cost * (updatedItems[index].quantity || 0);
        } else {
          updatedItems[index].amount = ''; // Reset amount if no item is selected
          updatedItems[index].totalAmount = ''; // Reset total amount
        }
      }
    } else if (field === 'quantity') {
      updatedItems[index].quantity = value;
      // Update total amount based on quantity
      updatedItems[index].totalAmount = updatedItems[index].amount * value;
    }

    setItems(updatedItems);
  };

  const handleOtherItemChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].item = value; // Update the custom item name
    updatedItems[index].amount = ''; // Allow the user to input their amount
    updatedItems[index].totalAmount = ''; // Reset total amount
    setItems(updatedItems);
  };

  const handleAmountChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].amount = value; // Allow user to input their amount
    updatedItems[index].totalAmount = value * (updatedItems[index].quantity || 0); // Update total amount
    setItems(updatedItems);
  };

  const getAvailableItems = (index) => {
    const selectedItems = items.map(item => item.item).filter(item => item);
    return AllItems.filter(item => !selectedItems.includes(item.item) || items[index].item === item.item);
  };

  // Add a new row directly to the items array
  const addRow = () => {
    const newRow = { item: "", quantity: "", amount: "", totalAmount: 0, isNew: true };
    setItems([...items, newRow]);
  };

  // Delete only newly added row
  const deleteRow = (index) => {
    const updatedItems = items.filter((_, i) => i !== index); // Remove only the selected row
    setItems(updatedItems);
  };


  const AddOperatorData = async (event, id) => {
    event.preventDefault();
    try {
      setSubmited(true);
      const response = await fetch(
        // `http://localhost:2000/admin/editProjectData/${id}/${ID}/${projectType}`,
        `${backendUrl}/admin/editProjectData/${id}/${ID}/${projectType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({
            projectType,
            projectSector,
            schoolName,
            village,
            taluk,
            zone,
            district,
            fundRaiserName,
            contact,
            email,
            edate,
            totalAmount,
            description,
            accountNumber,
            ifscCode,
            upiNumber,
            recommended,
            projectName,
            landDetails,
            totalPopulation,
            projectParticular,
            projectObjective,
            items
          }),
          credentials: "include",
        }
      );
      await response.json();
      // eslint-disable-next-line default-case
      switch (response.status) {
        case 401:
          localStorage.removeItem("token");
          navigate("/");
          break;
        case 200:
          navigate("/viewProjects");
          break;
        case 500:
          alert("The updating data is not their in the database");
      }
    } catch (error) {
      console.error("Error uploading data", error);
    } finally {
      setSubmited(false);
    }
  };

  const AddAdminData = async (event, id) => {
    event.preventDefault();
    try {
      setSubmited(true);
      const response = await fetch(
        // `http://localhost:2000/admin/editProjectData/${id}/${ID}/${projectType}`,
        `${backendUrl}/admin/editProjectData/${id}/${ID}/${projectType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({
            projectType,
            projectSector,
            schoolName,
            village,
            taluk,
            zone,
            district,
            fundRaiserName,
            contact,
            email,
            edate,
            totalAmount,
            description,
            accountNumber,
            ifscCode,
            upiNumber,
            recommended,
            projectName,
            landDetails,
            totalPopulation,
            items,
          }),
          credentials: "include",
        }
      );
      await response.json();
      // eslint-disable-next-line default-case
      switch (response.status) {
        case 401:
          localStorage.removeItem("token");
          navigate("/");
          break;
        case 200:
          navigate(`/viewProjects`);
          break;
        case 500:
          alert("The updating data is not their in the database");
      }
    } catch (error) {
      console.error("Error uploading data", error);
    } finally {
      setSubmited(false);
    }
  };

  return (
    <>

      <form className="form">
        <h1>Update Data</h1>
        {projectType === "1" ? (
          <>
            {projectSector === "infrastructure" ? (
              <>
                <div className="input-container">
                  <label htmlFor="zone">Block</label>
                  <input type="text" value={zone} disabled />
                </div>

                <div className="input-container">
                  <label htmlFor="taluk">Taluk Name</label>
                  <input
                    id="taluk"
                    type="text"
                    value={taluk}
                    disabled
                    required
                  />
                </div>


                <div className="input-container">
                  <label htmlFor="school">School</label>
                  <div className="custom-select-container">
                    <input
                      type="text"
                      value={schoolName}
                      className="select-input"
                      required
                      disabled
                    />
                  </div>
                </div>

                <div className="input-container">
                  <label htmlFor="text">Village name</label>
                  <input
                    type="text"
                    value={village}
                    disabled
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="text">Name of Head Master</label>
                  <input
                    type="text"
                    value={fundRaiserName}
                    onChange={(e) => setFundRaiserName(e.target.value)}
                    placeholder="Enter the Name of head master"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="contact">Contact</label>
                  <input
                    type="number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter Phone number of school"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="contact">Email-ID </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email-id of school"
                  />
                </div>


                <div className="input-container">
                  <label htmlFor="about">Description of Project</label>
                  <textarea
                    name="about"
                    id="about"
                    cols="60"
                    rows="10"
                    maxLength="3000"
                    placeholder="About the Project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="dynamic-row">
                  <label htmlFor="requirements">Add your requirements</label>

                  {items.map((row, index) => (
                    <div key={index} className="form-row">
                      {row.isNew ? (
                        <>
                          <select
                            value={row.isOther ? 'Other' : row.item}
                            onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                            className="input-field"
                            disabled={(ID === "2" && row._id) || (ID === "1" && row._id && params.PNo === "1")}
                          >
                            <option value="" disabled>Select Item</option>
                            {getAvailableItems(index).map((item) => (
                              <option key={item.item} value={item.item}>
                                {item.item}
                              </option>
                            ))}
                            <option value="Other">Other</option>
                          </select>

                          {row.isOther && (
                            <input
                              type="text"
                              placeholder="Enter new item"
                              value={row.item}
                              onChange={(e) => handleOtherItemChange(index, e.target.value)}
                              className="input-field"
                              disabled={ID === "2" && row._id}
                            />
                          )}
                        </>
                      ) : (
                        <input
                          type="text"
                          value={row.item}
                          readOnly
                          className="input-field"
                        />
                      )}

                      <input
                        type="number"
                        placeholder="Quantity"
                        value={row.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="input-field"
                        onWheel={(e) => e.target.blur()}
                        disabled={(ID === "1" && row._id && params.PNo === "1")}
                      />

                      <input
                        type="number"
                        placeholder="Amount"
                        value={row.isOther ? row.amount : row.amount} // Allow editing for 'Other'
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        className="input-field"
                        onWheel={(e) => e.target.blur()}
                        disabled={(ID === "2" && !row.isOther) || (ID === "1" && row._id && params.PNo === "1")}
                      />

                      <input
                        type="number"
                        placeholder="Total Amount"
                        value={row.totalAmount}
                        readOnly
                        className="input-field"
                        onWheel={(e) => e.target.blur()}
                        disabled={(ID === "2" && row._id) || (ID === "1" && row._id && params.PNo === "1")}
                      />

                      {row.isNew && (
                        <button
                          type="button"
                          onClick={() => deleteRow(index)} // Ensure deleteRow is defined
                          className="delete-row-button"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>


                <button type="button" onClick={addRow} className="add-row-button">+Add Item</button>

                <div className="input-container">
                  <label>Total amount required </label>
                  <input
                    type="text"
                    value={totalAmount}
                    placeholder="Total Amount"
                    required
                    disabled
                  />
                </div>



                <div
                  className="d-flex align-items-center" // Change to align-items-center for vertical centering
                  style={{
                    width: "60%",
                    gap: "20px",
                    fontSize: "20px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="confirm-details"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                    style={{
                      marginLeft: "0px",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      marginRight: "2px",
                    }}
                  />
                  <label htmlFor="confirm-details" style={{ margin: 0, color: "red" }}>
                    I confirm the above-entered details are correct
                  </label>
                </div>

              </>
            ) : projectSector === "training" ? (
              <>
                <div className="input-container">
                  <label htmlFor="firstname">Name of School</label>
                  <input
                    type="text"
                    value={schoolName}
                    placeholder="Name"
                    required
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="text">Village name</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Enter the village name"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="text">Taluk name</label>
                  <input
                    type="text"
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    placeholder="Enter the taluk name"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="text">District name</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Enter the district name"
                    required
                  />
                </div>


                <div className="input-container">
                  <label htmlFor="text">Name of fund raiser</label>
                  <input
                    type="text"
                    value={fundRaiserName}
                    onChange={(e) => setFundRaiserName(e.target.value)}
                    placeholder="Enter the Name of fund raiser"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="contact">Contact</label>
                  <input
                    type="number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter Phone number"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="contact">Email-ID </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email-id"
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="edate">Fund Raising Deadline(Date) </label>
                  <input
                    type="date"
                    value={edate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Enter the date"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="edate">Total amount required </label>
                  <input
                    type="text"
                    value={totalAmount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter the total amount required"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="about">Description of Project</label>
                  <textarea
                    name="about"
                    id="about"
                    cols="30"
                    rows="10"
                    placeholder="About the Project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="input-container">
                  <h5>Bank Details:</h5>
                  <label>A/C No:</label>
                  <input
                    type="text"
                    placeholder="Enter the Account Number:"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                <div className="input-container">
                  <label>IFSC Code:</label>
                  <input
                    type="text"
                    placeholder="Enter the IFSC Code:"
                    value={ifscCode}
                    onChange={(e) => setIFSC(e.target.value)}
                    required
                  />
                </div>

                <div className="input-container">
                  <label>UPI Number:</label>
                  <input
                    type="text"
                    placeholder="Enter the UPI Number:"
                    value={upiNumber}
                    onChange={(e) => setUPI(e.target.value)}
                    required
                  />
                </div>

                <div className="input-container">
                  <label>Recommended by:</label>
                  <input
                    type="text"
                    placeholder="Ex: BEO, DC..."
                    value={recommended}
                    onChange={(e) => setRecommendBY(e.target.value)}
                    required
                  />
                </div>

                <div
                  className="d-flex align-items-center" // Change to align-items-center for vertical centering
                  style={{
                    width: "60%",
                    gap: "20px",
                    fontSize: "20px",
                  }}
                >
                  <input
                    type="checkbox"
                    id="confirm-details"
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                    style={{
                      marginLeft: "0px",
                      width: "24px",
                      height: "24px",
                      cursor: "pointer",
                      marginRight: "2px",
                    }}
                  />
                  <label htmlFor="confirm-details" style={{ margin: 0, color: "red" }}>
                    I confirm the above-entered details are correct
                  </label>
                </div>
              </>
            ) : projectSector === "newConstruction" ? (
              <>
                <div className="input-container">
                  <label htmlFor="firstname">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    placeholder="Name"
                    required
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="text">Village name</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="Enter the village name"
                    required
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="text">Taluk name</label>
                  <input
                    type="text"
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    placeholder="Enter the taluk name"
                    required
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="text">District name</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Enter the district name"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="about">Description of Project</label>
                  <textarea
                    name="about"
                    id="about"
                    cols="30"
                    rows="10"
                    placeholder="About the Project"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>


                <div className="input-container">
                  <label htmlFor="edate">Land Measurments in acres</label>
                  <input
                    type="text"
                    value={landDetails}
                    onChange={(e) => setLandDetails(e.target.value)}
                    placeholder="Enter the Land measurements"
                    required
                  />
                </div>

                <div className="input-container">
                  <label htmlFor="text">Name of fund raiser</label>
                  <input
                    type="text"
                    value={fundRaiserName}
                    onChange={(e) => setFundRaiserName(e.target.value)}
                    placeholder="Enter the Name of fund raiser"
                    required
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="contact">Contact</label>
                  <input
                    type="number"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Enter Phone number"
                    required
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="contact">Email-ID </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email-id"
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="edate">Fund Raising Deadline(Date) </label>
                  <input
                    type="date"
                    value={edate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Enter the date"
                    required
                  />
                </div>
                <div className="input-container">
                  <label htmlFor="edate">Total amount required </label>
                  <input
                    type="text"
                    value={totalAmount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter the total amount required"
                    required
                  />
                </div>

                <div className="input-container">
                  <h5>Bank Details:</h5>
                  <label>A/C No:</label>
                  <input
                    type="text"
                    placeholder="Enter the Account Number:"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="input-container">
                  <label>IFSC Code:</label>
                  <input
                    type="text"
                    placeholder="Enter the IFSC Code:"
                    value={ifscCode}
                    onChange={(e) => setIFSC(e.target.value)}
                    required
                  />
                </div>
                <div className="input-container">
                  <label>UPI Number:</label>
                  <input
                    type="text"
                    placeholder="Enter the UPI Number:"
                    value={upiNumber}
                    onChange={(e) => setUPI(e.target.value)}
                    required
                  />
                </div>
                <div className="input-container">
                  <label>Recommended by:</label>
                  <input
                    type="text"
                    placeholder="Ex: BEO, DC..."
                    value={recommended}
                    onChange={(e) => setRecommendBY(e.target.value)}
                    required
                  /> 
                </div>
              </>
            ) : (
              <></>
            )}
          </>
        ) : projectType === "2" ? (
          <>
            <div className="input-container">
              <label htmlFor="firstname">Project Name</label>
              <input
                type="text"
                value={projectName}
                placeholder="Name"
                required
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="input-container">
              <label htmlFor="text">Village name</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Enter the village name"
                required
              />
            </div>

            <div className="input-container">
              <label htmlFor="text">Taluk name</label>
              <input
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                placeholder="Enter the taluk name"
                required
              />
            </div>

            <div className="input-container">
              <label htmlFor="text">District name</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Enter the district name"
                required
              />
            </div>

            <div className="input-container">
              <label>Project Particular</label>
              <input
                type="text"
                value={projectParticular}
                onChange={(e) => setProjectParticular(e.target.value)}
                placeholder="Enter the Project which you want"
                required
              />
            </div>

            <div className="input-container">
              <label>Overall population</label>
              <input
                type="text"
                value={totalPopulation}
                onChange={(e) => setTotalPopulation(e.target.value)}
                placeholder="Enter the Overall population in that area"
                required
              />
            </div>

            <div className="input-container">
              <label>Land Measurments in acres</label>
              <input
                type="text"
                value={landDetails}
                onChange={(e) => setLandDetails(e.target.value)}
                placeholder="Enter the land measurements"
                required
              />
            </div>

            <div className="input-container">
              <label htmlFor="text">Name of fund raiser</label>
              <input
                type="text"
                value={fundRaiserName}
                onChange={(e) => setFundRaiserName(e.target.value)}
                placeholder="Enter the Name of fund raiser"
                required
              />
            </div>

            <div className="input-container">
              <label htmlFor="contact">Contact</label>
              <input
                type="number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Enter Phone number"
                required
              />
            </div>

            <div className="input-container">
              <label htmlFor="contact">Email-ID </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email-id"
              />
            </div>
            <div className="input-container">
              <label htmlFor="edate">Fund Raising Deadline(Date) </label>
              <input
                type="date"
                value={edate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Enter the date"
                required
              />
            </div>

            <div className="input-container">
              <label htmlFor="edate">Total amount required </label>
              <input
                type="text"
                value={totalAmount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter the total amount required"
                required
              />
            </div>

            <div className="input-container">
              <label htmlFor="about">Project goal and objectives</label>
              <textarea
                name="about"
                id="about"
                cols="30"
                rows="10"
                placeholder="About the Project"
                value={projectObjective}
                onChange={(e) => setProjectObjective(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="input-container">
              <h5>Bank Details:</h5>
              <label>A/C No:</label>
              <input
                type="text"
                placeholder="Enter the Account Number:"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <label>IFSC Code:</label>
              <input
                type="text"
                placeholder="Enter the IFSC Code:"
                value={ifscCode}
                onChange={(e) => setIFSC(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <label>UPI Number:</label>
              <input
                type="text"
                placeholder="Enter the UPI Number:"
                value={upiNumber}
                onChange={(e) => setUPI(e.target.value)}
                required
              />
            </div>

            <div className="input-container">
              <label>Recommended by:</label>
              <input
                type="text"
                placeholder="Ex: BEO, DC..."
                value={recommended}
                onChange={(e) => setRecommendBY(e.target.value)}
                required
              />
            </div>
          </>
        ) : projectType === "3" ? (
          <>
            <h1>Hello</h1>
          </>
        ) : (
          <></>
        )}
        <div className="d-flex justify-content-center pb-3">
          {ID === "2" ? (
            <button
              type="submit"
              className="loader"
              onClick={(event) => AddOperatorData(event, params.id)}
              disabled={!isCheckboxChecked || submited}
            >
              {submited ? "Submited.." : "Submit"}
            </button>
          ) : (
            <button
              type="submit"
              className="loader"
              onClick={(event) => AddAdminData(event, params.id)}
              disabled={!isCheckboxChecked || submited}
            >
              {submited ? "Submited.." : "Submit"}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default EditEvent;