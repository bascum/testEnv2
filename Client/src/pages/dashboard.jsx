import { Home } from "../components/Home";
import { About } from "../components/About";
import { Header } from "../components/Header";
import Alert from "react-bootstrap/Alert";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownPrimary from "../components/DropdownPrimary";

export function Dashboard(props) {
    console.log("arrived at dash\nLogged in: ", props.loggedIn);
    let navigate = useNavigate();
    useEffect(() => {
        //On page load if user not logged in immediatly redirect to login page
        if (!props.loggedIn) {
            return navigate("/login");
        }
    }, []);

    return (
        <>
            {props.messageOfTheDay != "" ? (
                <Alert key={'info'} variant={'info'}>
                    {props.messageOfTheDay}
                </Alert>
            ) : (
                <></>
            )}
            <Header loggedIn={props.loggedIn} toggleLogged={props.toggleLogged} />
            <Home />
            <About />
        </>
    );
}
