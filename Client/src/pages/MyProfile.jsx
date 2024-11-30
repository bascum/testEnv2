import "../App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

export const MyProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    employeeID: "",
    phoneNumber: "",
    username: "",
    departmentNumber: ""
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    let result = (await axios.get("/user/get_profile")).data;
    if (result.success == "yes") {
      setProfile({
        name: result.profile[0].name,
        employeeID: result.profile[0].employeeID,
        phoneNumber: result.profile[0].phoneNumber,
        username: result.profile[0].username,
        departmentNumber: result.profile[0].departmentNumber
      });
    }
  };

  return (
    <div className="body">
      <div className="card shadow">
        <div className="card-body">
          <h5 className="card-title mb-4">My Profile</h5>
          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                type="text"
                value={profile.name}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Employee ID</label>
              <input
                className="form-control"
                type="text"
                value={profile.employeeID}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                className="form-control"
                type="text"
                value={profile.phoneNumber}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                className="form-control"
                type="text"
                value={profile.username}
                disabled
                readOnly
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department Number</label>
              <input
                className="form-control"
                type="text"
                value={profile.departmentNumber}
                disabled
                readOnly
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
