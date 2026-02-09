import "./CategoriesSection.scss";
import hormiga from "../../assets/carousel-categories/hormiga.png"
import CategoriesCarrusel from "../CategoriesCarrusel/CategoriesCarrusel";

function CategoriesSection() {

    return (
        <>
        <section className="categories-container">
            <div className="categories-section">
                <div className="categories-div">
                    <div className="categories-margin">
                        <div className="categorias-text">
                            <h2>Categorías</h2>
                        </div>
                        <div className="categorias-menu-carrusel">
                            <div className="carrusel-categorias">
                                <CategoriesCarrusel></CategoriesCarrusel>
                            </div>
                            <div className="categorias-hormiga">
                                <img src={hormiga} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}

export default CategoriesSection;