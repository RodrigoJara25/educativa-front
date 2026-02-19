import "./QuienesSomosSection.scss"
import bgImage from "../../assets/headers/bg-section.png"
import quienessomos from "../../assets/headers/quienessomos.png"
function QuienesSomosSection() {
    return (
        <>
            <div className="quienes-somos-section">
                <div className="div-verde">
                </div>
                <div className="div-contenedor">
                    <div className="quienes-somos-images">
                        <img src={bgImage} alt="" className="bgImage" />
                        <img src={quienessomos} alt="" className="quienes-somos-header" />
                    </div>
                    <div className="linea-marron">
                    </div>
                    <div className="div-texto-quienes-somos">
                        <p><span>Educativa</span> es una empresa peruana con cinco años de experiencia en el rubro educativo. Nuestros productos están elaborados en base a una metodología de enseñanza vanguardista en la que participan pedagogos, artistas e ilustradores altamente capacitados.</p>
                        <p><span>Misión: </span><br />
                            Somos una empresa dedicada y preocupada por el desarrollo de la educación y cultura de niños y jóvenes, mediante la investigación, edición, diseño y elaboración de productos y experiencias educativas innovadores que contribuyen a la formación y al desarrollo de estudiantes, docentes y todos los interesados en una mejora educativa.</p>
                        <p><span>Visión: </span><br />
                            Ser la empresa más importante en la elaboración de productos, actividades y proyectos para el sector educativo, contribuyendo significativamente a la mejora de la educación.</p>
                    </div>
                </div>

            </div>
        </>
    )
}

export default QuienesSomosSection