import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from './slickBtn';

const Carousel = ({ images, slidesToShow, slidesToScroll, dots, right, left }) => {
    const settings = {
        dots: dots,
        infinite: true,
        draggable: true,
        speed: 500,
        autoplay: true, 
        autoplaySpeed: 3000,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToScroll,
        nextArrow: <NextArrow right={right}/>,
        prevArrow: <PrevArrow left={left}/>,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: slidesToScroll,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: slidesToScroll
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: slidesToShow,
                    slidesToScroll: slidesToScroll
                }
            }
        ]
    };

    return (
        <div className="container mx-auto">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} >
                        <img src={image.src} alt={image.alt} className="w-full max-h-[400px] object-cover" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
