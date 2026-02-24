// Estructura idéntica a la respuesta real del backend para tipo LIBRO (Cuentos Ecológicos)
const generarCuentos = (cantidad) => {
    const nombres = [
        "El Árbol Sabio", "El Río de Cristal", "La Montaña Azul", "El Bosque Mágico",
        "Gotita de Agua", "El Sol Brillante", "Tierra Fértil", "Viento Suave",
        "Mar Limpio", "Cielo Despejado", "Semilla de Esperanza", "Flores Silvestres",
        "Animales en Libertad", "Reciclaje Divertido", "Energía Limpia", "Vida Verde",
        "Planeta Saludable", "Naturaleza Viva", "Eco Aventura", "Guardianes del Bosque"
    ];

    return Array.from({ length: nombres.length }, (_, i) => ({
        id: `65f1a2b3c4d5e6f7a8b9c3${String(i + 1).padStart(2, "0")}`,
        item: `ECO-${String(i + 1).padStart(3, "0")}`,
        categoria: {
            "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
            "nombre": "Cuentos Ecológicos",
            "tipo": "LIBRO"
        },
        titulo: nombres[i],
        fotoPortada: `https://res.cloudinary.com/placeholder-eco-${i + 1}.jpg`,
        fotosInterior: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

export const cuentosEcologicosMock = generarCuentos();
