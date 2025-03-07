import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const PaymentResponse = () => {
    const [status, setStatus] = useState<string | null>(null);
    const [reference, setReference] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const paymentStatus = searchParams.get("transactionState");
        const referenceCode = searchParams.get("referenceCode");
        const transactionID = searchParams.get("transactionId");

        setStatus(paymentStatus);
        setReference(referenceCode);
        setTransactionId(transactionID);

        if (paymentStatus === "4") {
            setErrorMessage("Pago aprobado.");
        } else if (paymentStatus === "6") {
            setErrorMessage("Pago rechazado.");
        } else {
            setErrorMessage("Estado desconocido.");
        }
    }, [searchParams]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Resultado del Pago</h1>
            {status ? (
                <>
                    <p>Estado del pago: {errorMessage}</p>
                    <p>Referencia: {reference}</p>
                    <p>ID de Transacción: {transactionId}</p>
                </>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};

export default PaymentResponse;
