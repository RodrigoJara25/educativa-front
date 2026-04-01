import "./LaminasLayout.scss";
import { useOrder } from "../../context/OrderContext";
import { useProducts } from "../../context/ProductContext";

// IDs reales de Mongo para las 4 subcategorías de Láminas (en orden correcto)
const ORDEN_SUBCATEGORIAS = [
    "69a32c4d8d2eb908f670eef2", // Inicial
    "69a32c548d2eb908f670eef5", // Primaria
    "69a32c598d2eb908f670eef8", // Secundaria
    "69a32c5d8d2eb908f670eefb", // Festividades
];

const ID_CAT_LAMINAS = "69a32c068d2eb908f670eeef";

function LaminasLayout() {
    const { cantidades, updateCantidad } = useOrder();
    const { productos, loading } = useProducts();

    // Filtramos solo láminas y las agrupamos por subcategoría en el orden correcto
    const laminasPorSubcategoria = (() => {
        const listaFinal = productos || [];

        const soloLaminas = listaFinal.filter(p => {
            const catId = typeof p.categoria === "object" ? p.categoria?._id : p.categoria;
            return catId === ID_CAT_LAMINAS;
        });

        return ORDEN_SUBCATEGORIAS.map(subId => {
            const laminasDelGrupo = soloLaminas.filter(p => {
                const pSubId = typeof p.subcategoria === "object" ? p.subcategoria?._id : p.subcategoria;
                return pSubId === subId;
            });

            if (laminasDelGrupo.length === 0) return null;

            const subObj = typeof laminasDelGrupo[0].subcategoria === "object"
                ? laminasDelGrupo[0].subcategoria
                : { _id: subId, nombre: subId };

            return { subcategoria: subObj, laminas: laminasDelGrupo };
        }).filter(Boolean);
    })();

    const handleCantidadChange = (laminaId, value) => {
        updateCantidad(laminaId, value);
    };

    const handleKeyDown = (e) => {
        const numFilas = parseInt(e.target.dataset.filas);
        const totalSub = parseInt(e.target.dataset.total);
        const localIndex = parseInt(e.target.dataset.index);

        if (e.key === "Enter" || e.key === "ArrowDown") {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex !== -1 && currentIndex + 1 < inputs.length) inputs[currentIndex + 1].focus();
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
            const currentIndex = inputs.indexOf(e.target);
            if (currentIndex > 0) inputs[currentIndex - 1].focus();
        } else if (e.key === "ArrowRight") {
            const nextIndex = localIndex + numFilas;
            if (nextIndex < totalSub) {
                e.preventDefault();
                const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
                const globalCurrentIndex = inputs.indexOf(e.target);
                inputs[globalCurrentIndex + numFilas].focus();
            }
        } else if (e.key === "ArrowLeft") {
            const prevIndex = localIndex - numFilas;
            if (prevIndex >= 0) {
                e.preventDefault();
                const inputs = Array.from(document.querySelectorAll(".lamina-item-cantidad"));
                const globalCurrentIndex = inputs.indexOf(e.target);
                inputs[globalCurrentIndex - numFilas].focus();
            }
        }
    };

    const calcularTotalSub = (laminasLista) =>
        laminasLista.reduce((acc, lam) => acc + (cantidades[lam.id] || 0), 0);

    if (loading) return <p style={{ padding: "20px" }}>Cargando láminas...</p>;

    return (
        <>
            <div className="laminas-subactegorias-layout">
                {laminasPorSubcategoria.map((subcategoria) => {
                    const numCols = 10;
                    const numFilas = Math.ceil(subcategoria.laminas.length / numCols);
                    const subId = subcategoria.subcategoria._id;
                    return (
                        <div key={subId} className="laminas-subcategorias">
                            <h2 className="laminas-subactegorias-titulo">{subcategoria.subcategoria.nombre}</h2>
                            <div className="laminas-grid" style={{ gridTemplateRows: `repeat(${numFilas}, auto)` }}>
                                {subcategoria.laminas.map((lamina, index) => {
                                    const realId = lamina._id || lamina.id || lamina.item;

                                    return (
                                        <div key={`${realId}-${index}`} className="lamina-item">
                                            <span className="lamina-item-code">{lamina.item}</span>
                                            <input
                                                type="number"
                                                className="lamina-item-cantidad"
                                                data-index={index}
                                                data-filas={numFilas}
                                                data-total={subcategoria.laminas.length}
                                                value={cantidades[realId] || ""}
                                                onChange={(e) => handleCantidadChange(realId, e.target.value)}
                                                onKeyDown={handleKeyDown}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="laminas-total">
                                <span>TOTAL</span>
                                <span className="laminas-total-valor">
                                    {calcularTotalSub(subcategoria.laminas) === 0 ? "" : calcularTotalSub(subcategoria.laminas)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default LaminasLayout;