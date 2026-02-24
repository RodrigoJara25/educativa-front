const generarLaminas = (prefijo, cantidad) =>
    Array.from({ length: cantidad }, (_, i) => ({
        id: `${prefijo}-${String(i + 1).padStart(3, "0")}`,
        item: `${prefijo}-${String(i + 1).padStart(3, "0")}`,
    }));

export const laminasMock = [
    {
        subcategoria: { _id: "1", nombre: "Inicial" },
        laminas: generarLaminas("IC", 70),
    },
    {
        subcategoria: { _id: "2", nombre: "Primaria" },
        laminas: generarLaminas("PC", 70),
    },
    {
        subcategoria: { _id: "3", nombre: "Secundaria" },
        laminas: generarLaminas("SC", 70),
    },
    {
        subcategoria: { _id: "4", nombre: "Festividades" },
        laminas: generarLaminas("FC", 70),
    },
];
