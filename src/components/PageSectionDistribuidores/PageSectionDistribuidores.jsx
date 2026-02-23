import "./PageSectionDistribuidores.scss"

function PageSectionDistribuidores({ titulo, children, onContinuar, onRetroceder }) {
    return (
        <div className="div-page-section-distribuidores">
            <div className="page-section-distribuidores">
                <div className="div-verde-page-section-distribuidores"></div>
                <div className="div-contenedor-page-section-distribuidores">
                    <div className="page-section-header-distribuidores">
                        <h1 className="page-section-titulo-distribuidores">{titulo}</h1>
                    </div>
                    <div className="botones-continuar-anterior">
                        <button type="button" className="btn-anterior" onClick={onRetroceder}>ANTERIOR</button>
                        <button type="button" className="btn-continuar" onClick={onContinuar}>CONTINUAR</button>
                    </div>
                    <div className="linea-marron-distribuidores"></div>
                    <div className="div-contenido-distribuidores">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageSectionDistribuidores
