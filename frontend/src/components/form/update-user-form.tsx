import UserInterface from "@/interfaces/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { ChevronLeft, ChevronRight, Info, LoaderCircle } from "lucide-react";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { useToast } from "@/hooks/use-toast";
import { DialogContext } from "@/providers/DialogProvider";
import dayjs from "dayjs";
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import ROLES from "@/enums/roles";

interface FormProps {
    email: string;
    password: string;
    roles: string[];
}

interface ErrorProps {
    userId: string | null;
    email: string | null;
    password: string | null;
    roles: string | null;
}

enum STEPS {
    FIRST = 1,
    SECOND = 2,
    THIRD = 3,
}

interface UpdateUserFormProps {
    user: UserInterface;
    onUpdate?: (user: UserInterface) => void;
}

function UpdateUserForm({ user, onUpdate }: UpdateUserFormProps) {
    const [currentStep, setCurrentStep] = React.useState<STEPS>(STEPS.FIRST);
    const [form, setForm] = React.useState<FormProps>({
        email: user.email ?? '',
        password: '',
        roles: user.roles ?? []
    });
    const [errors, setErrors] = React.useState<ErrorProps>({
        userId: null,
        email: null,
        password: null,
        roles: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const { toast } = useToast();
    const dialogContext = React.useContext(DialogContext);

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        switch (currentStep) {
            case STEPS.FIRST:
                handleUpdateEmail();
                break;
            case STEPS.SECOND:
                handleUpdatePassword();
                break;
            case STEPS.THIRD:
                handleUpdateRol();
                break;
        }
    }

    const handleUpdateEmail = () => {
        setLoading(true);
        axios.put(APIS.USER_UPDATE_EMAIL + user.id, {
            email: form.email
        })
            .then((response: AxiosResponse<UserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${response.data.email} Actualizado!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                if (onUpdate) onUpdate(response.data);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.userId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `Error al actualizar a ${user.email}. Algo salió mal!`,
                        description: error.response?.data.userId || error.message,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        userId: error.response?.data.userId ?? null,
                        email: error.response?.data.email ?? null,
                        password: error.response?.data.password ?? null,
                        roles: error.response?.data.roles ?? null
                    });
                }
            })
            .finally(() => setLoading(false));
    }

    const handleUpdatePassword = () => {
        setLoading(true);
        axios.put(APIS.USER_UPDATE_PASSWORD + user.id, {
            password: form.password
        })
            .then((response: AxiosResponse<UserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Contraseña de ${response.data.email} Actualizada!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                if (onUpdate) onUpdate(response.data);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.userId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `Error al actualizar a ${user.email}. Algo salió mal!`,
                        description: error.response?.data.userId || error.message,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        userId: error.response?.data.userId ?? null,
                        email: error.response?.data.email ?? null,
                        password: error.response?.data.password ?? null,
                        roles: error.response?.data.roles ?? null
                    });
                }
            })
            .finally(() => setLoading(false));
    }

    const handleUpdateRol = () => {
        setLoading(true);
        axios.put(APIS.USER_UPDATE_ROLES + user.id, {
            roles: form.roles
        })
            .then((response: AxiosResponse<UserInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `Rol de ${response.data.email} Actualizado!`,
                    description: dayjs(response.data.updatedAt).format("LLL"),
                });
                if (onUpdate) onUpdate(response.data);
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.userId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `Error al actualizar a ${user.email}. Algo salió mal!`,
                        description: error.response?.data.userId || error.message,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        userId: error.response?.data.userId ?? null,
                        email: error.response?.data.email ?? null,
                        password: error.response?.data.password ?? null,
                        roles: error.response?.data.roles ?? null
                    });
                }
            })
            .finally(() => setLoading(false));
    }

    return (
        <form onSubmit={handleSubmit} className="grid grid-rows-1 items-start gap-4">
            {currentStep === STEPS.FIRST && (
                <div className="grid gap-2">
                    <Label htmlFor="email">Correo Electronico</Label>
                    <Input 
                        type="email" 
                        autoComplete="email" 
                        id="email" 
                        placeholder="nombre@organizacion.tipo" 
                        value={form.email}
                        onChange={e => setForm({
                            ...form,
                            email: e.target.value
                        })}
                        disabled={loading}
                    />
                    {errors.email && (
                        <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                            <Info className="w-3 h-3 min-h-3 min-w-3" />
                            <span>
                                {errors.email}
                            </span>
                        </p>
                    )}
                </div>
            )}
            {currentStep === STEPS.SECOND && (
                <div className="grid gap-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        autoComplete="new-password" 
                        value={form.password}
                        onChange={e => setForm({
                            ...form,
                            password: e.target.value
                        })} 
                        disabled={loading}
                    />
                </div>
            )}

            {currentStep === STEPS.THIRD && (
                <div className="grid gap-2">
                    <Label htmlFor="roles">Roles</Label>
                    <ComboBoxResponsive
                        placeholder="Selecciona un rol" 
                        statuses={[
                           { id: ROLES.ADMIN, name: 'Administrador' }, 
                           { id: ROLES.USER, name: 'Usuario' } 
                        ]}
                        selectedStatus={
                            form.roles.length > 0 
                                ? { 
                                    id: form.roles[0], 
                                    name: form.roles[0] === ROLES.ADMIN 
                                        ? 'Administrador' 
                                        : form.roles[0] === ROLES.USER 
                                            ? 'Usuario'
                                            : form.roles[0] 
                                } 
                                : null
                        }
                        setSelectedStatus={newRole => setForm({
                            ...form,
                            roles: [newRole?.id ?? '']
                        })}
                    />
                </div>
            )}
            
            <div className={`
                    max-w-full grid items-center gap-2
                    ${(currentStep === STEPS.SECOND) 
                        ? 'grid-cols-[1fr_auto_auto]' 
                        : 'grid-cols-[1fr_auto]'
                    }
                `}>
                <Button 
                    type="submit"
                    disabled={loading}
                    className="max-w-full overflow-hidden"
                >
                    <p className="truncate">
                        {currentStep === STEPS.FIRST && 'Actualizar Correo'}
                        {currentStep === STEPS.SECOND && 'Actualizar Contraseña'}
                        {currentStep === STEPS.THIRD && 'Actualizar Rol'}
                    </p>
                    {loading && (
                        <LoaderCircle className="animate-spin" />
                    )}
                </Button>
                {(currentStep === STEPS.SECOND || currentStep === STEPS.THIRD) && (
                    <Button 
                        type="button" 
                        onClick={() => setCurrentStep(currentStep === STEPS.SECOND ? STEPS.FIRST : STEPS.SECOND)}
                        disabled={loading}
                    >
                        <ChevronLeft />
                    </Button>
                )}
                {(currentStep === STEPS.FIRST || currentStep === STEPS.SECOND) && (
                    <Button 
                        type="button" 
                        onClick={() => setCurrentStep(currentStep === STEPS.FIRST ? STEPS.SECOND : STEPS.THIRD)}
                        disabled={loading}
                    >
                        <ChevronRight />
                    </Button>
                )}
            </div>
        </form>
    );
}

export default UpdateUserForm;