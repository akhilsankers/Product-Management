import React from 'react'
import { Button } from 'react-bootstrap';
import { Routes,Route } from 'react-router-dom';
import Home from './Pages/Home';
import Productdetails from './Pages/Productdetails';
import Regester from './Pages/Regester';
import Login from './Pages/Login';
function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path ='/productdetails/:id' element={<Productdetails/>} />
        <Route path ='/register' element={<Regester/>} />
        <Route path ='/login' element={<Login/>} />
      </Routes>
    </div>
  )
}

export default App