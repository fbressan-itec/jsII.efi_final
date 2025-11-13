import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <>
      <Navbar /> {/* Lo importo aca para que este en todas las paginas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registrarse" element={<RegisterForm />} />
        <Route path="/logearse" element={<LoginForm />} />
        <Route path="/posts" element={<Dashboard />} /> 
      </Routes>
      <Footer />
    </>
  );
}
