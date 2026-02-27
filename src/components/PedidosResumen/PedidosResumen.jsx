import Swal from "sweetalert2";
import "./PedidosResumen.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import TablaPedidos from "../TablaPedidos/TablaPedidos";
import PedidoPDF from "../PedidoPDF/PedidoPDF";
import { useOrder } from "../../context/OrderContext";
import { diccionariosMock } from "../../data/diccionariosMock";
import { laminasMock } from "../../data/laminasMock";
import { cuentosClasicosMock } from "../../data/cuentosClasicosMock";
import { obrasLiterariasMock } from "../../data/obrasLiterariasMock";
import { cuentosSelectosMock } from "../../data/cuentosSelectosMock";
import { cuentosEcologicosMock } from "../../data/cuentosEcologicosMock";
import { cuentosEducativosMock } from "../../data/cuentosEducativosMock";
import { cuentosInfantilesMock } from "../../data/cuentosInfantilesMock";
import logoHormiga from "../../assets/images/logo.png";
import ubigeo from "ubigeo-peru";

function PedidosResumen({ onRetroceder, onContinuar }) {
    const { cantidades, distribuidor } = useOrder();

    // ── Resolver nombres de ubigeo ──────────────────────────────────────────
    //
    //  El OrderContext guarda CÓDIGOS (ej: "15", "1501", "150101")
    //  porque eso es lo que tienen los <select> como value.
    //  Para el PDF necesitamos los NOMBRES (ej: "Lima", "Lima", "Lima").
    //
    //  ubigeo.reniec es un array con objetos: { departamento, provincia, distrito, nombre }
    //  Buscamos el registro que coincida exactamente con los códigos guardados.
    //
    const data = ubigeo.reniec;

    const nombreDepartamento = data.find(
        d => d.departamento === distribuidor.departamento
            && d.provincia === "00"
            && d.distrito === "00"
    )?.nombre || distribuidor.departamento || "—";

    const nombreProvincia = data.find(
        d => d.departamento === distribuidor.departamento
            && d.provincia === distribuidor.provincia
            && d.distrito === "00"
    )?.nombre || distribuidor.provincia || "—";

    const nombreDistrito = data.find(
        d => d.departamento === distribuidor.departamento
            && d.provincia === distribuidor.provincia
            && d.distrito === distribuidor.distrito
    )?.nombre || distribuidor.distrito || "—";

    // Objeto que pasamos al PDF con los nombres ya resueltos (no los códigos)
    const distribuidorParaPDF = {
        ...distribuidor,
        departamento: nombreDepartamento,
        provincia: nombreProvincia,
        distrito: nombreDistrito,
    };

    // Helper para sumar cantidades por categoría
    const sumarCategoria = (mockData, prefix) => {
        // Si el mock es un array simple de items (como libros)
        if (Array.isArray(mockData[0]?.laminas)) {
            // Caso especial para Láminas que tienen subcategoras
            return mockData.reduce((acc, sub) => {
                return acc + sub.laminas.reduce((accSub, lam) => accSub + (cantidades[lam.id] || 0), 0);
            }, 0);
        }

        return mockData.reduce((acc, item) => acc + (cantidades[item.id] || 0), 0);
    };

    // Construimos los datos para la TablaPedidos de resumen
    const itemsResumen = [
        { item: "CIV-01", titulo: "Diccionarios", cantidad: sumarCategoria(diccionariosMock) },
        { item: "CIV-02", titulo: "Láminas", cantidad: sumarCategoria(laminasMock) },
        { item: "CIV-03", titulo: "Cuentos Clásicos", cantidad: sumarCategoria(cuentosClasicosMock) },
        { item: "CIV-04", titulo: "Obras Literarias", cantidad: sumarCategoria(obrasLiterariasMock) },
        { item: "CIV-05", titulo: "Cuentos Selectos", cantidad: sumarCategoria(cuentosSelectosMock) },
        { item: "CIV-06", titulo: "Cuentos Ecológicos", cantidad: sumarCategoria(cuentosEcologicosMock) },
        { item: "CIV-07", titulo: "Cuentos Educativos", cantidad: sumarCategoria(cuentosEducativosMock) },
        { item: "CIV-08", titulo: "Cuentos Infantiles", cantidad: sumarCategoria(cuentosInfantilesMock) },
    ];

    // Calculamos el total general
    const totalGeneral = itemsResumen.reduce((acc, curr) => acc + curr.cantidad, 0);

    // ── Preparamos los datos para el PDF ──────────────────────────────────────
    //
    //  PedidoPDF necesita un array de categorías, donde cada categoría tiene:
    //   { nombre: "Diccionarios", items: [{ item, titulo, cantidad }] }
    //
    //  Para láminas es especial porque tienen subcategorías, así que
    //  generamos una categoría por cada subcategoría (ej: "Láminas - Inicial")
    //
    const categoriasPDF = [
        // Láminas: usamos reduce (en lugar de flatMap) para poder intercalar
        // una ETIQUETA de subcategoría antes de cada grupo de láminas.
        //
        // El resultado es un array plano con objetos de dos tipos:
        //   { tipo: 'etiqueta', nombre: 'INICIAL' }
        //   { tipo: 'item',     item: 'IC-001', cantidad: 0 }
        //
        // Cuando TablaLaminasPDF divide el array en columnas de N elementos,
        // las etiquetas caen donde naturalmente les toca — incluso en medio
        // de una columna si el cambio de subcategoría ocurre ahí.
        {
            nombre: "Láminas",
            soloItem: true,
            items: laminasMock.reduce((acc, sub) => {
                // 1. Insertar la etiqueta de la subcategoría
                acc.push({
                    tipo: 'etiqueta',
                    nombre: sub.subcategoria.nombre.toUpperCase(), // "INICIAL", "PRIMARIA"...
                });
                // 2. Insertar todos los items de esa subcategoría
                sub.laminas.forEach(lam => {
                    acc.push({
                        tipo: 'item',
                        item: lam.item,
                        cantidad: cantidades[lam.id] || 0,
                    });
                });
                return acc;
            }, []) // acc empieza como array vacío []
        },
        // Cuarteto: 4 categorías en una sola página, layout 2×2
        //   Cuentos Clásicos  | Obras Literarias
        //   Cuentos Infantiles | Diccionarios
        {
            tipo: 'cuarteto',
            nombre: 'Libros',  // nombre de la página (se usa en el footer)
            cuarteto: [
                {
                    nombre: "Cuentos Clásicos",
                    items: cuentosClasicosMock.map(p => ({
                        item: p.item, titulo: p.titulo, cantidad: cantidades[p.id] || 0,
                    }))
                },
                {
                    nombre: "Obras Literarias",
                    items: obrasLiterariasMock.map(p => ({
                        item: p.item, titulo: p.titulo, cantidad: cantidades[p.id] || 0,
                    }))
                },
                {
                    nombre: "Cuentos Infantiles",
                    items: cuentosInfantilesMock.map(p => ({
                        item: p.item, titulo: p.titulo, cantidad: cantidades[p.id] || 0,
                    }))
                },
                {
                    nombre: "Diccionarios",
                    items: diccionariosMock.map(p => ({
                        item: p.item, titulo: p.titulo, cantidad: cantidades[p.id] || 0,
                    }))
                },
            ]
        },
        {
            nombre: "Cuentos Selectos",
            dobleTabla: true,
            items: cuentosSelectosMock.map(p => ({
                item: p.item, titulo: p.titulo, cantidad: cantidades[p.id] || 0,
            }))
        },
        // Dueto: Ecológicos + Educativos en una sola página, lado a lado
        {
            tipo: 'cuarteto',
            nombre: 'Cuentos Ecológicos y Educativos',
            cuarteto: [
                {
                    nombre: "Cuentos Ecológicos",
                    items: cuentosEcologicosMock.map(p => ({
                        item: p.item, titulo: p.titulo, cantidad: cantidades[p.id] || 0,
                    }))
                },
                {
                    nombre: "Cuentos Educativos",
                    items: cuentosEducativosMock.map(p => ({
                        item: p.item, titulo: p.titulo, cantidad: cantidades[p.id] || 0,
                    }))
                },
            ]
        },
    ];

    // Función para finalizar y ver el JSON
    const handleFinalizar = () => {
        const pedidoFinal = {
            distribuidor: distribuidor,
            items: Object.keys(cantidades)
                .filter(id => cantidades[id] > 0)
                .map(id => ({ id, cantidad: cantidades[id] })),
            totalProductos: totalGeneral,
            fecha: new Date().toISOString()
        };
        // 2. Lanzamos el Pop-up de confirmación
        Swal.fire({
            title: '¿Seguro que quieres confirmar el pedido?',
            text: "Una vez confirmado, se procesará la información.",
            imageUrl: logoHormiga, // <-- Usamos tu logo aquí
            imageWidth: 250,       // Ajusta el tamaño según prefieras
            imageHeight: 'auto',
            imageAlt: 'Logo Educativa',
            showCancelButton: true,
            confirmButtonColor: '#7A9A37', // Tu color verde
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar pedido',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // 3. Si confirma, ejecutamos la lógica final
                console.log("📦 PEDIDO FINALIZADO:", pedidoFinal);

                Swal.fire(
                    '¡Confirmado!',
                    'Tu pedido ha sido registrado correctamente.',
                    'success'
                );
            }
        });
    };

    return (
        <PageSectionDistribuidores
            titulo="RESUMEN DEL PEDIDO"
            onRetroceder={onRetroceder}
            onContinuar={handleFinalizar}
            textoContinuar="FINALIZAR COMPRA"
        >
            <div className="pedidos-resumen-container">
                <TablaPedidos
                    items={itemsResumen}
                    externalCantidades={itemsResumen.map(i => i.cantidad)}
                    showFooter={true}
                    customTotal={totalGeneral}
                />

                {/* ── Botón para descargar el PDF ──────────────────────────────
                  Pasamos distribuidorParaPDF (con nombres legibles, no códigos)
                  y categorias con todos los items del pedido.
                */}
                <div className="pedidos-resumen-pdf">
                    <PedidoPDF
                        distribuidor={distribuidorParaPDF}
                        categorias={categoriasPDF}
                    />
                </div>
            </div>
        </PageSectionDistribuidores>
    );
}

export default PedidosResumen;
