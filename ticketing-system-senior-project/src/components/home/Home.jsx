import "./home.css";

export const Home = () => {
  return (
    <div className="jumbotron">
      <h1 className="display-4">Welcome!</h1>
      <p className="lead">
        Select New Ticket to create a new ticket or select My Tickets to view yout tickets.
      </p>
      <hr className="m-4 gap-2" />
      <a className="btn btn-primary btn-lg mr-4" href="#newticket" role="button">
        New
      </a>
      <a className="btn btn-primary btn-lg" href="#dynamicmyticketshere" role="button">
        My Tickets
      </a>
    </div>
  );
};

export default Home;
