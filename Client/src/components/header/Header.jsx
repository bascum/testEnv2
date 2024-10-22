import "./header.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import ticket from "../../assets/ticket.svg";

export const Header = (props) => {
  let navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    if (!props.loggedIn) {
      return navigate("/login");
    }
  }, [props.loggedIn, navigate]);

  const logOut = async () => {
    let response = await axios.post("/user/logout", {
      username: "",
    });

    if (response.data.success === "yes") {
      props.toggleLogged();
      return navigate("/login");
    } else {
      console.log("Something went wrong: ", response.data.error);
    }
  };

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>
            <img
              alt=""
              src={ticket}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Ticketing System
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/" className={location.pathname === "/" ? "active" : ""}>
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            {props.loggedIn ? (
              <LinkContainer to="/login" onClick={logOut}>
                <Nav.Link>Log Out</Nav.Link>
              </LinkContainer>
            ) : (
              <LinkContainer to="/login" className={location.pathname === "/login" ? "active" : ""}>
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            )}
            <NavDropdown title="Menu" id="basic-nav-dropdown">
              <LinkContainer to="/myprofile">
                <NavDropdown.Item>My profile</NavDropdown.Item>
              </LinkContainer>
              <LinkContainer to="/changepassword">
                <NavDropdown.Item>Reset password</NavDropdown.Item>
              </LinkContainer>
              <NavDropdown.Divider />
              <LinkContainer to="/faq">
                <NavDropdown.Item>FAQ</NavDropdown.Item>
              </LinkContainer>
              {props.currentUser != null ? (props.currentUser.type > 2 ? (
                <LinkContainer to="/create_user">
                <NavDropdown.Item>Create User</NavDropdown.Item>
              </LinkContainer>
              ) : (<></>)) : (<></>)}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;