
import ListItemBig from "../listitem-big-component/listitem-big-component.tsx";
import ListItem from "../listitem-component/Listitem-component.tsx"
import './list-component.css'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 10
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 6
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};
//TODO MY STEAM GAMES SOLLTE IMMER GROß GERENDERED WERDEN!!WENN DER USER MEHR ALS 4 SPIELE HAT, WIRD NUR DIE SHOPPING CARD ANGEZEIGT! EVTL UMZIEHEN IN NEUEN COMPONENT
//games.results
function List ({games}) {
  if (!games) {
    return <div>Still loading the games...</div>;
  }
  if(games.results && games.results.length <= 4){
    return (
      
      <div className= 'list-row'>
        <div className='list-big' >
          <>
            {games.results &&
                games.results.map((game: any) => (
                  <ListItemBig key={game.id} game={game} />
            ))}
          </>
        </div>
      </div>
    )} if (games.results && games.results.length > 4)  {
      return (
        <div className= 'list-row'>

          <Carousel responsive ={responsive}
         containerClass="customCarouselContainer">

          
            {games.results &&
              games.results.map((game: any) => (
                <ListItem key={game.id} game={game} />
              ))}

           </Carousel>
           </div>

      )
    }
  }


export default List
