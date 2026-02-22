import "./PedidosDistribuidoresLayout.scss";
import PageSection from "../PageSection/PageSection";
import pedidosdistribuidores from "../../assets/headers/pedidosdistribuidores.svg";

function PedidosDistribuidoresLayout() {
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
                                    <input type="text" />
                                </div>
                                <div className="form-row">
                                    <label>Provincia:</label>
                                    <input type="text" />
                                </div>
                                <div className="form-row">
                                    <label>Distrito:</label>
                                    <input type="text" />
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
                                <button type="submit" className="btn-continuar">CONTINUAR</button>
                            </form>
                        </PageSection>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PedidosDistribuidoresLayout;