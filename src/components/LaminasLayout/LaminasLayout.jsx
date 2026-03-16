import "./LaminasLayout.scss";
import { useProducts } from "../../context/ProductContext"
import { useOrder } from "../../context/OrderContext";

function LaminasLayout() {
    const { cantidades, updateCantidad } = useOrder();
    const { productos, loading } = useProducts();

    if (loading) return <p style={{ textAlign: 'center' }}>Cargando láminas de la base de datos...</p>;

    // 1. Agarramos solo los productos que son de la categoría principal LÁMINAS
    const soloLaminas = productos.filter(p => p.categoria?.tipo === 'LAMINA');

    // 2. Agrupamos las láminas por su subcategoría (Inicial, Primaria, etc.)
    const agrupadasPorSubcategoria = soloLaminas.reduce((acumulador, lamina) => {
        const subcat = lamina.subcategoria;
        if (!subcat) return acumulador; // Si por error hay una lámina sin subcategoría, la saltamos

        const subId = subcat._id;

        // Si no existe el grupo de esta subcategoría, lo creamos
        if (!acumulador[subId]) {
            acumulador[subId] = {
                subcategoria: { _id: subId, nombre: subcat.nombre },
                laminas: []
            };
        }
        // Metemos la lámina dentro de su grupo
        acumulador[subId].laminas.push(lamina);

        return acumulador;
    }, {});

    // Convertimos el objeto a un arreglo para que el .map() de abajo pueda dibujarlo
    const laminasPorSubcategoria = Object.values(agrupadasPorSubcategoria);

    const handleCantidadChange = (laminaId, value) => {
        updateCantidad(laminaId, value);
    }

    const calcularTotalSub = (laminasLista) =>
        laminasLista.reduce((acc, lam) => acc + (cantidades[lam.id] || 0), 0);


    return (
        <>
            <div className="laminas-subactegorias-layout">
                {laminasPorSubcategoria.map((subcategoria) => {
                    const numCols = 10
                    const numFilas = Math.ceil(subcategoria.laminas.length / numCols)
                    const subId = subcategoria.subcategoria._id
                    return (
                        <div key={subId} className="laminas-subcategorias">
                            <h2 className="laminas-subactegorias-titulo">{subcategoria.subcategoria.nombre}</h2>
                            <div className="laminas-grid" style={{ gridTemplateRows: `repeat(${numFilas}, auto)` }}>
                                {subcategoria.laminas.map((lamina) => (
                                    <div key={lamina.id} className="lamina-item">
                                        <span className="lamina-item-code">{lamina.item}</span>
                                        <input
                                            type="number"
                                            className="lamina-item-cantidad"
                                            value={cantidades[lamina.id] || ""}
                                            onChange={(e) => handleCantidadChange(lamina.id, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="laminas-total">
                                <span>TOTAL</span>
                                <span className="laminas-total-valor">
                                    {calcularTotalSub(subcategoria.laminas) === 0 ? "" : calcularTotalSub(subcategoria.laminas)}
                                </span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    );
}

export default LaminasLayout;