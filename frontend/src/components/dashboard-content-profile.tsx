import { useAuth } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import ROLES from "@/enums/roles";

function DashboardContentProfile() {

    const authHook = useAuth();

    const getName = React.useCallback(() => {
        const name = authHook?.user?.email.split('@')[0];
        if (name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return '';
    }, [authHook?.user?.email]);

    return (
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <Avatar className="h-32 w-32">
                <AvatarFallback className="text-4xl">{authHook?.user?.email.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-center md:text-left">
                <h1 className="text-3xl font-bold">{getName()}</h1>
                <p className="text-xl text-muted-foreground">{authHook?.user?.email}</p>
                <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                    {authHook?.user?.roles?.map((role) => (
                        <Badge key={role} variant="secondary">
                            {role === ROLES.ADMIN 
                                ? 'Administrador'
                                : role === ROLES.USER 
                                    ? 'Usuario'
                                    : role
                            }
                        </Badge>
                    ))}
                </div>
                <div className="flex justify-center gap-4 md:justify-start">
                    <div>
                        <span className="text-2xl font-bold">{authHook?.user?.likes}</span>
                        <span className="ml-1 text-muted-foreground">likes</span>
                    </div>
                    <div>
                        <span className="text-2xl font-bold">{authHook?.user?.reviews}</span>
                        <span className="ml-1 text-muted-foreground">reseñas</span>
                    </div>
                </div>
            </div>
            <div className="flex-grow" />
            <Button asChild>
                <Link to="/salir">
                    <LogOut className="mr-1 h-4 w-4" /> Cerrar Sesión
                </Link>
            </Button>
        </div>
    );
}

export default DashboardContentProfile;