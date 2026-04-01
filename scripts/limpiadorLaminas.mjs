import axios from 'axios';

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2IxODE5NmJkYTcyZjYyMzBjNGYxMCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc3NTAxOTQ5MiwiZXhwIjoxNzc3NjExNDkyfQ.9fkfPjjgkLrOYY0wM2dG7KXScjkJpybZj4F0pQHeYr4";

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: { Authorization: `Bearer ${TOKEN}` }
});

async function limpiarLaminas() {
    try {
        console.log("== 1. BUSCANDO CATEGORÍA DE LÁMINAS ==");
        const resCat = await API.get('/categories');
        const categorias = resCat.data;
        const catLaminas = categorias.find(c => c.nombre.toLowerCase().includes('láminas') || c.nombre.toLowerCase().includes('laminas'));

        if (!catLaminas) {
            console.error("❌ No se encontró la categoría 'Láminas' en Mongo.");
            return;
        }

        const idLaminas = catLaminas._id || catLaminas.id;
        console.log(`✅ Categoría Láminas encontrada: ${idLaminas}`);

        console.log("== 2. ESCANEANDO TODOS LOS PRODUCTOS ==");
        const resProd = await API.get('/products');
        const todosLosProductos = resProd.data;

        // Filtramos todos los documentos donde la categoria sea Láminas
        // (O si tu backend insertó un objeto en 'categoria', extraemos el id)
        const productosABorrar = todosLosProductos.filter(p => {
            const catId = typeof p.categoria === 'object' ? (p.categoria?._id || p.categoria?.id) : p.categoria;
            return catId === idLaminas;
        });

        console.log(`🧹 Se encontraron ${productosABorrar.length} láminas defectuosas para borrar.`);

        if (productosABorrar.length === 0) {
            console.log("🌟 Tu base de datos ya está limpia de Láminas.");
            return;
        }

        let borradas = 0;
        let errores = 0;

        for (const lamina of productosABorrar) {
            const lapid = lamina._id || lamina.id;
            try {
                await API.delete(`/products/${lapid}`);
                borradas++;
                process.stdout.write(`\r🗑️ Borrando... ${borradas} / ${productosABorrar.length}`);
            } catch (err) {
                errores++;
            }
        }

        console.log(`\n\n✅ LIMPIEZA TOTAL TERMINADA: ${borradas} láminas eliminadas, ${errores} errores.`);

    } catch (error) {
        console.error("\n❌ Error del servidor al intentar borrar:", error.response?.data?.message || error.message);
    }
}

limpiarLaminas();
