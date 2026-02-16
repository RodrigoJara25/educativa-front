import "./Footer.scss";
import facebook from "../../assets/footer/facebook-logo.png"
import tiktok from "../../assets/footer/tik-tok-logo.png"
import whatsapp from "../../assets/footer/whatsapp-logo.png"

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-div">
                <div className="footer-div-p">
                    <p>© 2026 Educativa. Todos los derechos reservados.</p>
                </div>
                <div className="footer-div-img">
                    <a href=""><img src={whatsapp} alt="" /></a>
                    <a href=""><img src={facebook} alt="" /></a>
                    <a href=""><img src={tiktok} alt="" /></a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;