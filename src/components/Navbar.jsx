import { useContext } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../styles/Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    // traemos el token para verificar si estas logueado mas adelante
    const { token, user, logout } = useContext(AuthContext);
    const handleLogout = () => {
        logout()
        navigate("/")
    }
    
    // true or false si estas logueado o no
    const isAuthenticated = !!token;

    return (
        <div className="home-navbar"> 
        <Button
                icon="pi pi-home"
                className="p-button-text home-icon-btn"
                onClick={() => navigate("/")}
                tooltip="Ir al Inicio"
            />
            <div 
                className="logo" 
                onClick={() => navigate("/")} 
                style={{cursor: 'pointer'}}
            >
                🐉 FORO
            </div>

            <div className="nav-links">
                {/* los botones de login o register si no esta autenticado */}
                {!isAuthenticated ? (
                    <>
                        <Button 
                            label="Registrarse" 
                            className="p-button-outlined p-button-secondary" 
                            onClick={() => navigate("/registrarse")} 
                        />
                        <Button 
                            label="Iniciar Sesión" 
                            className="p-button-secondary" 
                            onClick={() => navigate("/logearse")} 
                        />
                    </>
                ) : (
                    // el boton de perfin si esta
                    <>
                        <span className="welcome-text">
                            Bienvenido, <strong className="username_text">{user?.username}</strong>
                        </span>
                        <Button 
                            label="Perfil" 
                            icon="pi pi-cog"
                            className="p-button-text p-button-warning"
                            onClick={() => navigate("/perfil")}
                        />
                        <Button 
                            label="Cerrar Sesion" 
                            icon="pi pi-sign-out"
                            className="logout-btn"
                            onClick={handleLogout}
                        />
                        
                    </>
                )}
            </div>
        </div>
    );
}