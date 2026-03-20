import { useState, useEffect } from 'react';
import './LaminasDetalle.scss';
import { useCategories } from '../../context/CategoryContext';

function LaminasDetalle({ productos }) {
    // 1. Estado para saber qué subcategoría picó el usuario
    const [subcategoriaActiva, setSubcategoriaActiva] = useState(null);
    const [inicializado, setInicializado] = useState(false); // Para no forzarlo si el usuario lo deselecciona

    // 2. Traemos las subcategorías oficiales
    const { subcategorias } = useCategories();

    // 3. Extraer subcategorías únicas presentes en los productos
    const subcategoriasMap = new Map();

    productos.forEach(prod => {
        if (prod.subcategoria && (prod.subcategoria._id || prod.subcategoria)) {
            const subId = prod.subcategoria._id || prod.subcategoria;
            if (!subcategoriasMap.has(subId)) {
                const subOficial = subcategorias.find(s => s._id === subId);
                if (subOficial) {
                    subcategoriasMap.set(subId, subOficial);
                }
            }
        }
    });

    const subcategoriasUnicas = Array.from(subcategoriasMap.values());

    // 3.5 Auto-seleccionar "Festividades" (o la primera) cuando los datos carguen
    useEffect(() => {
        if (!inicializado && subcategoriasUnicas.length > 0) {
            const festividades = subcategoriasUnicas.find(s =>
                s.nombre.toLowerCase().includes('festividade')
            );

            if (festividades) {
                setSubcategoriaActiva(festividades._id);
            } else {
                setSubcategoriaActiva(subcategoriasUnicas[0]._id); // Fallback a la primera
            }
            setInicializado(true);
        }
    }, [subcategoriasUnicas.length, inicializado, subcategoriasUnicas]);


    // 4. Agrupar productos
    const productosAgrupados = subcategoriasUnicas.map(subcat => {
        return {
            subcategoria: subcat,
            laminas: productos.filter(p => {
                const pSubId = p.subcategoria?._id || p.subcategoria;
                return pSubId === subcat._id;
            })
        }
    });

    // 5. Función que se ejecuta al darle clic a una foto de arriba
    const handleSubcategoriaClick = (id) => {
        // Si clicaste la que ya estaba activa, se deselecciona (muestra todas)
        if (subcategoriaActiva === id) {
            setSubcategoriaActiva(null);
        } else {
            // Sino, selecciona la nueva
            setSubcategoriaActiva(id);
        }
    };

    // 6. Extraemos las subcategorías "no seleccionadas" (para dejarlas arriba)
    const subcatsArriba = subcategoriasUnicas.filter(s => s._id !== subcategoriaActiva);

    // 7. Extraemos la subcategoría seleccionada (para ponerla gigante)
    const subcatSeleccionadaObj = subcategoriasUnicas.find(s => s._id === subcategoriaActiva);

    // 8. Decidir cuáles bloques grupos dibujar abajo (Si hay filtro, solo ese. Si no, todos)
    const bloquesAMostrar = subcategoriaActiva
        ? productosAgrupados.filter(grupo => grupo.subcategoria._id === subcategoriaActiva)
        : productosAgrupados;

    return (
        <div className="laminas-detalle-container">
            {/* Fila 1: Menú fotográfico (Las que NO están activas, o TODAS si no hay) */}
            {subcatsArriba.length > 0 && (
                <div className={`laminas-header-row ${subcategoriaActiva ? 'con-seleccion' : ''}`}>
                    {subcatsArriba.map(subcat => (
                        <div
                            key={subcat._id}
                            className="subcategoria-header-foto"
                            onClick={() => handleSubcategoriaClick(subcat._id)}
                            title="Haz clic para seleccionar esta categoría"
                        >
                            {subcat.foto ? (
                                <img src={subcat.foto} alt={subcat.nombre} />
                            ) : (
                                <p>{subcat.nombre}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* SECCIÓN DESTACADA: Solo aparece si el usuario seleccionó una */}
            {subcatSeleccionadaObj && (
                <div
                    className="subcategoria-destacada"
                    onClick={() => handleSubcategoriaClick(subcatSeleccionadaObj._id)}
                    title="Haz clic para deseleccionar y ver todas de nuevo"
                >
                    {subcatSeleccionadaObj.foto ? (
                        <img src={subcatSeleccionadaObj.foto} alt={subcatSeleccionadaObj.nombre} />
                    ) : (
                        <h2>{subcatSeleccionadaObj.nombre}</h2>
                    )}
                </div>
            )}

            {/* Fila 2 en adelante: Rendereado condicional de los bloques y la grilla */}
            <div className="laminas-bloques">
                {bloquesAMostrar.map(grupo => (
                    <div key={grupo.subcategoria._id} className="laminas-grupo">

                        {/* Si NO hay ninguna seleccionada, mostramos este título pequeñito para separar cada grupo */}
                        {!subcategoriaActiva && (
                            <div className="subcategoria-titulo-foto">
                                {grupo.subcategoria.foto ? (
                                    <img src={grupo.subcategoria.foto} alt={grupo.subcategoria.nombre} />
                                ) : (
                                    <h2>{grupo.subcategoria.nombre}</h2>
                                )}
                            </div>
                        )}

                        <div className="laminas-grid-2">
                            {grupo.laminas.map(lamina => (
                                <div key={lamina.id || lamina._id} className="lamina-foto">
                                    <img src={lamina.fotoLamina || lamina.fotoPortada} alt={lamina.titulo} />
                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default LaminasDetalle;
