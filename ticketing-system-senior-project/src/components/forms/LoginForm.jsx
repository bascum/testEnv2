import {usestate} from "react";


const LoginForm = () => {

  const [username, setUsername] = useState("");

  const usernameBoxChangeHandler = (e) => {
    e.preventDefault();

    console.log(e);
  }
  return (
    <form>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Username</label>
        <input
          type="text"
          className="form-control"
          aria-label="Username"
          aria-describedby="basic-addon1"
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
        />
      </div>
      <div className="form-group form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="exampleCheck1"
        />
      </div>
      <button type="submit" className="btn btn-primary" href="/">
        Submit
      </button>
    </form>
  );
};

export default LoginForm;
