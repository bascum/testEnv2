import "./home.css";
import { Link } from "react-router-dom";

export const Home = () => {
  return (

    <div className="jumbotron text-center">
      <h1 className="display-4">Welcome!</h1>
      <p className="lead">
        Select New Ticket to create a new ticket or select My Tickets to view
        your tickets.
      </p>
      <hr className="m-4 gap-2" />
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
  );
};

export default Home;
