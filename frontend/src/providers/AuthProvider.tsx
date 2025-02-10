import React, { useState } from "react";
import axios from "axios";
import APIS from "@/enums/apis";

interface ChildrenProps {
    children: React.ReactElement
}

interface AuthContextProps {
    token: string | null;
    user: object | null;
    loading: boolean;
    handleToken: (newToken: string) => undefined;
    handleUser: () => Promise<any>;
    setUser: React.Dispatch<React.SetStateAction<null>>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = React.createContext<AuthContextProps | null>(null);

function AuthProvider({ children }: ChildrenProps) {
    const [token, setToken] = React.useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleToken = function(newToken: string): undefined {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    }

    const handleUser = async () => {
        try {
            const res = await axios.get(APIS.USER_AUTHENTICATED);
            setUser(typeof res.data === "object" ? res.data : null);
            return res.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    React.useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = "" + token;
            localStorage.setItem('token', token);
            setTimeout(() => setLoading(false), 300);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
    }, [token]);

    const contextValue: AuthContextProps = React.useMemo(
        () => ({
          token,
          user,
          loading,
          handleToken,
          handleUser,
          setUser,
          setLoading
        }),
        [token, user, loading]
    );

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return React.useContext(AuthContext);
}

export default AuthProvider;
export { useAuth }