import "./home.css";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";

export const Home = (props) => {
  return (
    <>
      <div className="jumbotron text-center">
      {props.messageOfTheDay != "" ? (
                <Alert key={'info'} variant={'info'}>
                    {props.messageOfTheDay}
                </Alert>
            ) : (
                <></>
            )}
        <h1 className="display-4 pt-5">Welcome!</h1>
        <p className="lead pt-2 pb-5">
          Select New to create a new ticket or select My Tickets to view your
          tickets.
        </p>
        <hr className="m-4 gap-2" />
        <div className="d-flex justify-content-center p-5">
          <Link
            className="btn btn-primary btn-lg mx-5 px-4"
            to="/newticket"
            role="button"
          >
            New
          </Link>
          <Link
            className="btn btn-primary btn-lg"
            to="/mytickets"
            role="button"
          >
            My Tickets
          </Link>
        </div>
      </div>
    </>
  );
};

Home.propTypes = {
  messageOfTheDay: PropTypes.string.isRequired,
};