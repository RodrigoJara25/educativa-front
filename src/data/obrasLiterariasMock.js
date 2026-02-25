// Estructura idéntica a la respuesta real del backend para tipo LIBRO (Obras Literarias)
const generarObras = (cantidad) => {
    const nombres = [
        "Don Quijote de la Mancha", "Cien Años de Soledad", "La Metamorfosis",
        "El Principito", "Moby Dick", "Odisea", "Ilíada", "Crimen y Castigo",
        "Los Miserables", "Orgullo y Prejuicio", "Drácula", "Frankenstein"
    ];

    return Array.from({ length: nombres.length }, (_, i) => ({
        id: `65f1a2b3c4d5e6f7a8b9c6${String(i + 1).padStart(2, "0")}`,
        item: `OBR-${String(i + 1).padStart(3, "0")}`,
        categoria: {
            "_id": "65f1a2b3c4d5e6f7a8b9c0d8",
            "nombre": "Obras Literarias",
            "tipo": "LIBRO"
        },
        titulo: nombres[i],
        fotoPortada: `https://res.cloudinary.com/placeholder-obr-${i + 1}.jpg`,
        fotosInterior: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

export const obrasLiterariasMock = generarObras(12);
