import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar /> {/* Siempre visible */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<RegisterForm />} />
        <Route path="/logearse" element={<LoginForm />} />
      </Routes>
      <Footer /> {/* Siempre visible */}
    </>
  );
}
