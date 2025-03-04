import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { CalendarIcon, Info, LoaderCircle } from "lucide-react";
import useRegister from "@/hooks/useRegister";
import React from "react";
import { motion } from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import dayjs from "dayjs";
import { es } from "react-day-picker/locale";

enum STEPS {
	ONE = 1,
	TWO = 2
}

export function RegisterForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<"form">) {

	const register = useRegister();
	const [currentStep, setCurrentStep] = React.useState<STEPS>(STEPS.ONE);

	return (
		<form
			onSubmit={e => {
				e.preventDefault();
				register.handleRegister();
			}}
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Regístrate y comienza ya</h1>
				<p className="text-balance text-sm text-zinc-500 dark:text-zinc-400">
					Únete y descubre cursos para potenciar tus habilidades.
				</p>
			</div>
			{currentStep === STEPS.ONE && (
				<motion.div className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="email">Correo Electronico</Label>
						<Input
							id="email"
							type="email"
							autoComplete="email"
							placeholder="nombre@organizacion.tipo"
							onChange={register.setCredential}
							value={register.credentials.email}
							disabled={register.loading}
						/>
						{register.credentialsErrors.email && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.email}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Contraseña</Label>
						<Input
							id="password"
							type="password"
							autoComplete="new-password"
							onChange={register.setCredential}
							value={register.credentials.password}
							disabled={register.loading}
						/>
						{register.credentialsErrors.password && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.password}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Confirmar Contraseña</Label>
						<Input
							id="confirmPassword"
							type="password"
							autoComplete="new-password"
							onChange={register.setCredential}
							value={register.credentials.confirmPassword}
							disabled={register.loading}
						/>
						{register.credentialsErrors.confirmPassword && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.confirmPassword}
								</span>
							</p>
						)}
					</div>
					<Button
						type="button"
						className="w-full"
						disabled={register.loading}
						onClick={() => setCurrentStep(STEPS.TWO)}
					>
						Siguiente Paso
					</Button>
				</motion.div>
			)}

			{currentStep === STEPS.TWO && (
				<motion.div className="grid gap-6">
					<div className="grid gap-2">
						<Label htmlFor="academicLevel">Nivel Academico</Label>
						<Input
							id="academicLevel"
							type=""
							autoComplete="email"
							placeholder="nombre@organizacion.tipo"
							onChange={register.setCredential}
							value={register.credentials.email}
							disabled={register.loading}
						/>
						{register.credentialsErrors.email && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.email}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="sex">Sexo</Label>
						<Input
							id="sex"
							type=""
							autoComplete="email"
							placeholder="nombre@organizacion.tipo"
							onChange={register.setCredential}
							value={register.credentials.email}
							disabled={register.loading}
						/>
						{register.credentialsErrors.email && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.email}
								</span>
							</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="birthdate">Fecha de Nacimiento</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"w-full pl-3 text-left font-normal",
										!register.credentials.birthdate && "text-muted-foreground"
									)}
								>
									{register.credentials.birthdate ? (
										dayjs(register.credentials.birthdate.toISOString()).format("LL")
									) : (
										<span>Selecciona una fecha</span>
									)}
									<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0" align="start">
								<Calendar
									mode="single"
									locale=""
									selected={register.credentials.birthdate}
									onSelect={(value) => register.setCredentials({
										...register.credentials,
										birthdate: value
									})}
									disabled={(date) =>
										date > new Date() || date < new Date("1900-01-01")
									}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
						{register.credentialsErrors.email && (
							<p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
								<Info className="w-3 h-3 min-h-3 min-w-3" />
								<span>
									{register.credentialsErrors.email}
								</span>
							</p>
						)}
					</div>
					<Button type="submit" className="w-full" disabled={register.loading}>
						Registrarse
						{register.loading && (
							<LoaderCircle className="animate-spin" />
						)}
					</Button>
				</motion.div>
			)}

			<div className="text-center text-sm">
				¿Ya tienes cuenta?{" "}
				<Link to="/acceso" className="underline underline-offset-4">
					Inicia Sesión Aqui
				</Link>
			</div>
		</form>
	)
}
