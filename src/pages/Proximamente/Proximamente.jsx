import './Proximamente.scss'

function Proximamente({ modulo }) {
    return (
        <div className="proximamente-wrapper">
            <div className="proximamente-card">
                <div className="icono-animado">🚀</div>
                <h1 className="titulo">
                    Módulo de <span>{modulo}</span>
                </h1>
                <p className="descripcion">
                    Estamos construyendo esta sección para brindarte la mejor experiencia. ¡Muy pronto podrás gestionar todo desde aquí!
                </p>
                <div className="loader-animado">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
    )
}

export default Proximamente