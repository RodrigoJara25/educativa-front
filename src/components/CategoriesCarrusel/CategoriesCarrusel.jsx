import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCategories } from "../../context/CategoryContext";
import "swiper/css";
import "./CategoriesCarrusel.scss";

function CategoriesCarrusel() {

    const { categorias } = useCategories();

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
                    loop={false}
                    // breakpoints={{
                    //     320: { slidesPerView: 2, spaceBetween: 12 },
                    //     640: { slidesPerView: 3, spaceBetween: 16 },
                    //     900: { slidesPerView: 4, spaceBetween: 20 },
                    //     1260: { slidesPerView: 5, spaceBetween: 20 },
                    //     1380: { slidesPerView: 6, spaceBetween: 50 },
                    // }}
                    slidesPerView={'auto'} // Esto quita el width fijo y pone 'auto'
                    spaceBetween={15}       // Esto quita el margin-right
                >
                    {categorias.map((categoria, i) => (
                        <SwiperSlide key={i} className="categories-slide">
                            <img src={categoria.fotoPortada} alt={`Categoría ${i + 1}`} />
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