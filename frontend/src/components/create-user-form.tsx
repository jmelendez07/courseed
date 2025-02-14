import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function CreateUserForm() {
    return (
        <form className="grid items-start gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Correo Electronico</Label>
                <Input type="email" autoComplete="email" id="email" placeholder="nombre@organizacion.tipo" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" autoComplete="new-password" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input id="confirmPassword" type="password" autoComplete="new-password" />
            </div>
            <Button type="submit">Registrar Usuario</Button>
        </form>
    );
}

export default CreateUserForm;