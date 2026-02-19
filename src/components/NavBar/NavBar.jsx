import './NavBar.scss'
import logoEducativa from "../../assets/images/logo.png"
import inicio from "../../assets/images/inicio.png"
import quienes_somos from "../../assets/images/quienes_somos.png"
import productos from "../../assets/images/productos.png"
import pedidos_distribuidores from "../../assets/images/pedidos_distribuidores.png"
import contactenos from "../../assets/images/contactenos.png"
import tiktok from "../../assets/images/tiktok-logo.png"
import facebook from "../../assets/images/fb-logo.png"
import { Link } from 'react-router-dom'

function NavBar() {
    return (
        <>
            <div className='navbar'>
                <div className='logo'>
                    <img src={logoEducativa} alt="logo" className='logo-img' />
                </div>
                <div className='paginas'>
                    <ul>
                        <li>
                            <Link to="/">
                                <img src={inicio} alt="inicio" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/quienes-somos">
                                <img src={quienes_somos} alt="quienes-somos" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/productos">
                                <img src={productos} alt="productos" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/pedidos-distribuidores">
                                <img src={pedidos_distribuidores} alt="pedidos-distribuidores" />
                            </Link>
                        </li>
                        <li>
                            <Link to="/contactenos">
                                <img src={contactenos} alt="contactenos" />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className='redes-sociales'>
                    <ul>
                        <li>
                            <img src={tiktok} alt="tiktok" />
                        </li>
                        <li>
                            <img src={facebook} alt="facebook" />
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default NavBar;