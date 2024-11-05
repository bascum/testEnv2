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
    let result = (await axios.get("/users/get_profile")).data;
    if (result.success === "yes") {
      setProfile({
        name: result.name,
        employeeID: result.employeeID,
        phoneNumber: result.phoneNumber,
        username: result.username,
        departmentNumber: result.departmentNumber
      });
    }
  };

  return (
    <div className="container m-4">
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
