import { DUMMY_GAMES } from '../../dummy-games.js';
import Game from './components/Game.jsx';
import Carousel from './components/Carousel.jsx';
import { BRANDS_LOGO } from '../../brands-logo.js';
import { EVENT_BANNER } from '../../eventBanner.js';

function HomePage() {
    return (
        <>
            <div className='p-10'>
                <Carousel images={EVENT_BANNER} slidesToShow={1} slidesToScroll={1} dots={false} />
            </div>
            <h1 className='text-3xl font-bold flex justify-center items-center m-10'>Các loại sự kiện</h1>
            <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 m-10'>
                {DUMMY_GAMES.map((game) => (
                    <li key={game.id} >
                        <Game {...game}/>
                    </li>
                ))}
            </ul>
            <div className='bg-gray-100 p-10'>
                <h1 className='text-3xl font-bold flex justify-center items-center m-10'>Các doanh nghiệp đã hợp tác</h1>
                <Carousel images={BRANDS_LOGO} slidesToShow={5} slidesToScroll={5} dots={true} />
            </div>
        </>
    );
}

export default HomePage;
