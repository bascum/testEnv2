import DropdownPrimary from "../components/dropdowns/DropdownPrimary";
import { Header } from "../components/header/Header";

export const NewTicket = () => {
  return (
    <>
    <Header/>
    <DropdownPrimary/>
    <input className="form-control" type="text" placeholder="Default input" />

    </>
  );
};

