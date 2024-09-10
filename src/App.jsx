import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Landing from './components/Landing'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home'
import SignIn from './components/SignIn'
import Forms from './components/Forms'
import { Toaster, toast } from 'sonner'

function App() {

  return (
  <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignIn />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>

  </>
  )

}

function NotFound() {
  return <h1>404 - Page Not Found</h1>;
}
  

export default App
