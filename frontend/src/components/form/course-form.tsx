import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { DialogContext } from "@/providers/DialogProvider";
import CourseInterface from "@/interfaces/course";
import ComboBoxResponsive from "@/components/ui/combo-box-responsive";
import useInstitution from "@/hooks/useInstitution";
import InstitutionInterface from "@/interfaces/institution";
import useFaculty from "@/hooks/useFaculty";
import CategoryInterface from "@/interfaces/category";
import axios, { AxiosError, AxiosResponse } from "axios";
import APIS from "@/enums/apis";
import { Info, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import dayjs from "dayjs";
import { useAuth } from "@/providers/AuthProvider";
import ROLES from "@/enums/roles";

const steps = {
    step1: 1,
    step2: 2
}

interface FormProps {
    title: string;
    price: number;
    duration: string;
    institution: InstitutionInterface | null;
    category: CategoryInterface | null,
    modality: string | undefined,
    url: string;
    image: string;
    description: string;
};

interface ErrorProps {
    url: string | null;
    title: string | null;
    modality: string | null;
    price: string | null;
    duration: string | null;
    categoryId: string | null;
    institutionId: string | null;
    courseId: string | null;
}

interface CourseFormProps {
    course?: CourseInterface;
    onCreated?: (course: CourseInterface) => void;
    onUpdated?: (course: CourseInterface) => void;
}

function CourseForm({ course, onCreated, onUpdated }: CourseFormProps) {
    const [currentStep, setCurrentStep] = React.useState<number>(steps.step1);
    const [form, setForm] = React.useState<FormProps>({
        url: course?.url ?? "",
        title: course?.title ?? "",
        image: course?.image ?? "",
        description: course?.description ?? "",
        modality: course?.modality,
        price: course?.price ?? 0,
        duration: course?.duration ?? "",
        category: course?.category ?? null,
        institution: course?.institution ?? null,
    });
    const [errors, setErrors] = React.useState<ErrorProps>({
        url: null,
        title: null,
        modality: null,
        price: null,
        duration: null,
        categoryId: null,
        institutionId: null,
        courseId: null
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const dialogContext = React.useContext(DialogContext);
    const institutionHook = useInstitution({ size: 8 });
    const facultyHook = useFaculty({ size: 7 });
    const { toast } = useToast();

    const authHook = useAuth();

    const modalities = [
        { id: 'Presencial', name: 'Presencial' },
        { id: 'Virtual', name: 'Virtual' },
        { id: 'Blended', name: 'Blended' },
    ];

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.id]: e.target.value
        });
    }

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (course) {
            handleUpdate();
        } else {
            handleCreate();
        }
    }

    const handleCreate = () => {
        setLoading(true);
        axios.post(APIS.COURSES_CREATE, {
            url: form.url,
            title: form.title,
            image: form.image,
            description: form.description,
            modality: form.modality,
            price: parseFloat(form.price.toString()),
            duration: form.duration,
            categoryId: form.category?.id,
            institutionId: form.institution?.id
        })
            .then((response: AxiosResponse<CourseInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${response.data.title} Creado!`,
                    description: dayjs().format("LLL"),
                });
                if (onCreated) {
                    onCreated(response.data);
                }
            })
            .catch((error: AxiosError<ErrorProps>) => {
                console.log(error);
                setErrors({
                    url: error.response?.data.url ?? null,
                    title: error.response?.data.title ?? null,
                    modality: error.response?.data.modality ?? null,
                    price: error.response?.data.price ?? null,
                    duration: error.response?.data.duration ?? null,
                    categoryId: error.response?.data.categoryId ?? null,
                    institutionId: error.response?.data.institutionId ?? null,
                    courseId: error.response?.data.courseId ?? null
                });

                if (error.response?.data.title || error.response?.data.price || error.response?.data.duration) {
                    setCurrentStep(1);
                } else if (error.response?.data.institutionId || error.response?.data.modality || error.response?.data.categoryId) {
                    setCurrentStep(2);
                }
            })
            .finally(() => setLoading(false))
    }

    const handleUpdate = () => {
        setLoading(true);
        axios.put(`${APIS.COURSES_UPDATE}${course?.id}`, {
            url: form.url,
            title: form.title,
            image: form.image,
            description: form.description,
            modality: form.modality,
            price: parseFloat(form.price.toString()),
            duration: form.duration,
            categoryId: form.category?.id,
            institutionId: form.institution?.id
        })
            .then((response: AxiosResponse<CourseInterface>) => {
                dialogContext?.setContext({
                    ...dialogContext.context,
                    open: false
                });
                toast({
                    title: `${response.data.title} Actualizado!`,
                    description: dayjs().format("LLL"),
                });
                if (onUpdated) {
                    onUpdated(response.data);
                }
            })
            .catch((error: AxiosError<ErrorProps>) => {
                if (error.response?.data.courseId) {
                    dialogContext?.setContext({
                        ...dialogContext.context,
                        open: false
                    });
                    toast({
                        title: `${course?.title}. Algo salió mal!`,
                        description: error.response.data.courseId,
                        variant: "destructive",
                    });
                } else {
                    setErrors({
                        url: error.response?.data.url ?? null,
                        title: error.response?.data.title ?? null,
                        modality: error.response?.data.modality ?? null,
                        price: error.response?.data.price ?? null,
                        duration: error.response?.data.duration ?? null,
                        categoryId: error.response?.data.categoryId ?? null,
                        institutionId: error.response?.data.institutionId ?? null,
                        courseId: error.response?.data.courseId ?? null
                    });

                    if (error.response?.data.title || error.response?.data.price || error.response?.data.duration) {
                        setCurrentStep(1);
                    } else if (error.response?.data.institutionId || error.response?.data.modality || error.response?.data.categoryId) {
                        setCurrentStep(2);
                    }
                }

            })
            .finally(() => setLoading(false));
    }

    React.useEffect(() => {
        if (authHook?.user?.roles?.some(r => r === ROLES.SUBSCRIBER) && institutionHook.institutions.some(i => i.name === "Institución para suscriptores")) {
            setForm({
                ...form,
                institution: institutionHook.institutions.find(i => i.name === "Institución para suscriptores") ?? null
            });
        }
    }, [authHook?.user, institutionHook.institutions]);

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            {currentStep === steps.step1 && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Titulo</Label>
                        <Input
                            id="title"
                            type="text"
                            autoComplete="name"
                            placeholder="Coloca el titulo del curso..."
                            value={form.title}
                            onChange={handleOnChange}
                            disabled={loading}
                        />
                        {errors.title && (
                            <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                <Info className="w-3 h-3 min-h-3 min-w-3" />
                                <span>
                                    {errors.title}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="institution">Institución</Label>
                        <ComboBoxResponsive
                            placeholder="Selecciona una institución"
                            statuses={(course?.institution && !institutionHook.institutions.some(i => i.id === course.institution.id))
                                ? [
                                    course?.institution,
                                    ...institutionHook.institutions
                                ]
                                : institutionHook.institutions
                            }
                            pagination={!institutionHook.isLastPage}
                            selectedStatus={form.institution}
                            setSelectedStatus={i => {
                                setForm({
                                    ...form,
                                    institution: i,
                                });
                            }}
                            disabled={authHook?.user?.roles?.some(role => role === ROLES.SUBSCRIBER)}
                            onPaginate={() => institutionHook.setPageNumber(institutionHook.pageNumber + 1)}
                        />
                        {errors.institutionId && (
                            <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                <Info className="w-3 h-3 min-h-3 min-w-3" />
                                <span>
                                    {errors.institutionId}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Precio</Label>
                            <Input
                                type="number"
                                autoComplete="price"
                                id="price"
                                value={form.price}
                                onChange={handleOnChange}
                                disabled={loading}
                            />
                            {errors.price && (
                                <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                    <Info className="w-3 h-3 min-h-3 min-w-3" />
                                    <span>
                                        {errors.price}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duración</Label>
                            <Input
                                type="text"
                                autoComplete="duration"
                                id="duration"
                                value={form.duration}
                                onChange={handleOnChange}
                                disabled={loading}
                            />
                            {errors.duration && (
                                <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                    <Info className="w-3 h-3 min-h-3 min-w-3" />
                                    <span>
                                        {errors.duration}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="grid col-span-2 md:col-span-1 gap-2">
                            <Label>Modalidad</Label>
                            <ComboBoxResponsive
                                placeholder="Selecciona una modalidad"
                                statuses={(course?.modality && !modalities.some(m => m.name.toLowerCase() === course.modality?.toLowerCase()))
                                    ? [
                                        { id: course?.modality, name: course?.modality },
                                        ...modalities
                                    ]
                                    : modalities
                                }
                                selectedStatus={{ id: form.modality, name: form.modality }}
                                setSelectedStatus={i => {
                                    setForm({
                                        ...form,
                                        modality: i?.name,
                                    });
                                }}
                            />
                            {errors.modality && (
                                <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                    <Info className="w-3 h-3 min-h-3 min-w-3" />
                                    <span>
                                        {errors.modality}
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="grid col-span-2 md:col-span-1 gap-2 max-w-full">
                            <Label>Facultad</Label>
                            <ComboBoxResponsive
                                placeholder="Selecciona una facultad"
                                statuses={(course?.category && !facultyHook.faculties.some(f => f.id === course.category.id))
                                    ? [
                                        course?.category,
                                        ...facultyHook.faculties
                                    ]
                                    : facultyHook.faculties
                                }
                                pagination={!facultyHook.isLastPage}
                                selectedStatus={form.category}
                                setSelectedStatus={i => {
                                    setForm({
                                        ...form,
                                        category: i,
                                    });
                                }}
                                onPaginate={() => facultyHook.setPageNumber(facultyHook.pageNumber + 1)}
                            />
                            {errors.categoryId && (
                                <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                    <Info className="w-3 h-3 min-h-3 min-w-3" />
                                    <span>
                                        {errors.categoryId}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => setCurrentStep(steps.step2)}
                            disabled={loading}
                            className="col-span-2 md:col-start-2"
                        >
                            Siguiente
                        </Button>
                    </div>
                </>
            )}

            {currentStep === steps.step2 && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="url">Enlace</Label>
                        <Input
                            type="url"
                            autoComplete="url"
                            id="url"
                            disabled={loading}
                            placeholder="protocolo://dominio.tld/subruta"
                            value={form.url}
                            onChange={handleOnChange}
                        />
                        {errors.url && (
                            <p className="flex items-start gap-1 text-xs text-red-600 line-clamp-2">
                                <Info className="w-3 h-3 min-h-3 min-w-3" />
                                <span>
                                    {errors.url}
                                </span>
                            </p>
                        )}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="url">Enlace de Imagen</Label>
                        <Input
                            type="url"
                            autoComplete="url"
                            id="image"
                            disabled={loading}
                            placeholder="protocolo://dominio.tld/subruta"
                            value={form.image}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            rows={5}
                            disabled={loading}
                            value={form.description}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            onClick={() => setCurrentStep(steps.step1)}
                            disabled={loading}
                        >
                            Anterior
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            <p className="max-w-full truncate inline-flex items-center gap-2">
                                {course ? 'Actualizar' : 'Crear'}
                                {loading && (
                                    <LoaderCircle className="animate-spin" />
                                )}
                            </p>
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
}

export default CourseForm;