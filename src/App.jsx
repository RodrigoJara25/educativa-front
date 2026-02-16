import './App.scss'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Inicio from './pages/Inicio/Inicio'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className='app'>
          <Header />
          <Routes>
            <Route path="/" element={<Inicio />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App