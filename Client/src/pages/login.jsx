import "../App.css";
import LoginForm from "../components/forms/LoginForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export function Login(props) {
  console.log("Login Page Rendered");

  let navigate = useNavigate();
  useEffect(() => {
    if (props.loggedIn) {
      return navigate("/");
    }
  }, []);

  return (
    <>
    <div className="body">
      <div className="container text-center">
      <LoginForm
        toggleLogged={props.toggleLogged}
        loggedIn={props.loggedIn}
        setMessageOfTheDay={props.setMessageOfTheDay}
        setCurrentUser={props.setCurrentUser}
      />
      </div>
    </div>
    </>
  );
}
