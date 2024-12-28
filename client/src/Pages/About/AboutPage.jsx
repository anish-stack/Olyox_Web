import React from 'react';
import AboutHero from './AboutHero';
import AboutMission from './AboutMission';
import AboutValues from './AboutValues';
import AboutTeam from './AboutTeam';

const AboutPage = () => {
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