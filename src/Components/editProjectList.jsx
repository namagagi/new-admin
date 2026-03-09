/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable default-case */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AllItems from "../Components/AllItems";
import "../Styles/App.css";
import "../Styles/addEvent.css";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const EditProjectList = () => {
  const [schoolName, setSchoolName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [projectSector, setProjectSector] = useState("");
  const [totalAmount, setAmount] = useState("");
  const [village, setVillage] = useState("");
  const [zone, setZone] = useState("");
  const [taluk, setTaluk] = useState("");
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
    setTaluk(result.taluk);
    setZone(result.zone);
    setVillage(result.village);
    setProjectType(result.projectType);
    setProjectSector(result.projectSector);
    setAmount(result.totalAmount);
    setItems(result.items);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];

    if (field === 'item') {
      updatedItems[index].item = value;

      if (value === 'Other') {
        updatedItems[index].isOther = true;
        updatedItems[index].item = '';
        updatedItems[index].amount = '';
        updatedItems[index].totalAmount = ''; 
      } else {
        updatedItems[index].isOther = false;

        const selectedItem = AllItems.find(item => item.item === value);
        if (selectedItem) {
          updatedItems[index].amount = selectedItem.cost;
          updatedItems[index].totalAmount = selectedItem.cost * (updatedItems[index].quantity || 0);
        } else {
          updatedItems[index].amount = ''; 
          updatedItems[index].totalAmount = ''; 
        }
      }
    } else if (field === 'quantity') {
      updatedItems[index].quantity = value;
      updatedItems[index].totalAmount = updatedItems[index].amount * value;
    }

    setItems(updatedItems);
  };

  const handleOtherItemChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].item = value;
    updatedItems[index].amount = ''; 
    updatedItems[index].totalAmount = ''; 
    setItems(updatedItems);
  };

  const handleAmountChange = (index, value) => {
    const updatedItems = [...items];
    updatedItems[index].amount = value; 
    updatedItems[index].totalAmount = value * (updatedItems[index].quantity || 0); 
    setItems(updatedItems);
  };

  const getAvailableItems = (index) => {
    const selectedItems = items.map(item => item.item).filter(item => item);
    return AllItems.filter(item => !selectedItems.includes(item.item) || items[index].item === item.item);
  };


  const AddAdminData = async (event, id) => {
    
    event.preventDefault();
    try {
      setSubmited(true);
      const response = await fetch(
        // `http://localhost:2000/admin/editProjectData/${id}/${ID}/${projectType}`,
        `${backendUrl}/admin/editProjectList/${id}/${ID}/${projectType}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer${JSON.parse(localStorage.getItem("token"))}`,
          },
          body: JSON.stringify({
            totalAmount,
            items,
          }),
          credentials: "include",
        }
      );
      
      await response.json();
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
      console.log("Error uploading data", error);
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


                <div className="dynamic-row">
                  <label htmlFor="requirements">Update the requirements</label>

                  {items.map((row, index) => (
                    <div key={index} className="form-row">
                      {row.isNew ? (
                        <>
                          <select
                            value={row.isOther ? 'Other' : row.item}
                            onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                            className="input-field"
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
                      />

                      <input
                        type="number"
                        placeholder="Amount"
                        value={row.isOther ? row.amount : row.amount} // Allow editing for 'Other'
                        onChange={(e) => handleAmountChange(index, e.target.value)}
                        className="input-field"
                        onWheel={(e) => e.target.blur()}
                      />

                      <input
                        type="number"
                        placeholder="Total Amount"
                        value={row.totalAmount}
                        readOnly
                        className="input-field"
                        onWheel={(e) => e.target.blur()}
                      />

                    </div>
                  ))}
                </div>


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
                  className="d-flex align-items-center" 
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
               
              </>
            ) : (
              <></>
            )}
          </>
        ) : projectType === "2" ? (
          <>

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

          </>
        ) : projectType === "3" ? (
          <>
            <h1>Hello</h1>
          </>
        ) : (
          <></>
        )}
        <div className="d-flex justify-content-center pb-3">
            <button
              type="submit"
              className="loader"
              onClick={(event) => AddAdminData(event, params.id)}
              disabled={!isCheckboxChecked || submited}
            >
              {submited ? "Submited.." : "Submit"}
            </button>
        </div>
      </form>
    </>
  );
};

export default EditProjectList;