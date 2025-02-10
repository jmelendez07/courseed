import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useLogin from "@/hooks/useLogin";
import { Link } from "react-router-dom";

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {

	const login = useLogin();

	return (
		<form 
			onSubmit={e => {
				e.preventDefault();
				login.handleLogin();
			}} 
			className={cn("flex flex-col gap-6", className)} 
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Inicie sesión en su cuenta</h1>
				<p className="text-balance text-sm text-zinc-500 dark:text-zinc-400">
					Ingrese su correo electrónico a continuación para iniciar sesión en su cuenta
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-2">
					<Label htmlFor="email">Correo Electronico</Label>
					<Input 
						id="email" 
						type="email" 
						placeholder="m@example.com" 
						onChange={login.setCredential}
						value={login.credentials.email}
					/>
				</div>
				<div className="grid gap-2">
					<Label htmlFor="password">Contraseña</Label>
					<Input 
						id="password" 
						type="password" 
						onChange={login.setCredential}
						value={login.credentials.password}
					/>
				</div>
				<Button type="submit" className="w-full">
					Acceder
				</Button>
			</div>
			<div className="text-center text-sm">
				¿No tienes una cuenta?{" "}
				<Link to="/registro" className="underline underline-offset-4">
					Registrate Aqui
				</Link>
			</div>
		</form>
	)
}
