import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Inicio from './pages/Inicio/Inicio'
import QuienesSomos from './pages/QuienesSomos/QuienesSomos'
import NuestrosProductos from './pages/NuestrosProductos/NuestrosProductos'
import Contactenos from './pages/Contactenos/Contactenos'
import PedidosDistribuidores from './pages/PedidosDistribuidores/PedidosDistribuidores'
import CategoriaDetalle from './pages/CategoriaDetalle/CategoriaDetalle'

// Admin
import AdminLayout from './components/Admin/AdminLayout/AdminLayout'
import AdminInicio from './pages/Admin/AdminInicio/AdminInicio'
import AdminProductos from './pages/Admin/AdminProductos/AdminProductos'
import AdminLaminas from './pages/Admin/AdminLaminas/AdminLaminas'
import AdminProductoForm from './pages/Admin/AdminProductoForm/AdminProductoForm'
import AdminLaminaForm from './pages/Admin/AdminLaminaForm/AdminLaminaForm'
import Proximamente from './pages/Proximamente/Proximamente'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Rutas del Admin (sin Header/Footer público) ── */}
        <Route path="/admin" element={
          <AdminLayout><AdminInicio /></AdminLayout>
        } />
        <Route path="/admin/productos" element={
          <AdminLayout><AdminProductos /></AdminLayout>
        } />
        <Route path="/admin/laminas" element={
          <AdminLayout><AdminLaminas /></AdminLayout>
        } />
        <Route path="/admin/productos/nuevo" element={
          <AdminLayout><AdminProductoForm /></AdminLayout>
        } />
        <Route path="/admin/productos/editar/:id" element={
          <AdminLayout><AdminProductoForm /></AdminLayout>
        } />
        <Route path="/admin/laminas/nuevo" element={
          <AdminLayout><AdminLaminaForm /></AdminLayout>
        } />

        {/* Rutas en Construcción */}
        <Route path="/admin/pedidos" element={<AdminLayout><Proximamente modulo="Pedidos" /></AdminLayout>} />
        <Route path="/admin/distribuidores" element={<AdminLayout><Proximamente modulo="Distribuidores" /></AdminLayout>} />
        <Route path="/admin/vendedores" element={<AdminLayout><Proximamente modulo="Vendedores" /></AdminLayout>} />
        <Route path="/admin/clientes" element={<AdminLayout><Proximamente modulo="Clientes" /></AdminLayout>} />

        {/* ── Rutas públicas (con Header y Footer) ── */}
        <Route path="/*" element={
          <div className='app'>
            <Header />
            <div className='app-content'>
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path="/quienes-somos" element={<QuienesSomos />} />
                <Route path="/nuestros-productos" element={<NuestrosProductos />} />
                <Route path="/contactenos" element={<Contactenos />} />
                <Route path="/pedidos-distribuidores" element={<PedidosDistribuidores />} />
                <Route path="/categoria/:id" element={<CategoriaDetalle />} />
              </Routes>
            </div>
            <Footer />
          </div>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App
