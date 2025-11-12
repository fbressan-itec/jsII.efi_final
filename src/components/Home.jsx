import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            {/* pongo el navbar */}
            <Navbar /> 
            <div className="home-container">
                <h1>¡Unete a la comunidad!</h1>
                <p>
                    Unete a la comunidad de NotaGameRPG y crea tu propia historia.
                </p>
                <div className="home-buttons">
                    <Button 
                        label="Explorar el Foro" 
                        icon="pi pi-search"
                        className="p-button-raised p-button-info p-button-lg" 
                        onClick={() => navigate("/posts")} 
                    />
                </div>
            </div>
            <Footer /> 
        </>
    );
}