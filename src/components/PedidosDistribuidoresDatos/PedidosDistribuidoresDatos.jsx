import "./PedidosDistribuidoresDatos.scss";
import PageSection from "../PageSection/PageSection";
import pedidosdistribuidores from "../../assets/headers/pedidosdistribuidores.svg";

import ubigeo from "ubigeo-peru";
import { useState } from "react";

function PedidosDistribuidoresDatos({ onContinuar }) {

    const data = ubigeo.reniec;

    // Departamentos: provincia="00" y distrito="00"
    const departamentos = data.filter(departamento => departamento.provincia === "00" && departamento.distrito === "00")

    const [deptoSeleccionado, setDeptoSeleccionado] = useState("")
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("")
    const [distritoSeleccionado, setDistritoSeleccionado] = useState("")

    // Provincias del departamento seleccionado
    const provincias = data.filter(departamento =>
        departamento.departamento === deptoSeleccionado &&
        departamento.provincia !== "00" &&
        departamento.distrito === "00"
    )

    // Distritos de la provincia seleccionada
    const distritos = data.filter(departamento =>
        departamento.departamento === deptoSeleccionado &&
        departamento.provincia === provinciaSeleccionada &&
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
                                    <input type="text" />
                                </div>
                                <div className="form-row">
                                    <label>RUC o DNI:</label>
                                    <input type="text" />
                                </div>
                                <div className="form-row-doble">
                                    <div className="form-row-doble-item">
                                        <label>Teléfono:</label>
                                        <input type="text" />
                                    </div>
                                    <div className="form-row-doble-item">
                                        <label>Correo:</label>
                                        <input type="email" />
                                    </div>
                                </div>
                                <div className="form-separator" />
                                <div className="form-row">
                                    <label>Departamento:</label>
                                    <select value={deptoSeleccionado} onChange={(e) => {
                                        setDeptoSeleccionado(e.target.value)
                                        setProvinciaSeleccionada("")
                                        setDistritoSeleccionado("")
                                    }}>
                                        <option value="">-- Selecciona --</option>
                                        {departamentos.map(d => (
                                            <option key={d.departamento} value={d.departamento}>{d.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Provincia:</label>
                                    <select value={provinciaSeleccionada} onChange={(e) => {
                                        setProvinciaSeleccionada(e.target.value)
                                        setDistritoSeleccionado("")
                                    }} disabled={!deptoSeleccionado}>
                                        <option value="">-- Selecciona --</option>
                                        {provincias.map(p => (
                                            <option key={p.provincia} value={p.provincia}>{p.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Distrito:</label>
                                    <select value={distritoSeleccionado} onChange={(e) => setDistritoSeleccionado(e.target.value)}
                                        disabled={!provinciaSeleccionada}>
                                        <option value="">-- Selecciona --</option>
                                        {distritos.map(d => (
                                            <option key={d.distrito} value={d.distrito}>{d.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-row">
                                    <label>Dirección:</label>
                                    <input type="text" />
                                </div>
                                <div className="form-row">
                                    <label>Agencia:</label>
                                    <input type="text" />
                                </div>
                                <div className="form-row">
                                    <label>Referencia:</label>
                                    <input type="text" />
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