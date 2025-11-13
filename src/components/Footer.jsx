import "../styles/Footer.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="container-footer">
            <div className="footer_icons">
                <a href="#" aria-label="Facebook"><i className="pi pi-facebook"></i></a>
                <a href="#" aria-label="Instagram"><i className="pi pi-instagram"></i></a>
                <a href="#" aria-label="Twitter"><i className="pi pi-twitter"></i></a>
                <a href="#" aria-label="Youtube"><i className="pi pi-youtube"></i></a>
            </div>

            <hr className="footer-separator" />

            <div className="footer-info">
                <p className="footer-copyright">
                    &copy; {currentYear} NotaGameRPG. Todos los derechos reservados.
                </p>
                <p className="footer-brand">
                    NotaGameRPG pertenece a EvilDoggie, marca registrada.
                </p>
            </div>
        </footer>
    );
}