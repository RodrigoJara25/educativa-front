import cat1 from "../assets/categories/1.png"
import cat2 from "../assets/categories/2.png"
import cat3 from "../assets/categories/3.png"
import cat4 from "../assets/categories/4.png"
import cat5 from "../assets/categories/5.png"
import cat6 from "../assets/categories/6.png"
import cat7 from "../assets/categories/7.png"
import cat8 from "../assets/categories/8.png"
import cat9 from "../assets/categories/9.png"

// Estructura exacta que devuelve GET /api/categories
// foto usa imágenes locales como placeholder hasta conectar Cloudinary
export const categoriasMock = [
    { _id: "65f1a2b3c4d5e6f7a8b9c0d1", nombre: "Cuentos Ecológicos", tipo: "LIBRO", foto: cat1, activo: true, orden: 1 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d2", nombre: "Cuentos Favoritos", tipo: "LIBRO", foto: cat2, activo: true, orden: 2 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d3", nombre: "Cuentos Selectos", tipo: "LIBRO", foto: cat3, activo: true, orden: 3 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d4", nombre: "Diccionarios Ilustrados", tipo: "LIBRO", foto: cat4, activo: true, orden: 4 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d5", nombre: "Láminas Educativas", tipo: "LAMINA", foto: cat5, activo: true, orden: 5 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d6", nombre: "Láminas Escolares", tipo: "LAMINA", foto: cat6, activo: true, orden: 6 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d7", nombre: "Láminas Kids", tipo: "LAMINA", foto: cat7, activo: true, orden: 7 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d8", nombre: "Obras Literarias", tipo: "LIBRO", foto: cat8, activo: true, orden: 8 },
    { _id: "65f1a2b3c4d5e6f7a8b9c0d9", nombre: "Cuentos Infantiles", tipo: "LIBRO", foto: cat9, activo: true, orden: 9 },
]
