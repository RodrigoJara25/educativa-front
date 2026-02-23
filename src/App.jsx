import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Inicio from './pages/Inicio/Inicio'
import Footer from './components/Footer/Footer'
import QuienesSomos from './pages/QuienesSomos/QuienesSomos'
import NuestrosProductos from './pages/NuestrosProductos/NuestrosProductos'
import Contactenos from './pages/Contactenos/Contactenos'
import PedidosDistribuidores from './pages/PedidosDistribuidores/PedidosDistribuidores'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className='app'>
          <Header />
          <div className='app-content'>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/quienes-somos" element={<QuienesSomos />} />
              <Route path="/nuestros-productos" element={<NuestrosProductos />} />
              <Route path="/contactenos" element={<Contactenos />} />
              <Route path="/pedidos-distribuidores" element={<PedidosDistribuidores />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App