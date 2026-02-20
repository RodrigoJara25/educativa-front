import "./NuestrosProductos.scss"
import Layout from "../../components/Layout/Layout"
import CategoriesSection from "../../components/CategoriesSection/CategoriesSection"
import NuestrosProductosSection from "../../components/NuestrosProductosSection/NuestrosProductosSection"

function NuestrosProductos() {
    return (
        <>
            <Layout>
                <NuestrosProductosSection />
            </Layout>
            <CategoriesSection />
        </>
    )
}

export default NuestrosProductos
