import './NavBar.scss'
import logoEducativa from "../../assets/images/logo.png"
import inicio from "../../assets/images/inicio.png"
import quienes_somos from "../../assets/images/quienes_somos.png"
import productos from "../../assets/images/productos.png"
import pedidos_distribuidores from "../../assets/images/pedidos_distribuidores.png"
import contactenos from "../../assets/images/contactenos.png"
import tiktok from "../../assets/images/tiktok-logo.png"
import facebook from "../../assets/images/fb-logo.png"

function NavBar() {
    return (
        <>
        <div className='navbar'>
            <div className='logo'>
                <img src={logoEducativa} alt="logo" className='logo-img'/>
            </div>
            <div className='paginas'>
                <ul>
                    <li>
                        <img src={inicio} alt="inicio" />
                    </li>
                    <li>
                        <img src={quienes_somos} alt="quienes-somos" />
                    </li>
                    <li>
                        <img src={productos} alt="productos" />
                    </li>
                    <li>
                        <img src={pedidos_distribuidores} alt="pedidos-distribuidores" />
                    </li>
                    <li>
                        <img src={contactenos} alt="contactenos" />
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