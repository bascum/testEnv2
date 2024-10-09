import { Home } from "../components/home/Home";
import { About } from "../components/about/About";

import Alert from "react-bootstrap/Alert";

export function Dashboard(props) {

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
