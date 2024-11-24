import { Home } from "../components/home/Home";
import { About } from "../components/about/About";

import Alert from "react-bootstrap/Alert";

export function Dashboard(props) {

    return (
        <>
            <Home messageOfTheDay={props.messageOfTheDay} />
        </>
    );
}
