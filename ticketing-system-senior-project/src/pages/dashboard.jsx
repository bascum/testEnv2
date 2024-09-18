import { Home } from "../components/home/Home";
import { About } from "../components/about/About";
import { Header } from "../components/header/Header";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard(props) {
    //console.log("arrived at dash\nLogged in: ", props.loggedIn);
    let navigate = useNavigate();
    useEffect(() => { //On page load if user not logged in immediatly redirect to login page
        if (!props.loggedIn) {
            return navigate("/login");
        }
    }, [])
    return (
        <>
            <Header loggedIn={props.loggedIn} toggleLogged={props.toggleLogged}/>
            <Home/>
            <About/>
        </>
    );
}