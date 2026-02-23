import "./PedidosDiccionarios.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import { useState } from "react";

function PedidosDiccionarios({ onContinuar, onRetroceder }) {

    const diccionarios = [
        { item: "D-ESP", titulo: "Diccionario Ilustrado de Espanol" },
        { item: "D-ENG", titulo: "Diccionario Ilustrado de Ingles" },
        { item: "D-SIN", titulo: "Diccionario Ilustrado de Sinonimos, Antonimos y Paronimos" }
    ]

    const [cantidades, setCantidades] = useState(diccionarios.map(() => 0)) // creaste un array de ceros con a misma cantidad de diccionarios

    const handleCantidadChange = (index, value) => {
        const newCantidades = [...cantidades]
        newCantidades[index] = Number(value) || 0
        setCantidades(newCantidades)
    }

    const total = cantidades.reduce((acc, curr) => acc + curr, 0)

    return (
        <>
            <PageSectionDistribuidores titulo="DICCIONARIOS" onContinuar={onContinuar} onRetroceder={onRetroceder}>
                <div className="div-pedidos-diccionarios">
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Titulo</th>
                                <th>Cantidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {diccionarios.map((diccionario, index) => (
                                <tr key={index}>
                                    <td>{diccionario.item}</td>
                                    <td>{diccionario.titulo}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={cantidades[index] === 0 ? "" : cantidades[index]}
                                            onChange={(e) => handleCantidadChange(index, e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="tfoot-spacer">
                                <td colSpan={3}></td>
                            </tr>
                            <tr>
                                <td className="td-total-empty"></td>
                                <td className="td-total-label">
                                    <div className="total-box">TOTAL</div>
                                </td>
                                <td className="td-total-valor"><div className="valor-box">{total}</div></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </PageSectionDistribuidores>
        </>
    );
}

export default PedidosDiccionarios;