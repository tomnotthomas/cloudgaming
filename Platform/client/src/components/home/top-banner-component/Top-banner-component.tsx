// top-banner-component.js

import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './top-banner-component.css';
import { FaRegCircleStop } from "react-icons/fa6";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

function TopBanner({ games }) {
  const [topTrailers, setTopTrailers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (games && games.results) {
      console.log(games.results);
      const fetchTrailersAndImages = async () => {
        const trailersAndImages = await Promise.all(
          games.results.slice(0, 8).map(async (game) => {
            try {
              const response = await fetch(`https://api.rawg.io/api/games/${game.id}/movies?key=${process.env.REACT_APP_RAWG_API_KEY}`);
              const data = await response.json();
              const trailer = data.results?.[0]?.data?.max;
              return {
                type: trailer ? 'video' : 'image',
                src: trailer || game.background_image,
              };
            } catch (error) {
              console.error('Error fetching trailers:', error);
              // Fallback to background image in case of any error
              return {
                type: 'image',
                src: game.background_image,
              };
            }
          })
        );
        setTopTrailers(trailersAndImages);
      };

      fetchTrailersAndImages();
    }
  }, [games]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div id='container'>
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={false} // Disable default dots
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile", "desktop", "superLargeDesktop"]}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5500}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        afterChange={(nextSlide) => setActiveIndex(nextSlide)}
      >
       {topTrailers.map((item, index) => (
          <div key={index} className="carousel-item">
          {item.type === 'video' ? (
              <div className="video-container">
              <video loop id='top-banner' src={item.src} autoPlay muted />
              <div className="controls">
                <FaRegCircleStop className="control-button" />

                <button className="control-button">Mute/Unmute</button>
              </div>
            </div>          ) : (
            <div className="image-container">

            <img src={item.src} alt="Game background" id='top-banner' />
            <div id="grad"></div>
            </div>
          )}
    <div className="game-title-container">
    <h2 id='game-name-header'>Play games such as {games.results[index].name}</h2>
      <p id='game-name-header'>Unlock limitless gaming on Mac with our $4/month pay-as-you-go service. Play at your pace, pay for what you love.</p>
      
      </div>
      <button id='signup'>Sign up today</button>
 {/* Display game title */}
  </div>
))}

      </Carousel>
      
      {/* Custom pagination indicators */}
      <div className="custom-pagination">
        {topTrailers.map((_, index) => (
          <div
            key={index}
            className={`custom-pagination-line ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default TopBanner;
