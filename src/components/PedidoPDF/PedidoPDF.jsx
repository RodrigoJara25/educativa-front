// ╔══════════════════════════════════════════════════════════════════╗
// ║                        PedidoPDF.jsx                            ║
// ║                                                                  ║
// ║  Este componente genera un PDF con:                              ║
// ║   - Página 1: Los datos del distribuidor                         ║
// ║   - Páginas siguientes: Tabla de pedidos por categoría           ║
// ║                                                                  ║
// ║  La librería usada es: @react-pdf/renderer                       ║
// ║  Documentación: https://react-pdf.org/                           ║
// ╚══════════════════════════════════════════════════════════════════╝

// ─── 1. IMPORTACIONES DE REACT-PDF ────────────────────────────────────────────
//
//  Document  → el contenedor raíz del PDF (solo uno por archivo)
//  Page      → cada hoja del PDF
//  View      → equivale a <div> en HTML, sirve para agrupar elementos
//  Text      → equivale a <p> o <span>, es el único que puede tener texto
//  Image     → para mostrar imágenes
//  StyleSheet→ para definir los estilos (como CSS, pero en JS)
//  PDFDownloadLink → componente que crea un botón/enlace de descarga del PDF
//
import {
    Document,
    Page,
    View,
    Text,
    Image,
    StyleSheet,
    PDFDownloadLink,
} from "@react-pdf/renderer";

// ─── 2. IMPORTAMOS EL LOGO ────────────────────────────────────────────────────
//
//  En react-pdf NO puedes usar directamente rutas públicas sin que las empaquete.
//  Al importarlo así, Vite lo convierte a una URL válida que react-pdf puede usar.
//
import logoHormiga from "../../assets/images/logo.png";

