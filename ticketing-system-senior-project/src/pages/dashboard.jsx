import { Link, Route, Routes } from "react-router-dom";
import { Home } from "../components/home/Home";
import { About } from "../components/about/About";
import { Header } from "../components/header/Header";

export function Dashboard() {
    return (
        <>
            <Header/>
            <Home/>
            <About/>
        </>
    );
}