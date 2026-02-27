// Estructura idéntica a la respuesta real del backend para tipo LIBRO (Cuentos Selectos)
const generarCuentos = (cantidad) => {
    const nombresBasicos = [
        "El Gato con Botas", "Cenicienta", "Blancanieves", "Hansel y Gretel",
        "Rapunzel", "Rumpelstiltskin", "El Príncipe Rana", "La Bella Durmiente",
        "El Sastrecillo Valiente", "Los Músicos de Bremen", "Pulgarcito",
        "La Pequeña Cerillera", "El Traje Nuevo del Emperador", "La Sirenita",
        "El Patito Feo", "La Reina de las Nieves", "El Soldadito de Plomo",
        "Pulgarcita", "El Ruiseñor", "La Princesa y el Guisante",
        "Barba Azul", "Piel de Asno", "Pedro y el Lobo", "Ricitos de Oro",
        "Jack y las Habichuelas", "La Liebre y la Tortuga", "La Cigarra y la Hormiga",
        "El León y el Ratón", "La Gallina de los Huevos de Oro", "La Tortuga y la Liebre"
    ];

    return Array.from({ length: cantidad }, (_, i) => {
        const nombreBase = nombresBasicos[i % nombresBasicos.length];
        const sufijo = i >= nombresBasicos.length ? ` (Vol. ${Math.floor(i / nombresBasicos.length) + 1})` : "";

        return {
            id: `65f1a2b3c4d5e6f7a8b9c2${String(i + 1).padStart(3, "0")}`,
            item: `SEL-${String(i + 1).padStart(3, "0")}`,
            categoria: {
                "_id": "65f1a2b3c4d5e6f7a8b9c0d3",
                "nombre": "Cuentos Selectos",
                "tipo": "LIBRO"
            },
            titulo: `${nombreBase}${sufijo}`,
            fotoPortada: `https://res.cloudinary.com/placeholder-sel-${i + 1}.jpg`,
            fotosInterior: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    });
};

export const cuentosSelectosMock = generarCuentos(60);
