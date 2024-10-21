import './App.css'
import Login from './components/Login'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home'
import Signup from './components/Signup'
import Landing from './components/land/Landing';

function App() {

  return (
  <>
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} /> 
          <Route path='/' element={<Landing />}></Route>
          <Route path="*" element={<NotFound />} />
          
        </Routes>
    </Router>
  </>
  )

}

function NotFound() {
  return <h1>404 - Page Not Found. Wrong HTTP Request</h1>;
}
  

export default App;