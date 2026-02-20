import "./PageSection.scss"
import bgImage from "../../assets/headers/bg-section.png"

function PageSection({ headerImg, headerAlt, children }) {
    return (
        <div className="page-section">
            <div className="div-verde"></div>
            <div className="div-contenedor">
                <div className="page-section-images">
                    <img src={bgImage} alt="" className="bgImage" />
                    <img src={headerImg} alt={headerAlt} className="page-section-header" />
                </div>
                <div className="linea-marron"></div>
                <div className="div-contenido">
                    {children}  {/* ← contenido diferente por página */}
                </div>
            </div>
        </div>
    )
}

export default PageSection