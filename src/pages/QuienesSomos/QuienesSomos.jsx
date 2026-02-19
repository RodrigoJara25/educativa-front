import "./QuienesSomos.scss"
import Layout from "../../components/Layout/Layout";
import CategoriesSection from "../../components/CategoriesSection/CategoriesSection";
import QuienesSomosSection from "../../components/QuienesSomosSection/QuienesSomosSection";

function QuienesSomos() {
    return (
        <>
            <Layout>
                <QuienesSomosSection />
            </Layout>
            <CategoriesSection />
        </>
    )
}

export default QuienesSomos
