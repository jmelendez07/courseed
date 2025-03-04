import { useIsPublisher } from "@/providers/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedPublisherRoute() {
    const isAuth = useIsPublisher();
    if (isAuth === null) return null;
    return isAuth ? <Outlet /> : <Navigate to="/acceso" />;
}

export default ProtectedPublisherRoute;