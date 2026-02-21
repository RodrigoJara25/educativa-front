import "./ContactenosSection.scss"
import PageSection from "../PageSection/PageSection"
import contactenosImg from "../../assets/headers/contactenos.png"

function ContactenosSection() {
    return (
        <>
            <PageSection headerImg={contactenosImg} headerAlt="Contactenos">
                <form className="contactenos-form">
                    <div className="form-group-contactenos">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" id="nombre" placeholder="Nombre" />
                    </div>
                    <div className="form-group-contactenos">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input type="text" id="telefono" placeholder="Teléfono" />
                    </div>
                    <div className="form-group-contactenos">
                        <label htmlFor="celular">Celular:</label>
                        <input type="text" id="celular" placeholder="Celular" />
                    </div>
                    <div className="form-group-contactenos">
                        <label htmlFor="email">E-mail:</label>
                        <input type="email" id="email" placeholder="E-mail" />
                    </div>
                    <div className="form-group-contactenos">
                        <label htmlFor="comentario">Comentario</label>
                        <textarea id="comentario" placeholder="Comentario" rows={6} />
                    </div>

                    <button type="submit">Enviar</button>
                </form>

            </PageSection>
        </>
    )
}

export default ContactenosSection