// ─── 3. LOS ESTILOS DEL PDF ───────────────────────────────────────────────────
//
//  ⚠️ IMPORTANTE: En react-pdf NO usas CSS normal ni clases.
//  En cambio usas StyleSheet.create({ }) para definir los estilos.
//
//  Las reglas son parecidas a CSS, pero con estas diferencias:
//   - Las propiedades son camelCase (en vez de "font-size" → "fontSize")
//   - Los valores numéricos son en puntos PDF (pt), no en px
//   - NO existe margin/padding shorthand: usas marginTop, marginLeft, etc.
//   - Flexbox funciona igual que en React Native
//
const styles = StyleSheet.create({

    // ── Página ──────────────────────────────────────────────────────────────
    pagina: {
        padding: 20,           // reducido de 40 → más espacio útil en la hoja
        paddingTop: 15,        // pegado arriba
        fontFamily: "Helvetica",
        backgroundColor: "#ffffff",
    },

    // ── Cabecera del PDF (logo + título) ────────────────────────────────────
    cabecera: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,       // reducido de 30 → línea más cerca del subtítulo
        borderBottomWidth: 2,
        borderBottomColor: "#7A9A37",
        paddingBottom: 8,      // reducido de 15 → cabecera más compacta
    },
    logo: {
        width: 45,             // reducido de 70
        height: 45,
        marginRight: 12,
    },
    tituloCabecera: {
        fontSize: 14,          // reducido de 20
        fontFamily: "Helvetica-Bold",
        color: "#3a5a0a",
    },
    subtituloCabecera: {
        fontSize: 8,           // reducido de 10
        color: "#666666",
        marginTop: 2,          // reducido de 4
    },

    // ── Sección de datos del distribuidor ──────────────────────────────────
    seccionTitulo: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#7A9A37",
        marginBottom: 8,
        marginTop: 6,          // reducido de 20 → más pegado a la línea divisoria
        textTransform: "uppercase",
    },
    camposGrid: {
        flexDirection: "row",           // los campos van en dos columnas
        flexWrap: "wrap",               // si no caben, bajan a la siguiente fila
        gap: 10,
    },
    campo: {
        width: "48%",                   // cada campo ocupa ~mitad del ancho
        marginBottom: 10,
    },
    campoLabel: {
        fontSize: 8,
        color: "#999999",
        marginBottom: 3,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    campoValor: {
        fontSize: 11,
        color: "#222222",
        borderBottomWidth: 1,
        borderBottomColor: "#dddddd",
        paddingBottom: 4,
    },

    // ── Tabla de pedidos ────────────────────────────────────────────────────
    //
    //  react-pdf NO tiene <table>. Simulamos una tabla usando View con
    //  flexDirection: "row" para las filas.
    //
    tabla: {
        marginTop: 10,
    },
    tablaEncabezado: {
        flexDirection: "row",
        backgroundColor: "#7A9A37",
        padding: 6,
        borderRadius: 4,
    },
    tablaFila: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderBottomWidth: 0.5,
        borderBottomColor: "#333333",  // ← línea negra entre filas
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    tablaFilaAlternada: {
        flexDirection: "row",
        backgroundColor: "#ffffff",    // mismo fondo blanco que la fila normal
        borderBottomWidth: 0.5,
        borderBottomColor: "#333333",  // ← línea negra entre filas
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    // Celdas: definimos el ancho de cada columna
    celdaItem: {
        width: "15%",
        fontSize: 9,
        color: "#ffffff",
    },
    celdaTitulo: {
        width: "70%",
        fontSize: 9,
        color: "#ffffff",
    },
    celdaCantidad: {
        width: "15%",
        fontSize: 9,
        color: "#ffffff",
        textAlign: "center",
    },
    // Celdas del cuerpo de la tabla (texto oscuro)
    celdaItemBody: {
        width: "15%",
        fontSize: 9,
        color: "#444444",
    },
    celdaTituloBody: {
        width: "70%",
        fontSize: 9,
        color: "#222222",
    },
    celdaCantidadBody: {
        width: "15%",
        fontSize: 9,
        color: "#333333",
        textAlign: "center",
    },
    // Fila de total al final de cada tabla
    filaTotalContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",     // empuja los hijos a la derecha
        marginTop: 6,
    },
    filaTotalBox: {
        flexDirection: "row",
        backgroundColor: "#3a5a0a",
        borderRadius: 4,
        paddingVertical: 5,
        paddingHorizontal: 12,
        gap: 20,
    },
    filaTotalLabel: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
    },
    filaTotalValor: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
    },

    // ── Pie de página ────────────────────────────────────────────────────────
    pie: {
        // position:"absolute" + bottom hace que el footer SIEMPRE esté al fondo
        // de la página, sin importar cuánto contenido haya arriba.
        // Es como `position: fixed; bottom: 0` en CSS normal.
        position: "absolute",
        bottom: 20,            // ← distancia desde el borde inferior
        left: 20,              // debe coincidir con el padding lateral de la página
        right: 20,
        borderTopWidth: 1,
        borderTopColor: "#eeeeee",
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    pieTitulo: {
        fontSize: 8,
        color: "#666666",
    },
    tituloCategoria: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: "#3a5a0a",
        marginBottom: 8,
        marginTop: 6,
        textTransform: "uppercase",
    },
    // Título para cada sub-tabla dentro del cuarteto (fondo verde, texto blanco)
    tituloCuarteto: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: "#ffffff",
        backgroundColor: "#3a5a0a",
        paddingVertical: 3,
        paddingHorizontal: 5,
        marginBottom: 4,
        textTransform: "uppercase",
    },

    // ── Estilos exclusivos para el layout multi-columna de Láminas ────────────
    //
    //  A4 usable height ≈ 680pt. Con rows de ~8pt → 85 items por columna.
    //  Con 600 láminas totales → necesitamos ~7-8 columnas.
    //  Usamos flex:1 en cada columna para que se repartan el ancho disponible.
    //
    laminasGrid: {
        flexDirection: "row",
        gap: 5,                  // ← sube para más separación entre columnas
    },
    laminasColumna: {
        flex: 1,                 // cada columna toma la misma fracción del ancho
    },
    laminaFila: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 0.8,       // espacio mínimo entre filas
    },
    laminaItem: {
        fontSize: 6.5,         // ← sube aquí para ajustar el tamaño del código del item
        fontFamily: "Helvetica-Bold",
        marginRight: 2,        // separación mínima entre código y cuadro
        color: "#111111",
    },
    laminaCuadro: {
        width: 14,
        height: 9,
        borderWidth: 0.5,
        borderColor: "#999999",
        justifyContent: "center",
        alignItems: "center",
    },
    laminaCantidad: {
        fontSize: 6,           // ← sube aquí para ajustar el tamaño del número dentro del cuadro
        fontFamily: "Helvetica-Bold",
        color: "#111111",
        textAlign: "center",
    },
    // Etiqueta de subcategoría dentro del grid de láminas (INICIAL, PRIMARIA, etc.)
    laminaEtiqueta: {
        fontSize: 6,                   // ← 6pt asegura que "FESTIVIDADES" entre sin cortes
        fontFamily: "Helvetica-Bold",  // negrita
        color: "#ffffff",              // texto blanco
        backgroundColor: "#1a1a1a",   // fondo negro
        marginTop: 3,
        marginBottom: 2,
        paddingVertical: 1,
        // sin paddingHorizontal: más espacio para el texto dentro del cuadro negro
    },
});


