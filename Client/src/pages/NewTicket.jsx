import DropdownPrimary from "../components/DropdownPrimary";
import { Header } from "../components/Header";

export const NewTicket = (props) => {
  return (
    <>
      <Header loggedIn={props.loggedIn} toggleLogged={props.toggleLogged} />
      <div className="container">
        <form>
          <div className="row">
            <div className="col-sm">
              <DropdownPrimary title="Printer Number" />
            </div>
            <div className="col-sm">
              <input
                className="form-control"
                type="text"
                placeholder="Callback Number"
              />
            </div>
            <DropdownPrimary title="Priority" />
          </div>
          <input
            className="form-control"
            type="text"
            placeholder="Description"
          />
        </form>
      </div>
    </>
  );
};
