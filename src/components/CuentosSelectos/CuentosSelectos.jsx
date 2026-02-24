import "./CuentosSelectos.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import { cuentosSelectosMock } from "../../data/cuentosSelectosMock";
import { useState } from "react";

function CuentosSelectos({ onRetroceder, onContinuar }) {
    const [todasCantidades, setTodasCantidades] = useState(cuentosSelectosMock.map(() => 0));

    const mitad = Math.ceil(cuentosSelectosMock.length / 2);
    const primeraMitad = cuentosSelectosMock.slice(0, mitad);
    const segundaMitad = cuentosSelectosMock.slice(mitad);

    const totalGlobal = todasCantidades.reduce((acc, curr) => acc + curr, 0);

    const handleCambioGlobal = (indexReal, valor) => {
        const nuevas = [...todasCantidades];
        nuevas[indexReal] = Number(valor) || 0;
        setTodasCantidades(nuevas);
    };

    return (
        <>
            <PageSectionDistribuidores titulo={"CUENTOS SELECTOS"} onRetroceder={onRetroceder} onContinuar={onContinuar}>
                <div className="cuentos-selectos-container">
                    <div className="tabla-wrapper">
                        <TablaPedidos
                            items={primeraMitad}
                            externalCantidades={todasCantidades.slice(0, mitad)}
                            onCantidadChange={(index, val) => handleCambioGlobal(index, val)}
                            showFooter={false}
                        />
                    </div>
                    <div className="tabla-wrapper">
                        <TablaPedidos
                            items={segundaMitad}
                            externalCantidades={todasCantidades.slice(mitad)}
                            onCantidadChange={(index, val) => handleCambioGlobal(index + mitad, val)}
                            showFooter={true}
                            customTotal={totalGlobal === 0 ? "" : totalGlobal}
                        />
                    </div>
                </div>
            </PageSectionDistribuidores>
        </>
    );
}

export default CuentosSelectos;
