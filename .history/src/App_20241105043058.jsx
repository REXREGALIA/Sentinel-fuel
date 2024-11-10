import './App.css'
import Login from './components/Login'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/Home'
import SignUp from './components/SignUp'
import Landing from './components/land/Landing';
import Drivers from "./components/Drivers"
import Trucks from "./components/Trucks"
import Settings from "./components/Settings";
import LiveTracking from './components/LiveTracking';
import Analytics from './components/Analytics';

function App() {

  return (
  <>
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} /> 
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignUp />} /> 
          <Route path='/' element={<Landing />}></Route>
          <Route path="*" element={<NotFound />} />
          <Route path="/drivers" element={<Drivers/>} />
          <Route path="/trucks" element={<Trucks/>} />
          <Route path="/settings" element={<Settings/>} />
          <Route path="/tracking" element={<LiveTracking />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
    </Router>
  </>
  )

}

function NotFound() {
  return <h1>404 - Page Not Found. Wrong HTTP Request</h1>;
}
  

export default App;