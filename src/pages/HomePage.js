import React from "react";
import '../styles/HomePage.css'
import Header from "../components/home-page/header/Header";
import Hero from "../components/home-page/hero/Hero";

const HomePage = () =>{
    return(
        <div>
            <Header/>
            <Hero/>
        </div>
    );
};

export default HomePage;