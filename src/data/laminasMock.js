// Estructura que produce Promise.all combinando:
//   GET /api/subcategories?categoria=<id_laminas>
//   GET /api/products?subcategoria=<id> (por cada subcategoría)
const generarLaminas = (prefijo, subcategoriaId, cantidad) =>
    Array.from({ length: cantidad }, (_, i) => ({
        id: `${prefijo}id${String(i + 1).padStart(3, "0")}`,
        item: `${prefijo}-${String(i + 1).padStart(3, "0")}`,
        fotoLamina: null,   // null hasta que se suban imágenes a Cloudinary
        subcategoria: { _id: subcategoriaId },
    }));

export const laminasMock = [
    {
        subcategoria: { _id: "65f1a2b3c4d5e6f7a8b9c0f1", nombre: "Inicial", orden: 1 },
        laminas: generarLaminas("IC", "65f1a2b3c4d5e6f7a8b9c0f1", 150),
    },
    {
        subcategoria: { _id: "65f1a2b3c4d5e6f7a8b9c0f2", nombre: "Primaria", orden: 2 },
        laminas: generarLaminas("PC", "65f1a2b3c4d5e6f7a8b9c0f2", 150),
    },
    {
        subcategoria: { _id: "65f1a2b3c4d5e6f7a8b9c0f3", nombre: "Secundaria", orden: 3 },
        laminas: generarLaminas("SC", "65f1a2b3c4d5e6f7a8b9c0f3", 150),
    },
    {
        subcategoria: { _id: "65f1a2b3c4d5e6f7a8b9c0f4", nombre: "Festividades", orden: 4 },
        laminas: generarLaminas("FC", "65f1a2b3c4d5e6f7a8b9c0f4", 150),
    },
];
