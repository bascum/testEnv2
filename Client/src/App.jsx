import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Dashboard } from "./pages/Dashboard";
import { Header } from "./components/header/Header";
import { Login } from "./pages/login";
import { NewTicket } from "./pages/NewTicket";
import { MyTickets } from "./pages/MyTickets";
import { CreateUser } from "./pages/CreateUser";
import Faq from "./pages/Faq";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import ChangePassword from "./pages/ChangePassword";
import MyProfile from "./pages/MyProfile";
import { Container } from "react-bootstrap";

const testUser = {
  username: "admin",
  name: "admin",
  type: 4,
  id: 6
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false); //Use state to ell if a user is logged in. Will be necessary to redirect properly
  const [messageOfTheDay, setMessageOfTheDay] = useState(""); //Dashboard will display message of the day at the top of the page. send setmessage doen to other pages so when they redirect to dashboard they can set a message for dashboard to display
  const [currentUser, setCurrentUser] = useState(null);

  const toggleLogged = () => {
    //console.log("Logged in: ", loggedIn)
    setLoggedIn(!loggedIn);
  };

  return (
    <div className="main">
      <Header
        loggedIn={loggedIn}
        toggleLogged={toggleLogged}
        currentUser={currentUser}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              loggedIn={loggedIn}
              toggleLogged={toggleLogged}
              messageOfTheDay={messageOfTheDay}
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login
              loggedIn={loggedIn}
              toggleLogged={toggleLogged}
              setMessageOfTheDay={setMessageOfTheDay}
              setCurrentUser={setCurrentUser}
            />
          }
        />
        <Route path="/faq" element={<Faq currentUser={currentUser} />} />
        <Route
          path="/myprofile"
          element={<MyProfile currentUser={currentUser} />}
        />
        <Route
          path="/newticket"
          element={<NewTicket setMessageOfTheDay={setMessageOfTheDay} />}
        />
        <Route
          path="/mytickets"
          element={<MyTickets currentUser={currentUser} setMessageOfTheDay={setMessageOfTheDay} />}
        />
        <Route
          path="/changepassword"
          element={<ChangePassword loggedIn={loggedIn} setMessageOfTheDay={setMessageOfTheDay}/>}
        />
        <Route
          path="/createuser"
          element={
            <CreateUser
              loggedIn={loggedIn}
              setMessageOfTheDay={setMessageOfTheDay}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
