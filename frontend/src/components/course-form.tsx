import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React from "react";
import { DialogContext } from "@/providers/DialogProvider";

const steps = {
    step1: 1,
    step2: 2,
    step3: 3,
}

interface FormProps {
    title: string;
    price: number;
    duration: string;
    institution: string | undefined;
    category: string | undefined,
    modality: string | undefined,
    url: string;
    image: string;
    description: string;
};

function CourseForm() {

    const [currentStep, setCurrentStep] = React.useState<number>(steps.step1);
    const [form, setForm] = React.useState<FormProps>({
        title: "",
        price: 0,
        duration: "",
        institution: undefined,
        category: undefined,
        modality: undefined,
        url: "",
        image: "",
        description: ""
    });

    const dialogContext = React.useContext(DialogContext)

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({
            ...form,
            [e.target.id]: [e.target.value]
        });
    }

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        dialogContext?.setContext({
            ...dialogContext.context,
            open: false
        });
    }

    React.useEffect(() => {
        dialogContext?.setContext({
            ...dialogContext.context,
            title: `Crear Nuevo Curso ${currentStep}/${Object.keys(steps).length}`,
            description: currentStep === steps.step1 
                ? "Establece el título, precio y duración de tu curso para comenzar a crearlo."
                : currentStep === steps.step2
                    ? "Selecciona una institución, modalidad y categoria."
                    : "Establece la url del curso y de imagen. Adicionalmente la descripción para terminar de crearlo."
        });
    }, [currentStep]);

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            {currentStep === steps.step1 && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Titulo</Label>
                        <Input 
                            type="text" 
                            autoComplete="name" 
                            id="title" 
                            placeholder="Coloca el titulo del curso..." 
                            value={form.title}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Precio</Label>
                        <Input 
                            type="number" 
                            autoComplete="price" 
                            id="price" 
                            value={form.price}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="duration">Duración</Label>
                        <Input 
                            type="text" 
                            autoComplete="duration" 
                            id="duration"
                            value={form.duration}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Button onClick={() => setCurrentStep(steps.step2)}>Siguiente</Button>
                    </div>
                </>
            )}

            {currentStep === steps.step2 && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="institution">Institución</Label>
                        <Select onValueChange={value => setForm({
                            ...form,
                            institution: value
                        })} value={form.institution}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una modalidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Instituciones Disponibles</SelectLabel>
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="virtual">Virtual</SelectItem>
                                    <SelectItem value="blended">Blended</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="modality">Modalidad</Label>
                        <Select onValueChange={value => setForm({
                            ...form,
                            modality: value
                        })} value={form.modality}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Selecciona una modalidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Modalidades Disponibles</SelectLabel>
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="virtual">Virtual</SelectItem>
                                    <SelectItem value="blended">Blended</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Select onValueChange={value => setForm({
                            ...form,
                            category: value
                        })} value={form.category}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Selecciona una modalidad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Categorias Disponibles</SelectLabel>
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="virtual">Virtual</SelectItem>
                                    <SelectItem value="blended">Blended</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => setCurrentStep(steps.step1)}>Anterior</Button>
                        <Button onClick={() => setCurrentStep(steps.step3)}>Siguiente</Button>
                    </div>
                </>
            )}

            {currentStep === steps.step3 && (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="url">Enlace</Label>
                        <Input 
                            type="url" 
                            autoComplete="url" 
                            id="url" 
                            placeholder="protocolo://dominio.tld/subruta" 
                            value={form.url}
                            onChange={handleOnChange}    
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="url">Enlace de Imagen</Label>
                        <Input 
                            type="url" 
                            autoComplete="url" 
                            id="image" 
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
                            value={form.description}
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={() => setCurrentStep(steps.step2)}>Anterior</Button>
                        <Button type="submit">Crear Curso</Button>
                    </div>
                </>
            )}
        </form>
    );
}

export default CourseForm;