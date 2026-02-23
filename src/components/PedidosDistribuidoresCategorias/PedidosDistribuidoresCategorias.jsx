import "./PedidosDistribuidoresCategorias.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import { useRef } from "react";

import cat1 from "../../assets/categories/1.png"
import cat2 from "../../assets/categories/2.png"
import cat3 from "../../assets/categories/3.png"
import cat4 from "../../assets/categories/4.png"
import cat5 from "../../assets/categories/5.png"
import cat6 from "../../assets/categories/6.png"
import cat7 from "../../assets/categories/7.png"
import cat8 from "../../assets/categories/8.png"
import cat9 from "../../assets/categories/9.png"

// Imágenes de categorías — reemplazar cuando lleguen las reales
const categorias = [
    { id: 1, nombre: "Cuentos Ecologicos", imagen: cat1 },
    { id: 2, nombre: "Cuentos Favoritos", imagen: cat2 },
    { id: 3, nombre: "Cuentos Selectos", imagen: cat3 },
    { id: 4, nombre: "Diccionarios Ilustrados", imagen: cat4 },
    { id: 5, nombre: "Laminas Educativas", imagen: cat5 },
    { id: 6, nombre: "Laminas Escolares", imagen: cat6 },
    { id: 7, nombre: "Laminas Escolares", imagen: cat7 },
    { id: 8, nombre: "Lamians Kids", imagen: cat8 },
    { id: 9, nombre: "Obras Literarias", imagen: cat9 },
]

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
                            <div key={cat.id} className="carrusel-item">
                                <img src={cat.imagen} alt={cat.nombre} className="cat-imagen" />
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
