import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();
    // traemos el token para verificar si estas logueado mas adelante
    const { token, user } = useContext(AuthContext);

    const isAuthenticated = !!token;

    return (

            <div className="home-container">
                <div>
                    {!isAuthenticated ? (
                        <>
                            <h1>¡Unete a la comunidad!</h1>
                            <p>
                                Unete a la comunidad de NotaGameRPG y crea tu propia historia.
                            </p>
                        </>
                        ) : (
                        <>
                            <h1>¡Bienvenido <strong className="username_text">{user?.username}</strong>!</h1>
                            <p>
                                Comparte tus aventuras, recluta compañeros o enterate de las ultimas noticias!
                            </p>
                        </>
                    )}
                </div>
                <div className="home-buttons">
                    <Button 
                        label="Explorar el Foro" 
                        icon="pi pi-search"
                        className="p-button-raised p-button-info p-button-lg" 
                        onClick={() => navigate("/logearse")} //** *******CAMBIE RUTA PARA PROBAR; RECORDAR REGRESARLA A POSTS */
                    />
                </div>
            </div>
    );
}