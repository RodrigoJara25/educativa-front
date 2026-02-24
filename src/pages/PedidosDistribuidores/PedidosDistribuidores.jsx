import "./PedidosDistribuidores.scss";
import { useState } from "react";
import PedidosDistribuidoresDatos from "../../components/PedidosDistribuidoresDatos/PedidosDistribuidoresDatos";
import PedidosDistribuidoresCategorias from "../../components/PedidosDistribuidoresCategorias/PedidosDistribuidoresCategorias";
import PedidosDiccionarios from "../../components/PedidosDiccionarios/PedidosDiccionarios";
import PedidosLaminas from "../../components/PedidosLaminas/PedidosLaminas";
import CuentosClasicos from "../../components/CuentosClasicos/CuentosClasicos";


function PedidosDistribuidores() {
    const [step, setStep] = useState(1);
    return (
        <>
            {step === 1 && <PedidosDistribuidoresDatos onContinuar={() => setStep(2)} />}
            {step === 2 && <PedidosDistribuidoresCategorias onRetroceder={() => setStep(1)} onContinuar={() => setStep(3)} />}
            {step === 3 && <PedidosDiccionarios onRetroceder={() => setStep(2)} onContinuar={() => setStep(4)} />}
            {step === 4 && <PedidosLaminas onRetroceder={() => setStep(3)} onContinuar={() => setStep(5)} />}
            {step === 5 && <CuentosClasicos onRetroceder={() => setStep(4)} onContinuar={() => setStep(6)} />}
        </>
    );
}

export default PedidosDistribuidores;