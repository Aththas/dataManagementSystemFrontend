import React from "react";
import '../styles/HomePage.css'
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";

const HomePage = () =>{
    return(
        <div>
            <Header/>
            <Hero/>
            <Footer/>
        </div>
    );
};

export default HomePage;