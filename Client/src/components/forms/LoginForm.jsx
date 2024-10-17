import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

      console.log(result.data);
      if (result.data == true) {
        props.setMessageOfTheDay("Logged in successfully");
        props.toggleLogged();
        return navigate("/");
      } else if (result.data == false){
        setError("Incorrect login info");
      }
    } catch {
      setError("Unable to check username");
    }
  };



  return (
    <>
    <div className="container text-center col-md-4">
    <form>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Username</label>
        <input
          type="text"
          className="form-control"
          aria-label="Username"
          aria-describedby="basic-addon1"
          value={username}
          onChange={usernameBoxChangeHandler}
        />
        <small id="emailHelp" className="form-text text-muted">
          We&apos;ll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type="password"
          className="form-control"
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
      <small id="emailHelp" className="form-text text-muted text-danger">
        {error}
      </small>
    </form>
    </div>
    </>
  );
};

export default LoginForm;
