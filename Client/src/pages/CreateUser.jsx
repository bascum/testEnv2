import DropdownPrimary from "../components/dropdowns/DropdownPrimary";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const CreateUser = ({ setMessageOfTheDay, loggedIn }) => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    callback: "",
    dep_num: 0,
    type: 0,
    name: "",
  });

  const [deps, setDeps] = useState([]);
  const type = [
    {
      name: "Standard User",
      value: 1,
    },
    {
      name: "Department Head",
      value: 2,
    },
    {
      name: "Tech",
      value: 3,
    },
    {
      name: "Super Admin",
      value: 4,
    },
  ];

  const convertDeps = (deps) => {
    return deps.map((dep) => {
      // Destructure the dep object, replacing 'id' with 'value'
      const { dep_id, ...rest } = dep;
      return { value: dep_id, ...rest };
    });
  };

  const getDeps = async () => {
    let response = await axios.get("/user/departments");
    if (response.status === 200) {
      let deps = convertDeps(response.data);
      console.log("deps", deps);
      setDeps(deps);
    }
  };

  const handleChange = (e, declaredName = "") => {
    e.preventDefault();
    console.log(e.target);
    let { name, value } = e.target;
    if (declaredName != "") {
      name = declaredName;
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    console.log(`${name} changed to ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.username != "" &&
      formData.password != "" &&
      formData.dep_num != 0 &&
      formData.type != 0 &&
      formData.name != ""
    ) {
      try {
        let returned = await axios.post("/user/create", formData);
        if (returned.data.success == "yes") {
          setMessageOfTheDay(`User ${formData.username} created Successfully`);
          return navigate("/");
        }
      } catch (err) {
        setMessageOfTheDay("Something went wrong");
        return navigate("/");
      }
    }
  };

  return (
    <div className="body">
      <div className="container">
        <h2 className="mb-4">User Information Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Department:
            </label>
            <DropdownPrimary
              listOfValues={deps ? deps : []}
              selected={
                formData.dep_num != 0
                  ? deps[formData.dep_num - 1].name
                  : "Please Select a Dep"
              }
              onSelect={(e) => {
                handleChange(e, "dep_num");
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="type" className="form-label">
              Employee Type:
            </label>
            <DropdownPrimary
              listOfValues={type}
              selected={
                formData.type != 0
                  ? type[formData.type - 1].name
                  : "Please Select a Employee Type"
              }
              onSelect={(e) => {
                handleChange(e, "type");
              }}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="callback" className="form-label">
              Callback:
            </label>
            <input
              type="text"
              id="callback"
              name="callback"
              className="form-control"
              value={formData.callback}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            key={10000}
            id="submit-button"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
