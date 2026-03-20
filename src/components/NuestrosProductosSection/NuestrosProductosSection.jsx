import "./NuestrosProductosSection.scss"
import PageSection from "../PageSection/PageSection"
import { useCategories } from "../../context/CategoryContext"
import nuestrosproductos from "../../assets/headers/nuestrosproductos.png"

function NuestrosProductosSection() {

    const { categorias } = useCategories();
    return (
        <>
            <PageSection headerImg={nuestrosproductos} headerAlt="Nuestros Productos">
                <div className="categories-section">
                    <div className="categories-container">
                        {
                            categorias.map((categoria, index) => {
                                return <img className="category-card-image" src={categoria.fotoPortada} alt={index} index={index} />
                            })
                        }
                    </div>

                </div>
            </PageSection>


        </>
    )
}

export default NuestrosProductosSection
