import { NavLink } from 'react-router-dom'
import './AdminSidebar.scss'
import logoHormiga from '../../../assets/images/logo.png'

const navItems = [
    { label: 'Inicio', path: '/admin' },
    { label: 'Cuentos', path: '/admin/productos' },
    { label: 'Láminas', path: '/admin/laminas' },
    { label: 'Pedidos', path: '/admin/pedidos' },
    { label: 'Distribuidores', path: '/admin/distribuidores' },
    { label: 'Vendedores', path: '/admin/vendedores' },
    { label: 'Clientes', path: '/admin/clientes' },
]

function AdminSidebar() {
    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <img src={logoHormiga} alt="Logo" className="sidebar-logo" />
                <div>
                    <p className="sidebar-brand">Panel de</p>
                    <p className="sidebar-brand">Administrador</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/admin'}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? 'active' : ''}`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    )
}

export default AdminSidebar