import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './listitem-component.css';
import { TiShoppingCart } from "react-icons/ti";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../../AppContext.tsx'; // Import the context hook

function ListItem({ game }) {

  const navigate = useNavigate();

  const linkToSteamStore = () => {
    fetch(`https://api.rawg.io/api/games/${game.id}/stores?key=${process.env.REACT_APP_RAWG_API_KEY}`, {
      method: 'GET',
    })

      .then((response) => response.json())
      .then((data) => {
        console.log(data.results)
        // Find the Steam store link
        console.log(data);
        const steamStore = data.results.find(store => store.store_id === 1);
        if (steamStore && steamStore.url) {
          window.location.href = steamStore.url; // Redirect to the Steam store
        } else {
          console.log('Steam store link not found');
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

 


  return (
    <>
    <div id='box-container'>
      <div id='info-box'>
        <LazyLoadImage
          className='small-image-info'
          src={game.background_image}
          alt={game.name} 
          effect="blur" 
        />
        <h2>{game.name}</h2>
        <div id='info-details'>
          <p>Rating {game.rating}</p>
        </div>
        <div id='play-rating'>
          <TiShoppingCart id='shoppingcart-icon' onClick={linkToSteamStore} />

        </div>
      </div>
      <LazyLoadImage
        className='small-image'
        src={game.background_image}
        alt={game.name} // use game.name for alt text
        effect="blur" // Optional effect
      />
    </div>
    </>
  )
}

export default ListItem;