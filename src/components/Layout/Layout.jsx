import "./Layout.scss"
import { useCategories } from "../../context/CategoryContext";
import { Link } from "react-router-dom";

function Layout({ children }) {
    const { categorias, loading } = useCategories();
    return (
        <>
            <div className="layout">
                <div className="layout-80">
                    <div className="layout-margin">
                        <div className="layout-container">
                            <div className="categorias-menu">
                                <ul>
                                    {loading ? (
                                        <li>Cargando...</li>
                                    ) : (
                                        categorias.map((cat) => (
                                            <li key={cat._id}>
                                                <Link to={`/categoria/${cat._id}`}>
                                                    {cat.nombre}
                                                </Link>
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                            <div className="layout-general">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Layout;