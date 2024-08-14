import React from "react";
import '../styles/HomePage.css'
import Header from "../components/home-page/header/Header";
import Hero from "../components/home-page/hero/Hero";
import Footer from "../components/home-page/footer/Footer";

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