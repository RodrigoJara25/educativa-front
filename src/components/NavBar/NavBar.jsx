import './NavBar.scss'
import logoEducativa from "../../assets/images/logo.png"
import inicio from "../../assets/images/inicio.png"
import quienes_somos from "../../assets/images/quienes_somos.png"
import productos from "../../assets/images/productos.png"
import pedidos_distribuidores from "../../assets/images/pedidos_distribuidores.png"
import contactenos from "../../assets/images/contactenos.png"
import tiktok from "../../assets/images/tiktok-logo.png"
import facebook from "../../assets/images/fb-logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ModalLogin from '../ModalLogin/ModalLogin'

function NavBar() {

    const [modalAbierto, setModalAbierto] = useState(false);
    const navigate = useNavigate()

    const handlePedidosClick = () => {
        const usuario = localStorage.getItem('usuario_educativa');
        if (usuario) {
            navigate('/pedidos-distribuidores');
        } else {
            setModalAbierto(true);
        }
    }

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
                                <img src={inicio} alt="inicio" className='btn-nav' />
                            </Link>
                        </li>
                        <li>
                            <Link to="/quienes-somos">
                                <img src={quienes_somos} alt="quienes-somos" className='btn-nav' />
                            </Link>
                        </li>
                        <li>
                            <Link to="/nuestros-productos">
                                <img src={productos} alt="productos" className='btn-nav' />
                            </Link>
                        </li>
                        <li>
                            <Link to="/contactenos">
                                <img src={contactenos} alt="contactenos" className='btn-nav' />
                            </Link>
                        </li>
                        <li>
                            {/* Aca no es Link, ahora abre el modal */}
                            <button className='btn-nav-pedidos' onClick={handlePedidosClick}>
                                <img src={pedidos_distribuidores} alt="pedidos-distribuidores" className='btn-nav' />
                            </button>
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

            {/* El modal vive aqui, fuera del navbar para no heredar estilos */}
            {modalAbierto && (
                <ModalLogin onCerrar={() => setModalAbierto(false)} />
            )}
        </>
    )
}

export default NavBar;