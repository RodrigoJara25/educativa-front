import "./PedidosDistribuidoresCategorias.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import { useRef } from "react";
import { categoriasMock } from "../../data/categoriasMock";

const categorias = categoriasMock;


const ITEM_WIDTH = 140  // ancho imagen + gap
const GAP = 38

function PedidosDistribuidoresCategorias({ onContinuar, onRetroceder }) {
    const carruselRef = useRef(null)

    const scrollLeft = () => {
        carruselRef.current.scrollLeft -= ITEM_WIDTH + GAP
    }

    const scrollRight = () => {
        carruselRef.current.scrollLeft += ITEM_WIDTH + GAP
    }

    return (
        <PageSectionDistribuidores
            titulo="EMPIEZA CON EL PEDIDO"
            onContinuar={onContinuar}
            onRetroceder={onRetroceder}
        >
            <div className="div-pedidos-distribuidores-categorias">
                <div className="carrusel-wrapper">
                    <button className="carrusel-btn izquierda" onClick={scrollLeft}>&#8249;</button>

                    <div className="carrusel-track" ref={carruselRef}>
                        {categorias.map((cat) => (
                            <div key={cat._id} className="carrusel-item">
                                <img src={cat.foto} alt={cat.nombre} className="cat-imagen" />
                                <p className="cat-nombre">{cat.nombre}</p>
                            </div>
                        ))}
                    </div>

                    <button className="carrusel-btn derecha" onClick={scrollRight}>&#8250;</button>
                </div>
            </div>
        </PageSectionDistribuidores>
    )
}

export default PedidosDistribuidoresCategorias;
