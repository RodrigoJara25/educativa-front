import "./QuienesSomosSection.scss"
import quienessomos from "../../assets/headers/quienessomos.png"
import PageSection from "../PageSection/PageSection"
function QuienesSomosSection() {
    return (
        <>
            <PageSection headerImg={quienessomos} headerAlt="Quienes Somos">
                <div className="div-quienes-somos-text">
                    <p className="quienes-somos-text"><span>Educativa</span> es una empresa peruana con cinco años de experiencia en el rubro educativo. Nuestros productos están elaborados en base a una metodología de enseñanza vanguardista en la que participan pedagogos, artistas e ilustradores altamente capacitados.</p>
                    <p className="quienes-somos-text"><span>Misión: </span><br />
                        Somos una empresa dedicada y preocupada por el desarrollo de la educación y cultura de niños y jóvenes, mediante la investigación, edición, diseño y elaboración de productos y experiencias educativas innovadores que contribuyen a la formación y al desarrollo de estudiantes, docentes y todos los interesados en una mejora educativa.</p>
                    <p className="quienes-somos-text"><span>Visión: </span><br />
                        Ser la empresa más importante en la elaboración de productos, actividades y proyectos para el sector educativo, contribuyendo significativamente a la mejora de la educación.</p>
                </div>
            </PageSection>
        </>
    )
}

export default QuienesSomosSection