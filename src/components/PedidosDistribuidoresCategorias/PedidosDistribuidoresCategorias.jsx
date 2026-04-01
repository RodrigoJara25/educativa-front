import "./PedidosDistribuidoresCategorias.scss";
import PageSectionDistribuidores from "../PageSectionDistribuidores/PageSectionDistribuidores";
import { useCategories } from "../../context/CategoryContext";
import CategoriesSection from "../CategoriesSection/CategoriesSection";
import { useNavigate } from "react-router-dom"; // Controlador de rutas

function PedidosDistribuidoresCategorias({ onContinuar, onRetroceder }) {
    const { categorias } = useCategories();
    const navigate = useNavigate();

    // Lógica inteligente: Traducimos la categoría clickeada al número de 'Paso' del formulario maestro
    const handleCategoriaClick = (categoria) => {
        // Normalizamos el texto: borramos tildes y mayúsculas para evitar bugs
        const nombreLimpio = categoria.nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        const mapaPasos = {
            "diccionarios": 3,
            "laminas educativas": 4, // El backend podría mandarlo como laminas educativas
            "laminas": 4,
            "cuentos clasicos": 5,
            "obras literarias": 6,
            "cuentos selectos": 7,
            "cuentos ecologicos": 8,
            "cuentos educativos": 9,
            "cuentos infantiles": 10
        };

        // Buscamos alguna coincidencia en nuestro mapa
        const llaveEncontrada = Object.keys(mapaPasos).find(key => nombreLimpio.includes(key));

        window.scrollTo({ top: 0, behavior: 'smooth' }); // Subimos la pantalla suavemente

        if (llaveEncontrada) {
            const pasoExacto = mapaPasos[llaveEncontrada];
            navigate(`?paso=${pasoExacto}`);
        } else {
            // Si agregan una categoría nueva en el backend que no conocemos, lo mandamos al siguiente paso normal
            onContinuar();
        }
    };

    return (
        <>
            <PageSectionDistribuidores
                titulo="EMPIEZA CON EL PEDIDO"
                onContinuar={onContinuar}
                onRetroceder={onRetroceder}
            >
                <div className="div-pedidos-distribuidores-categorias">
                    <div className="categorias-grid">
                        {/* ITERAMOS COMO GRILLA DINÁMICA DE FOTOS, YA NO CARRUSEL */}
                        {categorias.map((cat) => (
                            <div key={cat.id || cat._id} className="grid-item" onClick={() => handleCategoriaClick(cat)}>
                                {/* Aquí usamos explícitamente cat.foto (la foto enfocada a mayoristas) */}
                                <img src={cat.foto} alt={cat.nombre} className="cat-imagen" />
                                <p className="cat-nombre">{cat.nombre}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </PageSectionDistribuidores>

            {/* Bloque inferior global de la página: EL CARRUSEL NORMAL DE PORTADAS COMPLETO */}
            <div className="bloque-inferior-carrusel">
                <CategoriesSection />
            </div>
        </>
    );
}

export default PedidosDistribuidoresCategorias;
