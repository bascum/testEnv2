import "./header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Header = (props) => {
  let navigate = useNavigate();

  const logOut = async() => { //Used for the logout button to log the user out and redirect to login  page. needs to be connected to server
    let response = await axios.post("/user/logout", {
      username: "",
    })

    if (response.data.success == "yes") {
      props.toggleLogged();
      return navigate("/login");
    } else {
      console.log("Something went wrong: ", response.data.error);
    }
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="../../assets/react.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Ticketing System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {props.loggedIn ? //Will change the wording of the login button. Not really necessary because the user will never see the login button
              (
              <LinkContainer to="/login" onClick={logOut}>
                <Nav.Link>Log Out</Nav.Link>
              </LinkContainer>
            ) : (
              <LinkContainer to="/login" >
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            <NavDropdown title="Menu" id="basic-nav-dropdown">
              <NavDropdown.Item href="#dynamicprofilehere">
                My profile
              </NavDropdown.Item>
              <LinkContainer to="/changepassword" >
                <NavDropdown.Item>
                  Reset password
                </NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#FAQ">FAQ</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
