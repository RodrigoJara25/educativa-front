import "./NuestrosProductosSection.scss"
import PageSection from "../PageSection/PageSection"
import nuestrosproductos from "../../assets/headers/nuestrosproductos.png"

import img1 from "../../assets/categories/1.png"
import img2 from "../../assets/categories/2.png"
import img3 from "../../assets/categories/3.png"
import img4 from "../../assets/categories/4.png"
import img5 from "../../assets/categories/5.png"
import img6 from "../../assets/categories/6.png"
import img7 from "../../assets/categories/7.png"
import img8 from "../../assets/categories/8.png"
import img9 from "../../assets/categories/9.png"

const categoriesImgs = [img1, img2, img3, img4, img5, img6, img7, img8, img9]

function NuestrosProductosSection() {
    return (
        <>
            <PageSection headerImg={nuestrosproductos} headerAlt="Nuestros Productos">
                <div className="categories-section">
                    <div className="categories-container">
                        {
                            categoriesImgs.map((img, index) => {
                                return <img className="category-card-image" src={img} alt={index} index={index} />
                            })
                        }
                    </div>

                </div>
            </PageSection>


        </>
    )
}

export default NuestrosProductosSection
