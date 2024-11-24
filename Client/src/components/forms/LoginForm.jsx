import "./loginform.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import About from "../about/About";

const LoginForm = (props) => {
  console.log("back at login\nLoggedin: ", props.loggedIn);
  let navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState(null);

  const usernameBoxChangeHandler = (e) => {
    setUsername(e.target.value);
  };

  const passwordBoxChangeHandler = (e) => {
    setPass(e.target.value);
    console.log(password);
  };

  const submitUsernameAndPass = async (e) => {
    setError(null);
    e.preventDefault();
    let body = {
      username: username,
      password: password,
    };
    try {
      let result = await axios.post("/user/login", body);

      if (result.data.success == true) {
        props.setMessageOfTheDay("Logged in successfully");
        props.toggleLogged();
        props.setCurrentUser(result.data.user);
        return navigate("/");
      } else if (result.data == false) {
        setError("Incorrect login info");
      }
    } catch {
      setError("Unable to check username");
    }
  };



  return (
    <>
      <div className="form text-center pt-5">
        <div className="container text-center col-md-4">
          <form>
            <div className="form-group mb-4">
              <label id="userlabel" htmlFor="userlabel">Username</label>
              <input
                id="username"
                autoComplete="username"
                type="text"
                className="shadow form-control"
                aria-label="Username"
                aria-describedby="basic-addon1"
                value={username}
                onChange={usernameBoxChangeHandler}
              />
              <small id="emailHelp" className="form-text text-muted">
                If you don't have an account, please contact your system administrator.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="shadow form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={passwordBoxChangeHandler}
              />
            </div>
            {/* <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="exampleCheck1"
        />
      </div> */}
            <button
              className="btn btn-primary mt-3"
              href="/"
              onClick={submitUsernameAndPass}
            >
              Submit
            </button>
          </form>
          <div id="error" className="form-text text-danger">
            {error}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
