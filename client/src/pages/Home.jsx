import React from 'react';
import './stylesheets/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/shared/Footer';
import Hero from './homeSections/Hero';
import About from './homeSections/About';
import CTA from './homeSections/CTA';



  const Home = () => {
    return (
      <div className="home-container">
        <Hero/>
        <About/>
        <CTA/>
        <Footer/>
      </div>
    );
};

export default Home;