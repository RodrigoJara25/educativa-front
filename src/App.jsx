import { useState } from 'react'
import './App.scss'
import Header from './components/Header/Header'
import Inicio from './pages/Inicio/Inicio'

function App() {
  return (
    <>
    <div className='app'>
      <Header/>
      <Inicio></Inicio>
    </div>
    </>
  )
}

export default App