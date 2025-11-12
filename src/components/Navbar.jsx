import { useContext } from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
    const navigate = useNavigate();
    // traemos el token para verificar si estas logueado mas adelante
    const { token } = useContext(AuthContext);
    
    // true or false si estas logueado o no
    const isAuthenticated = !!token;

    return (
        <div className="home-navbar"> 
            <div 
                className="logo" 
                onClick={() => navigate("/")} 
                style={{cursor: 'pointer'}}
            >
                🛡️ NotaGameRPG
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
                            onClick={() => navigate("/login")} 
                        />
                    </>
                ) : (
                    // el boton de perfin si esta
                    <>
                        <Button 
                            label="Perfil" 
                            icon="pi pi-cog"
                            className="p-button-text p-button-warning"
                            onClick={() => navigate(".")} //agregar enlace / ruta para perfil
                        />
                    </>
                )}
            </div>
        </div>
    );
}