// ─── 4. COMPONENTE: CABECERA REUTILIZABLE ─────────────────────────────────────
//
//  Creamos un pequeño componente que usaremos en TODAS las páginas.
//  Así no repetimos el mismo código en cada página.
//
function CabeceraPDF({ fecha }) {
    return (
        <View style={styles.cabecera}>
            {/* Image recibe src= con la ruta del logo importado */}
            <Image style={styles.logo} src={logoHormiga} />
            <View>
                <Text style={styles.tituloCabecera}>Educativa Hormiga</Text>
                <Text style={styles.subtituloCabecera}>Pedido de Distribuidores</Text>
                <Text style={styles.subtituloCabecera}>Fecha: {fecha}</Text>
            </View>
        </View>
    );
}


// ─── 5. COMPONENTE: TABLA DE PRODUCTOS EN EL PDF ──────────────────────────────
//
//  Recibe:
//   - items:    lista de { item, titulo, cantidad }
//   - soloItem: si es true, muestra SOLO las columnas ITEM y CANT. (modo Láminas)
//               si es false/undefined, muestra ITEM, TÍTULO y CANT. (modo normal)
//
function TablaPDF({ items, soloItem = false }) {
    // Calculamos el total sumando todas las cantidades
    const total = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);

    // Mostramos SIEMPRE la tabla completa.
    // Si un item no tiene cantidad, la celda aparece vacía.

    return (
        <View style={styles.tabla}>
            {/* ── Encabezado: cambia según el modo ─────────────────────── */}
            <View style={styles.tablaEncabezado}>
                {soloItem ? (
                    // Modo Láminas: solo Item y Cantidad
                    <>
                        <Text style={{ ...styles.celdaItem, width: "80%" }}>Item</Text>
                        <Text style={styles.celdaCantidad}>Cantidad</Text>
                    </>
                ) : (
                    // Modo normal: Item, Título y Cantidad
                    <>
                        <Text style={styles.celdaItem}>Item</Text>
                        <Text style={styles.celdaTitulo}>Título</Text>
                        <Text style={styles.celdaCantidad}>Cantidad</Text>
                    </>
                )}
            </View>

            {/* ── Filas de productos — aparecen TODOS aunque la cantidad sea 0 ── */}
            {items.map((item, index) => (
                <View
                    key={index}
                    style={index % 2 === 0 ? styles.tablaFila : styles.tablaFilaAlternada}
                >
                    {soloItem ? (
                        // Modo Láminas: celda ITEM más ancha, sin título
                        <>
                            <Text style={{ ...styles.celdaItemBody, width: "80%" }}>{item.item}</Text>
                            <Text style={styles.celdaCantidadBody}>
                                {(item.cantidad || 0) > 0 ? item.cantidad : ""}
                            </Text>
                        </>
                    ) : (
                        // Modo normal: tres columnas
                        <>
                            <Text style={styles.celdaItemBody}>{item.item}</Text>
                            <Text style={styles.celdaTituloBody}>{item.titulo}</Text>
                            <Text style={styles.celdaCantidadBody}>
                                {(item.cantidad || 0) > 0 ? item.cantidad : ""}
                            </Text>
                        </>
                    )}
                </View>
            ))}

            {/* Total al final */}
            <View style={styles.filaTotalContainer}>
                <View style={styles.filaTotalBox}>
                    <Text style={styles.filaTotalLabel}>TOTAL</Text>
                    <Text style={styles.filaTotalValor}>{total}</Text>
                </View>
            </View>
        </View>
    );
}


