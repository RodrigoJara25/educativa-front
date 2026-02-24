// Estructura idéntica a la respuesta real del backend para tipo LIBRO (Cuentos Clásicos)
const generarCuentos = (cantidad) => {
    const nombres = [
        "Caperucita Roja", "Los Tres Chanchitos", "Blanca Nieves", "El Gato con Botas",
        "Pinocho", "La Cenicienta", "Hansel y Gretel", "El Patito Feo",
        "La Bella Durmiente", "Ricitos de Oro", "El Soldadito de Plomo", "Pulgarcito",
        "Aladino", "La Sirenita", "Bambi"
    ];

    return Array.from({ length: cantidad }, (_, i) => ({
        id: `65f1a2b3c4d5e6f7a8b9c1${String(i + 1).padStart(2, "0")}`,
        item: `LIB-${String(i + 1).padStart(3, "0")}`,
        categoria: {
            "_id": "65f1a2b3c4d5e6f7a8b9c0d2",
            "nombre": "Cuentos Clásicos",
            "tipo": "LIBRO"
        },
        titulo: nombres[i] || `Cuento Clásico ${i + 1}`,
        fotoPortada: `https://res.cloudinary.com/placeholder-${i + 1}.jpg`,
        fotosInterior: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

export const cuentosClasicosMock = generarCuentos(15);
