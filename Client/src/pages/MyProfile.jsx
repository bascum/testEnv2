import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export const MyProfile = () => {
  const [name, setName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [departmentNumber, setDepartmentNumber] = useState("");

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    let result = (await axios.get("/users/get_profile")).data;
    console.log(result);
    if (result.success == "yes") {
      setName(result.name);
      setEmployeeID(result.employeeID);
      setPhoneNumber(result.phoneNumber);
      setUsername(result.username);
      setDepartmentNumber(result.departmentNumber);
    }
  };

  return (
    <div className="containter m-4">
      <div className="card shadow">
        <div className="card-body">
          <form>
            <h5 className="card-title mb-4">My Profile</h5>
            <input
              className="form-control"
              type="text"
              value={name}
              aria-label="Disabled input example"
              disabled
              readOnly
            ></input>
            <input
              className="form-control"
              type="text"
              value={employeeID}
              aria-label="Disabled input example"
              disabled
              readOnly
            ></input>
            <input
              className="form-control"
              type="text"
              value={phoneNumber}
              aria-label="Disabled input example"
              disabled
              readOnly
            ></input>
            <input
              className="form-control"
              type="text"
              value={username}
              aria-label="Disabled input example"
              disabled
              readOnly
            ></input>
            <input
              className="form-control"
              type="text"
              value={departmentNumber}
              aria-label="Disabled input example"
              disabled
              readOnly
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