// ─── 5d. TABLA SIMPLE CON TÍTULO Y TOTAL (sub-tablas del cuarteto) ────────────
// compact=true → fuentes 7.5pt y total más pequeño (para la página cuarteto)
function TablaSimpleConTotal({ nombre, items, compact = false }) {
    const total = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const fs = compact ? 7.5 : 9;   // font-size de celdas
    const pv = compact ? 2 : 4;   // paddingVertical de filas
    return (
        <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.tituloCuarteto}>{nombre}</Text>
            <View style={styles.tablaEncabezado}>
                <Text style={{ ...styles.celdaItem, fontSize: fs }}>Item</Text>
                <Text style={{ ...styles.celdaTitulo, fontSize: fs }}>Título</Text>
                <Text style={{ ...styles.celdaCantidad, fontSize: fs }}>Cantidad</Text>
            </View>
            {items.map((item, index) => (
                <View key={index} style={{ ...styles.tablaFila, paddingVertical: pv }}>
                    <Text style={{ ...styles.celdaItemBody, fontSize: fs }}>{item.item}</Text>
                    <Text style={{ ...styles.celdaTituloBody, fontSize: fs }}>{item.titulo}</Text>
                    <Text style={{ ...styles.celdaCantidadBody, fontSize: fs }}>
                        {(item.cantidad || 0) > 0 ? item.cantidad : ""}
                    </Text>
                </View>
            ))}
            {/* Total — más compacto en modo cuarteto */}
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: compact ? 2 : 6 }}>
                <View style={{
                    ...styles.filaTotalBox,
                    paddingVertical: compact ? 2 : 5,
                    paddingHorizontal: compact ? 6 : 12,
                    gap: compact ? 8 : 20,
                }}>
                    <Text style={{ ...styles.filaTotalLabel, fontSize: compact ? 7.5 : 10 }}>TOTAL</Text>
                    <Text style={{ ...styles.filaTotalValor, fontSize: compact ? 7.5 : 10 }}>{total}</Text>
                </View>
            </View>
        </View>
    );
}

// TablaCuartetoPDF: grid 2×2
// compact=true solo si hay más de 2 sub-tablas (4 en una página = poco espacio)
// con 2 sub-tablas (dueto) usa tamaño normal para aprovechar el espacio disponible
function TablaCuartetoPDF({ cuarteto }) {
    const esCompact = cuarteto.length > 2;  // ← true solo para el cuarteto de 4
    const filas = [];
    for (let i = 0; i < cuarteto.length; i += 2) {
        filas.push([cuarteto[i], cuarteto[i + 1]]);
    }
    return (
        <View>
            {filas.map(([izq, der], index) => (
                <View key={index} style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
                    <TablaSimpleConTotal nombre={izq.nombre} items={izq.items} compact={esCompact} />
                    {der
                        ? <TablaSimpleConTotal nombre={der.nombre} items={der.items} compact={esCompact} />
                        : <View style={{ flex: 1 }} />
                    }
                </View>
            ))}
        </View>
    );
}


// ─── 5c. TABLA EN DOS COLUMNAS PARALELAS (para categorías grandes) ────────────
//
//  Cuando una categoría tiene muchos ítems (ej: Cuentos Selectos = 70),
//  una tabla normal de 70 filas no cabe en una página A4.
//
//  Esta función divide el array en bloques de FILAS_POR_COLUMNA y los pone
//  de dos en dos, lado a lado:
//
//    [Item | Título           | Cantidad]  [Item | Título           | Cantidad]
//    [SEL-001 | El Gato...    |    ]       [SEL-033 | Cenicienta... |    ]
//    ...hasta 32 filas...                  ...hasta 32 filas...
//
const FILAS_POR_COLUMNA = 30; // ← ajusta aquí si quieres más/menos filas por columna

// SubTabla: una tabla individual con encabezado (sin total propio)
function SubTabla({ items }) {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.tablaEncabezado}>
                {/* paddingRight solo en SubTabla para separar Item de Título */}
                <Text style={{ ...styles.celdaItem, paddingRight: 5 }}>Item</Text>
                <Text style={styles.celdaTitulo}>Título</Text>
                <Text style={styles.celdaCantidad}>Cantidad</Text>
            </View>
            {items.map((item, index) => (
                <View
                    key={index}
                    style={index % 2 === 0 ? styles.tablaFila : styles.tablaFilaAlternada}
                >
                    <Text style={{ ...styles.celdaItemBody, paddingRight: 5 }}>{item.item}</Text>
                    <Text style={styles.celdaTituloBody}>{item.titulo}</Text>
                    <Text style={styles.celdaCantidadBody}>
                        {(item.cantidad || 0) > 0 ? item.cantidad : ""}
                    </Text>
                </View>
            ))}
        </View>
    );
}

