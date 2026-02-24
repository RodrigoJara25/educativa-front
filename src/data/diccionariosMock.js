// Estructura exacta que devuelve GET /api/products?categoria=<id_diccionarios>
// tipo LIBRO: tiene item, titulo, categoria, fotoPortada, fotosInterior
export const diccionariosMock = [
    {
        id: "65f1a2b3c4d5e6f7a8b9c0e1",
        item: "D-ESP",
        titulo: "Diccionario Ilustrado de Español",
        categoria: { _id: "65f1a2b3c4d5e6f7a8b9c0d4", nombre: "Diccionarios Ilustrados", tipo: "LIBRO" },
        fotoPortada: null,
        fotosInterior: []
    },
    {
        id: "65f1a2b3c4d5e6f7a8b9c0e2",
        item: "D-ENG",
        titulo: "Diccionario Ilustrado de Inglés",
        categoria: { _id: "65f1a2b3c4d5e6f7a8b9c0d4", nombre: "Diccionarios Ilustrados", tipo: "LIBRO" },
        fotoPortada: null,
        fotosInterior: []
    },
    {
        id: "65f1a2b3c4d5e6f7a8b9c0e3",
        item: "D-SIN",
        titulo: "Diccionario Ilustrado de Sinónimos, Antónimos y Parónimos",
        categoria: { _id: "65f1a2b3c4d5e6f7a8b9c0d4", nombre: "Diccionarios Ilustrados", tipo: "LIBRO" },
        fotoPortada: null,
        fotosInterior: []
    },
]
