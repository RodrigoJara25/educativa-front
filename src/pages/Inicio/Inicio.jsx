import "./Inicio.scss"
import Layout from "../../components/Layout/Layout";
import CategoriesSection from "../../components/CategoriesSection/CategoriesSection";
import Carrusel from "../../components/Carrusel/Carrusel";

function Inicio() {
    return (
        <>
            <Layout>
                <Carrusel />
            </Layout>
            <CategoriesSection />
        </>
    )
}

export default Inicio;