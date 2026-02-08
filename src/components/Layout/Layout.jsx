import "./Layout.scss"

function Layout({ children }) {
    const categorias = ['Diccionarios', 'Láminas', 'Cuentos Clásicos', 'Obras Literarias', 'Cuentos Selectos', 'Cuentos Ecológicos', 'Cuentos Educativos', 'Cuentos Infantiles']
    return (
        <>
        <div className="layout">
            <div className="layout-80">
                <div className="layout-margin">
                    <div>
                        <div className="categorias-menu">
                            <ul>
                                {
                                    categorias.map((palabra, index) => (
                                        <li key={index}>
                                            {palabra}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        <div className="contenido">

                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Layout;