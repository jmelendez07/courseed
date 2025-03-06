import APIS from "@/enums/apis";
import { useAuth } from "@/providers/AuthProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";

function useSubscribe() {
    const [currentPlan, setCurrentPlan] = React.useState();

    const authHook = useAuth();

    const handleSubscribe = React.useCallback(() => {
        if (!authHook?.user) return;
        axios.put(APIS.SUBSCRIBE)
            .then((response: AxiosResponse) => {
                authHook?.handleToken(response.data.token);
            })
            .catch((error: AxiosError) => {
                console.log(error);
            })
    }, [authHook]);

    return {
        currentPlan,
        setCurrentPlan,
        handleSubscribe,
    }
}

export default useSubscribe;