// Estructura idéntica a la respuesta real del backend para tipo LIBRO (Cuentos Infantiles)
const generarCuentos = (cantidad) => {
    const nombres = [
        "Mi Primer Cuento", "Cuentos de Cuna", "Aventuras en el Jardín",
        "El Oso Meloso", "La Abeja Maya", "El Conejo Saltarín"
    ];

    return Array.from({ length: nombres.length }, (_, i) => ({
        id: `65f1a2b3c4d5e6f7a8b9c5${String(i + 1).padStart(2, "0")}`,
        item: `INF-${String(i + 1).padStart(3, "0")}`,
        categoria: {
            "_id": "65f1a2b3c4d5e6f7a8b9c0d9",
            "nombre": "Cuentos Infantiles",
            "tipo": "LIBRO"
        },
        titulo: nombres[i],
        fotoPortada: `https://res.cloudinary.com/placeholder-inf-${i + 1}.jpg`,
        fotosInterior: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

export const cuentosInfantilesMock = generarCuentos(6);