// TablaDobleColumnasPDF: agrupa los items en bloques de 32 y los pone de 2 en 2
// Solo hay UN total al final, que suma todos los items.
function TablaDobleColumnasPDF({ items }) {
    const totalGeneral = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);
    const bloques = [];
    for (let i = 0; i < items.length; i += FILAS_POR_COLUMNA) {
        bloques.push(items.slice(i, i + FILAS_POR_COLUMNA));
    }
    const pares = [];
    for (let i = 0; i < bloques.length; i += 2) {
        pares.push([bloques[i], bloques[i + 1] || []]);
    }
    return (
        <View>
            {pares.map(([izq, der], index) => (
                <View key={index} style={{ flexDirection: "row", gap: 10, marginBottom: 6 }}>
                    <SubTabla items={izq} />
                    {der.length > 0
                        ? <SubTabla items={der} />
                        : <View style={{ flex: 1 }} />
                    }
                </View>
            ))}
            {/* Un solo TOTAL al final, suma de todos los items */}
            <View style={styles.filaTotalContainer}>
                <View style={styles.filaTotalBox}>
                    <Text style={styles.filaTotalLabel}>TOTAL</Text>
                    <Text style={styles.filaTotalValor}>{totalGeneral}</Text>
                </View>
            </View>
        </View>
    );
}


// ─── 5b. TABLA ESPECIAL MULTI-COLUMNA PARA LÁMINAS ────────────────────────────
//
//  Las láminas tienen 600 items (150 por subcategoría × 4), así que
//  NO podemos usar una tabla normal (no cabrían). En su lugar:
//
//  1. Dividimos el array en grupos de ITEMS_POR_COLUMNA
//  2. Cada grupo se renderiza como una columna vertical (flexDirection: "column")
//  3. Todas las columnas van en un contenedor horizontal (flexDirection: "row")
//  4. Resultado: grid compacto que aprovecha todo el ancho de la página
//
//
//  Math actualizado:
//   604 elementos totales (600 láminas + 4 etiquetas)
//   604 / 68 = 8.88 → 9 columnas (la última tiene 60 elementos, bien poblada)
//   Ancho por columna: (555 - 8×5) / 9 = 515/9 ≈ 57pt
//   "FESTIVIDADES" a 6pt bold ≈ 48pt → cabe en 57pt ✓
//   Alto por columna: 68 × ~8.5pt = 578pt → no desborda la página ✓
//
const ITEMS_POR_COLUMNA = 68;

function TablaLaminasPDF({ items }) {
    const total = items.reduce((acc, item) => acc + (item.cantidad || 0), 0);

    // Dividimos el array en columnas usando slice
    // Ej: 600 items / 80 = 7.5 → 8 columnas
    const columnas = [];
    for (let i = 0; i < items.length; i += ITEMS_POR_COLUMNA) {
        columnas.push(items.slice(i, i + ITEMS_POR_COLUMNA));
    }

    return (
        <View>
            {/* ── El grid de columnas ─────────────────────────────────────────
              flexDirection:"row" pone cada columna una al lado de la otra.
              flex:1 en cada columna hace que se repartan el ancho equitativamente.
            */}
            <View style={styles.laminasGrid}>
                {columnas.map((columna, colIndex) => (
                    <View key={colIndex} style={styles.laminasColumna}>
                        {columna.map((elemento, rowIndex) => (
                            // Cada elemento puede ser una ETIQUETA o un ITEM:
                            //
                            //  etiqueta → { tipo: 'etiqueta', nombre: 'INICIAL' }
                            //    └ Muestra el nombre en verde, sin cuadrito
                            //
                            //  item → { tipo: 'item', item: 'IC-001', cantidad: 0 }
                            //    └ Muestra el código + cuadrito de cantidad
                            //
                            elemento.tipo === 'etiqueta'
                                ? (
                                    <Text key={rowIndex} style={styles.laminaEtiqueta}>
                                        {elemento.nombre}
                                    </Text>
                                )
                                : (
                                    <View key={rowIndex} style={styles.laminaFila}>
                                        <Text style={styles.laminaItem}>{elemento.item}</Text>
                                        <View style={styles.laminaCuadro}>
                                            <Text style={styles.laminaCantidad}>
                                                {(elemento.cantidad || 0) > 0 ? elemento.cantidad : ""}
                                            </Text>
                                        </View>
                                    </View>
                                )
                        ))}
                    </View>
                ))}
            </View>

            {/* Total general
                marginTop ← sube/baja este valor para separar el TOTAL del grid de láminas */}
            <View style={{ ...styles.filaTotalContainer, marginTop: 10 }}>
                <View style={styles.filaTotalBox}>
                    <Text style={styles.filaTotalLabel}>TOTAL</Text>
                    <Text style={styles.filaTotalValor}>{total}</Text>
                </View>
            </View>
        </View>
    );
}


