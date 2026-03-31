import "./UserCard.scss";
import userIcon from "../../assets/navbar/userIcon.png"
import bolsaCompras from "../../assets/navbar/bolsaCompras.png"

function UserCard({ nombre, onClickLogin }) {
    if (!nombre) {
        nombre = "Inicia Sesión"
    }
    return (
        <>
            <div className="user-card">
                <span className="bienvenida" onClick={onClickLogin} style={{ cursor: 'pointer' }}>Hola,<br /> {nombre}</span>
                <img src={userIcon} alt="user-icon" className="user-icon" onClick={onClickLogin} style={{ cursor: 'pointer' }} />
                <img src={bolsaCompras} alt="bolsa-compras" className="bolsa-compras" />
            </div>
        </>
    )
}

export default UserCard