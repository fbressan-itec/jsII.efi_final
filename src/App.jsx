import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import PostComments from "./components/PostComments";

export default function App() {
    return (
        <>
            <Navbar /> {/* Lo importo aca para que este en todas las paginas */}
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registrarse" element={<RegisterForm />} />
            <Route path="/logearse" element={<LoginForm />} />
            <Route path="/posts" element={<Dashboard />} /> 

            {/* Protegidas */}
            <Route path="/perfil" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path="/nuevopost" element={<ProtectedRoute><CreatePost/></ProtectedRoute>} />
            <Route path="/editar-post/:id" element={<ProtectedRoute><EditPost/></ProtectedRoute>} />
            <Route path="/posts/:id" element={<PostComments />} />
            

            </Routes>
            <Footer />
        </>
    );
}
