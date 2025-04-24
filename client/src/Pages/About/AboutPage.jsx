import React, { useEffect } from 'react';
import AboutHero from './AboutHero';
import AboutMission from './AboutMission';
import AboutValues from './AboutValues';
import AboutTeam from './AboutTeam';

const AboutPage = () => {
  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  },[])
  return (
    <div className="min-h-screen">
      <AboutHero />
      <AboutMission />
      <AboutValues />
      {/* <AboutTeam /> */}
    </div>
  );
};

export default AboutPage;