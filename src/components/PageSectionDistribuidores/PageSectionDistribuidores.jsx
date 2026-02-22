import "../PageSection/PageSection.scss"
import "./PageSectionDistribuidores.scss"

function PageSectionDistribuidores({ titulo, children }) {
    return (
        <div className="page-section">
            <div className="div-verde"></div>
            <div className="div-contenedor">
                <div className="page-section-images">
                    <h1 className="page-section-titulo">{titulo}</h1>
                </div>
                <div className="linea-marron"></div>
                <div className="div-contenido">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default PageSectionDistribuidores
