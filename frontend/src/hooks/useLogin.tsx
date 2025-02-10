import APIS from "@/enums/apis";
import axios from "axios";
import React from "react";

interface CredentialsProps {
    email: string;
    password: string;
}

interface CredentialsErrorProps {
    email: string | null;
    password: string | null;
    auth: string | null;
}

function useLogin() {
    const [credentials, setCredentials] = React.useState<CredentialsProps>({
        email: '',
        password: ''
    });
    const [credentialsErrors, setCredentialsErrors] = React.useState<CredentialsErrorProps>({
        email: null,
        password: null,
        auth: null
    })
    const [loading, setLoading] = React.useState<boolean>(false);
    const [token, setToken] = React.useState<string | null>(null);

    const setCredential = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    }

    const handleLogin = async () => {
        setLoading(true);
        axios.post(APIS.LOGIN, credentials)
            .then(response => {
                if (response.data) {
                    setCredentialsErrors({
                        email: null,
                        password: null,
                        auth: null
                    });
                }
                console.log(response);
            })
            .catch(error => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return {
        credentials,
        credentialsErrors,
        loading,
        token,
        setCredentials,
        setCredential,
        setCredentialsErrors,
        setLoading,
        setToken,
        handleLogin
    };
}

export default useLogin;