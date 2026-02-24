// Estructura idéntica a la respuesta real del backend para tipo LIBRO (Cuentos Educativos)
const generarCuentos = (cantidad) => {
    return Array.from({ length: cantidad }, (_, i) => ({
        id: `65f1a2b3c4d5e6f7a8b9c4${String(i + 1).padStart(2, "0")}`,
        item: `EDU-${String(i + 1).padStart(3, "0")}`,
        categoria: {
            "_id": "65f1a2b3c4d5e6f7a8b9c0x1", // ID ficticio para Educativos
            "nombre": "Cuentos Educativos",
            "tipo": "LIBRO"
        },
        titulo: `Cuento Educativo ${i + 1}`,
        fotoPortada: `https://res.cloudinary.com/placeholder-edu-${i + 1}.jpg`,
        fotosInterior: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }));
};

export const cuentosEducativosMock = generarCuentos(25);
