import "./UserCard.scss";
import userIcon from "../../assets/navbar/userIcon.png"
import bolsaCompras from "../../assets/navbar/bolsaCompras.png"

function UserCard({ nombre }) {
    if (!nombre) {
        nombre = "Inicia Sesión"
    }
    return (
        <>
            <div className="user-card">
                <span className="bienvenida">Hola,<br /> {nombre}</span>
                <img src={userIcon} alt="user-icon" className="user-icon" />
                <img src={bolsaCompras} alt="bolsa-compras" className="bolsa-compras" />
            </div>
        </>
    )
}

export default UserCard