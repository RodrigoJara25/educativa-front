import { Navigation, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/navigation';
import "./Carrusel.scss";
import carrusel1 from "../../assets/images/1.png";
import carrusel2 from "../../assets/images/4.png";

function Carrusel() {

    // carrusel con swiperjs, con 1 imagen por slide, con flechas de navgeacion, sin paginacion, con loop infinito, autoplay cada 4 segundos

    return (
        <>
        <div className="carrusel">
        <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween
            slidesPerView={1}
            navigation
            loop
            autoplay={{ delay: 4000 }}
        >
            <SwiperSlide><img src={carrusel1} alt="Slide 1" /></SwiperSlide>
            <SwiperSlide><img src={carrusel2} alt="Slide 2" /></SwiperSlide>
        </Swiper>
        </div>
        </>
    )
}

export default Carrusel;