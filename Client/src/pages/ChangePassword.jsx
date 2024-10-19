import "./changepassword.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import About from "../components/about/About";

export function ChangePassword(props) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  let navigate = useNavigate();
  useEffect(() => {
    if (!props.loggedIn) {
      return navigate("/");
    }
  }, []);

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  }

  const onMainPasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const onConfPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  }

  const onsubmit = async (e) => {
    e.preventDefault();
    if (password == confPassword) {
      let body = {
        username: username,
        password: password,
      }
      try {
        let result = await axios.post("/user/reset_pass/admin", body);
        console.log(result.data);
        if (result.data.success == "yes") {
          props.setMessageOfTheDay(`Successfully changed password for user ${username}`);
          return navigate("/")
        } else {
          setError(result.data.error);
        }
      } catch (error) {
        setError("post request appears to have failed");
      }
    }
  }

  console.log(error);

  return (
    <>
      <div className="form text-center">
        <div className="container text-center col-md-4">
          <form>
            {error != "" ? (<Alert key={'info'} variant={'info'}>
              {error}
            </Alert>) : <></>}
            <div className="form-group mb-4">
              <label htmlFor="formGroupExampleInput">Enter Username for employee</label>
              <input
                type="text"
                className="shadow form-control"
                id="formGroupExampleInput"
                placeholder="Target Username"
                value={username}
                onChange={onUsernameChange}
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="formGroupExampleInput">Enter new password</label>
              <input
                type="text"
                className="shadow form-control"
                id="formGroupExampleInput"
                placeholder="New password"
                value={password}
                onChange={onMainPasswordChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="formGroupExampleInput2">
                Enter new password again
              </label>
              <input
                type="text"
                className="shadow form-control"
                id="formGroupExampleInput2"
                placeholder="New password"
                value={confPassword}
                onChange={onConfPasswordChange}
              />
            </div>
            <button className="btn btn-primary mt-3" onClick={onsubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
      <About />
    </>
  );
};

export default ChangePassword;