// ─── 6. EL DOCUMENTO PDF PRINCIPAL ────────────────────────────────────────────
//
//  Esta función recibe todos los datos y construye el Document completo.
//  Creamos una función separada (no un componente con botón) porque la pasamos
//  a PDFDownloadLink como document={<MiPDF ... />}
//
//  Props que recibe:
//   - distribuidor: objeto con los datos del distribuidor (del OrderContext)
//   - categorias: array de { nombre, items: [{ item, titulo, cantidad }] }
//   - fecha: string de la fecha del pedido
//
function DocumentoPDF({ distribuidor, categorias, fecha }) {
    return (
        // Document es el contenedor raíz — solo puede tener Pages como hijos directos
        //
        // hyphenationCallback={word => [word]} le dice a react-pdf:
        // "nunca cortes ni dividas ninguna palabra con guión"
        // Evita que FESTIVIDADES o SECUNDARIA se partan en dos líneas.
        <Document
            title={`Pedido - ${distribuidor.nombre || "Distribuidor"}`}
            author="Educativa Hormiga"
            hyphenationCallback={word => [word]}
        >
            {/* ── PÁGINA 1: Datos del Distribuidor ─────────────────────────── */}
            <Page size="A4" style={styles.pagina}>

                <CabeceraPDF fecha={fecha} />

                {/* Título de la sección */}
                <Text style={styles.seccionTitulo}>Datos del Distribuidor</Text>

                {/*
                  Los campos del distribuidor los mostramos en una cuadrícula (grid)
                  de 2 columnas usando flexWrap: "wrap" y width: "48%"
                */}
                <View style={styles.camposGrid}>

                    {/* Cada campo tiene una etiqueta arriba y el valor abajo */}
                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Nombre</Text>
                        <Text style={styles.campoValor}>{distribuidor.nombre || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>RUC / DNI</Text>
                        <Text style={styles.campoValor}>{distribuidor.ruc || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Teléfono</Text>
                        <Text style={styles.campoValor}>{distribuidor.telefono || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Correo</Text>
                        <Text style={styles.campoValor}>{distribuidor.email || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Departamento</Text>
                        <Text style={styles.campoValor}>{distribuidor.departamento || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Provincia</Text>
                        <Text style={styles.campoValor}>{distribuidor.provincia || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Distrito</Text>
                        <Text style={styles.campoValor}>{distribuidor.distrito || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Dirección</Text>
                        <Text style={styles.campoValor}>{distribuidor.direccion || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Agencia</Text>
                        <Text style={styles.campoValor}>{distribuidor.agencia || "—"}</Text>
                    </View>

                    <View style={styles.campo}>
                        <Text style={styles.campoLabel}>Referencia</Text>
                        <Text style={styles.campoValor}>{distribuidor.referencia || "—"}</Text>
                    </View>

                </View>

                {/* Pie de la página 1 */}
                <View style={styles.pie}>
                    <Text style={styles.pieTitulo}>Educativa Hormiga S.A.C.</Text>
                    <Text style={styles.pieTitulo}>Página 1 de {categorias.length + 1}</Text>
                </View>
            </Page>


            {/* ── PÁGINAS SIGUIENTES: Una por cada categoría ──────────────────
              
              Aquí usamos .map() para generar una <Page> por cada categoría.
              Esto es una de las cosas más poderosas de react-pdf: puedes
              generar páginas dinámicamente con JavaScript.
              
              Mostramos SIEMPRE todas las categorías, aunque no tengan pedido.
            */}
            {categorias
                .map((categoria, pageIndex) => (
                    <Page
                        key={pageIndex}
                        size="A4"
                        style={styles.pagina}
                    >
                        <CabeceraPDF fecha={fecha} />

                        {/* Título de la categoría:
                            - Cuarteto: no se muestra (cada sub-tabla tiene el suyo)
                            - Láminas (soloItem): texto verde sin fondo, más pequeño
                            - Resto (Cuentos Selectos, etc.): fondo verde, texto blanco */}
                        {categoria.tipo !== 'cuarteto' && (
                            <Text style={
                                categoria.soloItem
                                    // Láminas: texto verde sin fondo, más compacto
                                    ? { ...styles.tituloCategoria, marginBottom: 3, marginTop: 3 }
                                    // Resto: fondo verde con texto blanco (igual que sub-tablas del cuarteto)
                                    : { ...styles.tituloCuarteto, fontSize: 11, marginTop: 6, marginBottom: 8 }
                            }>
                                {categoria.nombre}
                            </Text>
                        )}

                        {/* Tabla: elige el componente según el tipo de categoría */}
                        {categoria.tipo === 'cuarteto'
                            ? <TablaCuartetoPDF cuarteto={categoria.cuarteto} />
                            : categoria.soloItem
                                ? <TablaLaminasPDF items={categoria.items} />
                                : categoria.dobleTabla
                                    ? <TablaDobleColumnasPDF items={categoria.items} />
                                    : <TablaPDF items={categoria.items} />
                        }

                        {/* Pie de página — NO se muestra en la página de láminas */}
                        {!categoria.soloItem && (
                            <View style={styles.pie}>
                                <Text style={styles.pieTitulo}>Educativa Hormiga S.A.C.</Text>
                                <Text style={styles.pieTitulo}>Página {pageIndex + 2} de {categorias.length + 1}</Text>
                            </View>
                        )}
                    </Page>
                ))
            }

        </Document>
    );
}


// ─── 7. COMPONENTE PRINCIPAL: EL BOTÓN QUE EXPORTA EL PDF ────────────────────
//
//  Este es el componente que importarás desde PedidosResumen.
//
//  Recibe:
//   - distribuidor: del OrderContext
//   - categorias: el array de categorías ya preparado con sus items y cantidades
//
//  PDFDownloadLink es el componente que:
//   1. Genera el PDF en el navegador (el PDF se genera en el cliente, sin servidor)
//   2. Crea un enlace <a> que al hacer click descarga el archivo
//
//  Tiene 3 props importantes:
//   - document={<DocumentoPDF ... />}  → el PDF que queremos generar
//   - fileName="nombre.pdf"            → el nombre del archivo descargado
//   - children                         → lo que se muestra como botón/enlace
//     (puede ser una función que recibe { loading } para mostrar estado de carga)
//
function PedidoPDF({ distribuidor, categorias }) {
    // Formateamos la fecha actual para mostrarla en el PDF
    const fecha = new Date().toLocaleDateString("es-PE", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // El nombre del archivo PDF que se descargará
    const nombreArchivo = `Pedido_${distribuidor?.nombre || "Distribuidor"}_${new Date().toISOString().split("T")[0]}.pdf`;

    return (
        <PDFDownloadLink
            document={
                // 👆 Aquí pasamos nuestro DocumentoPDF con todos sus datos
                <DocumentoPDF
                    distribuidor={distribuidor}
                    categorias={categorias}
                    fecha={fecha}
                />
            }
            fileName={nombreArchivo}   // 👆 El nombre del archivo al descargar
        >
            {/*
              children puede ser una función que recibe { loading, error }
              Mientras se genera el PDF, loading = true
              Cuando ya está listo, loading = false y al hacer click descarga
            */}
            {({ loading }) =>
                loading
                    ? "Generando PDF..."
                    : "📄 Descargar PDF del Pedido"
            }
        </PDFDownloadLink>
    );
}

export default PedidoPDF;
