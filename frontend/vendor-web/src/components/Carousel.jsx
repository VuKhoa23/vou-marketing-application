import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NextArrow, PrevArrow } from './slickBtn'; 

const Carousel = ({ images, slidesToShow, slidesToScroll, dots }) => {
    const settings = {
        dots: dots,
        infinite: true,
        draggable: true,
        speed: 500,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToScroll,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
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
        <div className="container mx-auto p-4">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="p-2">
                        <img src={image.src} alt={image.alt} className="w-full h-auto" />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
