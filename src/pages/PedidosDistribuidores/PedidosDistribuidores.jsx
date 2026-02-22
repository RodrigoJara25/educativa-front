import "./PedidosDistribuidores.scss";
import PedidosDistribuidoresDatos from "../../components/PedidosDistribuidoresDatos/PedidosDistribuidoresDatos";
import { useState } from "react";


function PedidosDistribuidores() {
    const [step, setStep] = useState(1);
    return (
        <>
            {step === 1 && <PedidosDistribuidoresDatos onContinuar={() => setStep(2)} />}
        </>
    );
}

export default PedidosDistribuidores;