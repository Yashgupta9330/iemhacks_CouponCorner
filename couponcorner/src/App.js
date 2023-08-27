
import './App.css';
import Cart from './pages/Cart';
import Home from "./pages/Home"
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import SignupForm from './pages/signup';
import VerifyEmail from './pages/verifyEmail';
import LoginForm from './pages/login';
function App() {
  return (
    <div className="App ">
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/" element={<Home/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
    
    </div>
  );
}

export default App;
