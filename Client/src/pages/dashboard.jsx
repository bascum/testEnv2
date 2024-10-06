import { Home } from "../components/home/Home";
import { About } from "../components/about/About";

import Alert from "react-bootstrap/Alert";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DropdownPrimary from "../components/dropdowns/DropdownPrimary";

export function Dashboard(props) {
    console.log("arrived at dash\nLogged in: ", props.loggedIn);

    return (
        <>
            {props.messageOfTheDay != "" ? (
                <Alert key={'info'} variant={'info'}>
                    {props.messageOfTheDay}
                </Alert>
            ) : (
                <></>
            )}
            <Home />
            <About />
        </>
    );
}
