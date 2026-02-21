import "./Contactenos.scss"
import Layout from "../../components/Layout/Layout"
import CategoriesSection from "../../components/CategoriesSection/CategoriesSection"
import ContactenosSection from "../../components/ContactenosSection/ContactenosSection"

function Contactenos() {
    return (
        <>
            <Layout>
                <ContactenosSection />
            </Layout>
            <CategoriesSection />
        </>
    )
}

export default Contactenos