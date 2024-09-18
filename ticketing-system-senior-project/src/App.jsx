import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Dashboard } from "./pages/dashboard";
import { Login } from "./pages/login";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

function App() {
  const [loggedIn, setLoggedIn] = useState(false); //Use state to ell if a user is logged in. Will be necessary to redirect properly

  const toggleLogged = () => {
    //console.log("Logged in: ", loggedIn)
    setLoggedIn(!loggedIn);
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard loggedIn={loggedIn} toggleLogged={toggleLogged} />
          }
        />
        <Route
          path="/login"
          element={<Login loggedIn={loggedIn} toggleLogged={toggleLogged} />}
        />
      </Routes>
    </>
  );
}

export default App;
