import "./UserCard.scss";
import userIcon from "../../assets/navbar/userIcon.png";
import bolsaCompras from "../../assets/navbar/bolsaCompras.png";

function UserCard({ nombre, onClickLogin }) {

    // Verificamos si realmente le mandaste un nombre desde el Header
    const taLogueado = nombre ? true : false;

    if (!nombre) {
        nombre = "Inicia Sesión";
    }

    return (
        <>
            <div className="user-card">
                <div
                    className="bienvenida-contenedor"
                    onClick={!taLogueado ? onClickLogin : undefined}
                    style={{ cursor: !taLogueado ? 'pointer' : 'default' }}
                >
                    <p className="saludo">Hola,</p>
                    <p className="nombre">{nombre}</p>
                </div>

                <img src={userIcon} alt="user-icon" className="user-icon" onClick={onClickLogin} style={{ cursor: 'pointer' }} />

                <img src={bolsaCompras} alt="bolsa-compras" className="bolsa-compras" />
            </div>
        </>
    );
}

export default UserCard;
