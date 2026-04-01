import { useEffect } from 'react';
import "./PedidosDistribuidoresDatos.scss";
import PageSection from "../PageSection/PageSection";
import pedidosdistribuidores from "../../assets/headers/pedidosdistribuidores.svg";
import ubigeo from "ubigeo-peru";
import { useOrder } from "../../context/OrderContext";

function PedidosDistribuidoresDatos({ onContinuar }) {
    const { distribuidor, setDistribuidor } = useOrder();

    const data = ubigeo.reniec;

    // 1. Efecto inicial: Cargar la sesión guardada al iniciar el pedido
    useEffect(() => {
        // Solo pre-cargamos si el distribuidor en el contexto está vacío
        // Así evitamos borrar sus cambios si el usuario "retrocede" de pestaña
        if (!distribuidor.nombre && !distribuidor.ruc) {
            const userDataString = localStorage.getItem('usuario_educativa');
            if (userDataString) {
                try {
                    const userData = JSON.parse(userDataString);
                    // 2. Mapeo Mágico: Traducimos del Backend al Frontend State
                    setDistribuidor(prev => ({
                        ...prev,
                        nombre: userData.nombre || "",
                        ruc: userData.ruc_dni || "",       // Traducción ruc_dni -> ruc
                        telefono: userData.celular || "",  // Traducción celular -> telefono
                        email: userData.email || "",
                        departamento: userData.departamento || "",
                        provincia: userData.provincia || "",
                        distrito: userData.distrito || "",
                        direccion: userData.direccion || "",
                        agencia: userData.agencia || "",
                        referencia: userData.referencia || ""
                    }));
                } catch (error) {
                    console.error("Error leyendo sesión del Distribuidor", error);
                }
            }
        }
    }, []); // Se ejecuta solo la primera vez que se renderiza el paso 1

    // Helper para actualizar campos del distribuidor
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDistribuidor(prev => ({ ...prev, [name]: value }));
    };

    // Helper para actualizar ubigeo
    const handleUbigeoChange = (tipo, valor) => {
        if (tipo === 'departamento') {
            setDistribuidor(prev => ({ ...prev, departamento: valor, provincia: "", distrito: "" }));
        } else if (tipo === 'provincia') {
            setDistribuidor(prev => ({ ...prev, provincia: valor, distrito: "" }));
        } else {
            setDistribuidor(prev => ({ ...prev, distrito: valor }));
        }
    };

    // Departamentos: provincia="00" y distrito="00"
    const departamentos = data.filter(departamento => departamento.provincia === "00" && departamento.distrito === "00")

    // Provincias del departamento seleccionado
    const provincias = data.filter(departamento =>
        departamento.departamento === distribuidor.departamento &&
        departamento.provincia !== "00" &&
        departamento.distrito === "00"
    )

    // Distritos de la provincia seleccionada
    const distritos = data.filter(departamento =>
        departamento.departamento === distribuidor.departamento &&
        departamento.provincia === distribuidor.provincia &&
        departamento.distrito !== "00"
    )

    return (
        <>
            <div className="div-pedidos-distribuidores-layout">
                <div className="div-centrado-distribuidores">
                    <div className="div-page-section-distribuidores">
                        <PageSection headerImg={pedidosdistribuidores} headerAlt="Pedidos Distribuidores" variant="new">
                            <form className="form-pedidos-distribuidores">
                                <div className="form-row">
                                    <label>Nombre:</label>
                                    <input type="text" name="nombre" value={distribuidor.nombre || ""} onChange={handleChange} />
                                </div>
                                <div className="form-row">
                                    <label>RUC o DNI:</label>
                                    <input type="text" name="ruc" value={distribuidor.ruc || ""} onChange={handleChange} />
                                </div>
                                <div className="form-row-doble">
                                    <div className="form-row-doble-item">
                                        <label>Teléfono:</label>
                                        <input type="text" name="telefono" value={distribuidor.telefono || ""} onChange={handleChange} />
                                    </div>
                                    <div className="form-row-doble-item">
                                        <label>Correo:</label>
                                        <input type="email" name="email" value={distribuidor.email || ""} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-separator" />
                                <div className="form-row">
                                    <label>Departamento:</label>
                                    <select value={distribuidor.departamento || ""} onChange={(e) => handleUbigeoChange('departamento', e.target.value)}>
                                        <option value="">-- Selecciona --</option>
                                        {departamentos.map(d => (
                                            <option key={d.departamento} value={d.departamento}>{d.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Provincia:</label>
                                    <select value={distribuidor.provincia || ""} onChange={(e) => handleUbigeoChange('provincia', e.target.value)} disabled={!distribuidor.departamento}>
                                        <option value="">-- Selecciona --</option>
                                        {provincias.map(p => (
                                            <option key={p.provincia} value={p.provincia}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Distrito:</label>
                                    <select value={distribuidor.distrito || ""} onChange={(e) => handleUbigeoChange('distrito', e.target.value)}
                                        disabled={!distribuidor.provincia}>
                                        <option value="">-- Selecciona --</option>
                                        {distritos.map(d => (
                                            <option key={d.distrito} value={d.distrito}>{d.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Dirección:</label>
                                    <input type="text" name="direccion" value={distribuidor.direccion || ""} onChange={handleChange} />
                                </div>
                                <div className="form-row">
                                    <label>Agencia:</label>
                                    <input type="text" name="agencia" value={distribuidor.agencia || ""} onChange={handleChange} />
                                </div>
                                <div className="form-row">
                                    <label>Referencia:</label>
                                    <input type="text" name="referencia" value={distribuidor.referencia || ""} onChange={handleChange} />
                                </div>
                                <button type="button" className="btn-continuar" onClick={onContinuar}>CONTINUAR</button>
                            </form>
                        </PageSection>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PedidosDistribuidoresDatos;