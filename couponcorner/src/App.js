
import './App.css';
import Cart from './pages/Cart';
import Home from "./pages/Home"
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import SignupForm from './pages/signup';
function App() {
  return (
    <div className="App ">
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/" element={<Home/>} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
    
    </div>
  );
}

export default App;
