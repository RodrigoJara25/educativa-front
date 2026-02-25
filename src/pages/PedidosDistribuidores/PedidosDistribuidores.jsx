import "./PedidosDistribuidores.scss";
import { useState } from "react";
import PedidosDistribuidoresDatos from "../../components/PedidosDistribuidoresDatos/PedidosDistribuidoresDatos";
import PedidosDistribuidoresCategorias from "../../components/PedidosDistribuidoresCategorias/PedidosDistribuidoresCategorias";
import PedidosDiccionarios from "../../components/PedidosDiccionarios/PedidosDiccionarios";
import PedidosLaminas from "../../components/PedidosLaminas/PedidosLaminas";
import CuentosClasicos from "../../components/CuentosClasicos/CuentosClasicos";
import ObrasLiterarias from "../../components/ObrasLiterarias/ObrasLiterarias";
import CuentosSelectos from "../../components/CuentosSelectos/CuentosSelectos";
import CuentosEcologicos from "../../components/CuentosEcologicos/CuentosEcologicos";
import CuentosEducativos from "../../components/CuentosEducativos/CuentosEducativos";
import CuentosInfantiles from "../../components/CuentosInfantiles/CuentosInfantiles";


function PedidosDistribuidores() {
    const [step, setStep] = useState(1);
    return (
        <>
            {step === 1 && <PedidosDistribuidoresDatos onContinuar={() => setStep(2)} />}
            {step === 2 && <PedidosDistribuidoresCategorias onRetroceder={() => setStep(1)} onContinuar={() => setStep(3)} />}
            {step === 3 && <PedidosDiccionarios onRetroceder={() => setStep(2)} onContinuar={() => setStep(4)} />}
            {step === 4 && <PedidosLaminas onRetroceder={() => setStep(3)} onContinuar={() => setStep(5)} />}
            {step === 5 && <CuentosClasicos onRetroceder={() => setStep(4)} onContinuar={() => setStep(6)} />}
            {step === 6 && <ObrasLiterarias onRetroceder={() => setStep(5)} onContinuar={() => setStep(7)} />}
            {step === 7 && <CuentosSelectos onRetroceder={() => setStep(6)} onContinuar={() => setStep(8)} />}
            {step === 8 && <CuentosEcologicos onRetroceder={() => setStep(7)} onContinuar={() => setStep(9)} />}
            {step === 9 && <CuentosEducativos onRetroceder={() => setStep(8)} onContinuar={() => setStep(10)} />}
            {step === 10 && <CuentosInfantiles onRetroceder={() => setStep(9)} onContinuar={() => setStep(11)} />}
        </>
    );
}

export default PedidosDistribuidores;