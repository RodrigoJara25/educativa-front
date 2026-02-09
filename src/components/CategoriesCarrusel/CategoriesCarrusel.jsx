import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./CategoriesCarrusel.scss";

// imagenes de categorias
import cover1 from "../../assets/carousel-categories/diccionarios.png";
import cover2 from "../../assets/carousel-categories/ecologicos.png";
import cover3 from "../../assets/carousel-categories/laminas.png";
import cover4 from "../../assets/carousel-categories/laminas2.png";
import cover5 from "../../assets/carousel-categories/obras.png";
import cover6 from "../../assets/carousel-categories/selectos.png";

const covers = [cover1, cover2, cover3, cover4, cover5, cover6];

function CategoriesCarrusel() {
    const swiperRef = useRef(null);

    return (
        <div className="categories-carousel">
            <button
                className="custom-prev"
                onClick={() => swiperRef.current?.slidePrev()}
            >
                &#8249;
            </button>
            <div className="swiper-wrapper-container">
                <Swiper
                    onSwiper={(swiper) => { swiperRef.current = swiper; }}
                    // slidesPerView={6}
                    spaceBetween={10}
                    loop={false}
                    breakpoints={{
                        320: { slidesPerView: 2, spaceBetween: 12 },
                        640: { slidesPerView: 3, spaceBetween: 16 },
                        900: { slidesPerView: 4, spaceBetween: 20 },
                        1260: { slidesPerView: 5, spaceBetween: 20 },
                        1380: { slidesPerView: 6, spaceBetween: 20 },
                    }}
                >
                    {covers.map((src, i) => (
                        <SwiperSlide key={i} className="categories-slide">
                            <img src={src} alt={`Categoría ${i + 1}`} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <button
                className="custom-next"
                onClick={() => swiperRef.current?.slideNext()}
            >
                &#8250;
            </button>
        </div>
    );
}

export default CategoriesCarrusel;