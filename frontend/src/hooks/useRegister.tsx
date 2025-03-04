import APIS from "@/enums/apis";
import ROLES from "@/enums/roles";
import TOKEN from "@/enums/token";
import { useAuth } from "@/providers/AuthProvider";
import axios, { AxiosError, AxiosResponse } from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CredentialsProps {
    email: string;
    password: string;
    confirmPassword: string;
    birthdate: Date | undefined;
}

interface CredentialsErrorsProps {
    email: string | null;
    password: string | null;
    confirmPassword: string | null;
}

interface CredentialLoginErrorsProps {
    email: string | null;
    password: string | null;
    auth: string | null;
}

interface AuthCredentialsProps {
    roles: Array<String> | null;
}

function useRegister() {
    const [credentials, setCredentials] = React.useState<CredentialsProps>({
        email: '',
        password: '',
        confirmPassword: '',
        birthdate: undefined
    });
    const [credentialsErrors, setCredentialsErrors] = React.useState<CredentialsErrorsProps>({
        email: null,
        password: null,
        confirmPassword: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    
    const auth = useAuth();
    const navigate = useNavigate();

    const setCredential = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.id]: e.target.value
        });
    }

    const handleRegister = async () => {
        setLoading(true);
        axios.post(APIS.REGISTER, credentials)
            .then((response: AxiosResponse) => {
                if (response.data) {
                    setCredentialsErrors({
                        email: null,
                        password: null,
                        confirmPassword: null
                    });

                    handleLogin();
                }
            })
            .catch((error: AxiosError<CredentialsErrorsProps>) => {
                if (!error.response?.data) return;

                if (error.response.data.confirmPassword) {
                    setCredentials({
                        ...credentials,
                        confirmPassword: ''
                    });
                }

                setCredentialsErrors({
                    email: error.response.data.email,
                    password: error.response.data.password,
                    confirmPassword: error.response.data.confirmPassword
                });
            })
            .finally(() => setLoading(false));
    }

    const handleLogin = async () => {
        axios.post(APIS.LOGIN, {
            email: credentials.email,
            password: credentials.password
        })
            .then((response: AxiosResponse) => {
                auth?.handleToken(response.data.token);
                redirectByRole(response.data.token);
            })
            .catch((error: AxiosError<CredentialLoginErrorsProps>) => {
                if (!error.response?.data) return;
                
                setCredentialsErrors({
                    email: error.response.data.email,
                    password: error.response.data.password,
                    confirmPassword: error.response.data.auth
                });
            });
    }

    const redirectByRole = (token: string) => {
        axios.get(APIS.USER_AUTHENTICATED, {
            headers: {
                Authorization: `${TOKEN.PREFIX} ${token}`
            }
        })
            .then((response: AxiosResponse<AuthCredentialsProps>) => {
                if (response.data && Array.isArray(response.data.roles)) {
                    navigate(response.data.roles.some(role => role === ROLES.ADMIN)
                            ? "/administrador"
                            : "/usuario",
                        { replace: true }
                    );
                } else {
                    setCredentialsErrors({
                        ...credentialsErrors,
                        confirmPassword: "Le informamos que estamos experimentando problemas técnicos en nuestro servidor."
                    });
                }
            })
            .catch(error => {
                console.error(error);
                setCredentialsErrors({
                    ...credentialsErrors,
                    confirmPassword: "Le informamos que estamos experimentando problemas técnicos en nuestro servidor."
                });
            });
    }

    return {
        credentials,
        credentialsErrors,
        loading,
        setCredentials,
        setCredentialsErrors,
        setLoading,
        setCredential,
        handleRegister
    }
}

export default useRegister;