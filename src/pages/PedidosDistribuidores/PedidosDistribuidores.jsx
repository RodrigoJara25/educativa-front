import "./PedidosDistribuidores.scss";
import { useState } from "react";
import PedidosDistribuidoresDatos from "../../components/PedidosDistribuidoresDatos/PedidosDistribuidoresDatos";
import PedidosDistribuidoresCategorias from "../../components/PedidosDistribuidoresCategorias/PedidosDistribuidoresCategorias";


function PedidosDistribuidores() {
    const [step, setStep] = useState(1);
    return (
        <>
            {step === 1 && <PedidosDistribuidoresDatos onContinuar={() => setStep(2)} />}
            {step === 2 && <PedidosDistribuidoresCategorias onRetroceder={() => setStep(1)} onContinuar={() => setStep(3)} />}
        </>
    );
}

export default PedidosDistribuidores;