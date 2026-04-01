import "./PageSectionDistribuidores.scss";
import { useCategories } from "../../context/CategoryContext";
import { useSearchParams } from "react-router-dom";

function PageSectionDistribuidores({ titulo, children, onContinuar, onRetroceder, textoContinuar = "CONTINUAR" }) {
    const { categorias } = useCategories();
    const [searchParams, setSearchParams] = useSearchParams();

    // Obtenemos el paso actual directamente de la barra de direcciones
    const pasoActual = parseInt(searchParams.get("paso") || "1");

    // Función para teletransportarse a un "Paso" exacto haciendo clic en los mini-logos
    const handleMiniNavClick = (categoria) => {
        const nombreLimpio = categoria.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        const mapaPasos = {
            "diccionarios": 3,
            "laminas educativas": 4,
            "laminas": 4,
            "cuentos clasicos": 5,
            "obras literarias": 6,
            "cuentos selectos": 7,
            "cuentos ecologicos": 8,
            "cuentos educativos": 9,
            "cuentos infantiles": 10
        };

        const llaveEncontrada = Object.keys(mapaPasos).find(key => nombreLimpio.includes(key));

        if (llaveEncontrada) {
            window.scrollTo({ top: 0, behavior: 'smooth' }); // Viaje suave hacia arriba
            setSearchParams({ paso: mapaPasos[llaveEncontrada] }); // Reemplazamos el ?paso= en la URL
        }
    };

    return (
        <div className="div-page-section-distribuidores">
            <div className="page-section-distribuidores">
                <div className="div-verde-page-section-distribuidores"></div>
                <div className="div-contenedor-page-section-distribuidores">

                    <div className="page-section-header-distribuidores">
                        <h1 className="page-section-titulo-distribuidores">{titulo}</h1>
                    </div>

                    <div className="botones-continuar-anterior">
                        {/* BOTÓN ANTERIOR (Mantiene el tamaño de la grilla Flex) */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                            <button type="button" className="btn-anterior" onClick={onRetroceder}>ANTERIOR</button>
                        </div>

                        {/* SELECTOR DESPLEGABLE CENTRAL (Muy limpio, estilo B2B) */}
                        {pasoActual >= 3 && (
                            <div className="b2b-jump-menu" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#7AB433' }}>Saltar a:</span>
                                <select
                                    className="b2b-select-jump"
                                    onChange={(e) => handleMiniNavClick({ nombre: e.target.value })}
                                    defaultValue=""
                                    style={{
                                        padding: '8px 15px',
                                        borderRadius: '8px',
                                        border: '2px solid #7AB433',
                                        color: '#333',
                                        fontWeight: 'bold',
                                        outline: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: '#fff'
                                    }}
                                >
                                    <option value="" disabled>-- Elige una categoría --</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id || cat._id} value={cat.nombre}>
                                            {cat.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {pasoActual < 3 && <div style={{ flex: 1 }}></div>}

                        {/* BOTÓN CONTINUAR */}
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn-continuar" onClick={onContinuar}>{textoContinuar}</button>
                        </div>
                    </div>

                    <div className="linea-marron-distribuidores"></div>

                    <div className="div-contenido-distribuidores">
                        {children}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PageSectionDistribuidores;
