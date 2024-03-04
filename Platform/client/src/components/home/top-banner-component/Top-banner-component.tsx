import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './top-banner-component.css';
import { FaRegCircleStop } from "react-icons/fa6";
import { IoVolumeMute, IoVolumeHigh, IoPlayCircleOutline } from "react-icons/io5";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 1 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
};

function TopBanner({ games }) {
  const [topTrailers, setTopTrailers] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (games && games.results) {
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

  const handlePlayPauseToggle = (index) => {
    const videoElement = document.getElementById(`top-banner-${index}`);
    if (videoElement) {
      if (videoElement.paused || !isPlaying) {
        videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    topTrailers.forEach((_, index) => {
      const videoElement = document.getElementById(`top-banner-${index}`);
      if (videoElement) {
        videoElement.muted = !isMuted;
      }
    });
  };

  const ButtonGroup = ({ goToSlide }) => {
    return (
      <div className="custom-pagination">
        {topTrailers.map((_, index) => (
          <div
            key={index}
            className={`custom-pagination-line ${activeIndex === index ? 'active' : ''}`}
            onClick={() => {
              goToSlide(index);
              setActiveIndex(index); // Update the active index on click
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="myUniqueCarousel container">
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={false}
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile", "desktop", "superLargeDesktop"]}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={5500}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        beforeChange={(previousSlide, nextSlide) => setActiveIndex(nextSlide)}
        customButtonGroup={<ButtonGroup goToSlide={(index) => setActiveIndex(index)} />}
      >
        {topTrailers.map((item, index) => (
          <div key={index} className="carousel-item">
            {item.type === 'video' ? (
              <div className="video-container">
                <video
                  ref={el => el && (el.muted = isMuted)}
                  loop
                  id={`top-banner-${index}`}
                  src={item.src}
                  autoPlay={isPlaying}
                  playsInline
                  className='video-element'
                />
                  <div className="grad"></div>
                <div className="controls">
                  {isPlaying ? (
                    <FaRegCircleStop className="control-button" onClick={() => handlePlayPauseToggle(index)} />
                  ) : (
                    <IoPlayCircleOutline className="control-button" onClick={() => handlePlayPauseToggle(index)} />
                  )}
                  {isMuted ? (
                    <IoVolumeMute className="control-button" onClick={handleMuteToggle} />
                  ) : (
                    <IoVolumeHigh className="control-button" onClick={handleMuteToggle} />
                  )}
                </div>
              </div>
            ) : (
              <div className="image-container">
                <img src={item.src} alt="Game background" className='image-element' />
                <div className="grad"></div>

              </div>
            )}
            <div className="game-title-container">
              <h2 id='game-name-header'>Play games such as {games.results[index]?.name}</h2>
              <p id='game-description-header'>Unlock limitless gaming on Mac with our $4/month pay-as-you-go service. Play at your pace, pay for what you love.</p>
            </div>
            <button id='signup'>Sign up today</button>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default TopBanner;
