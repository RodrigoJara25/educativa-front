import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Inicio from './pages/Inicio/Inicio'
import Footer from './components/Footer/Footer'
import QuienesSomos from './pages/QuienesSomos/QuienesSomos'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className='app'>
          <Header />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App