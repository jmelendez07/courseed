import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function CreateCourseForm() {
    return (
        <form className="grid items-start gap-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Titulo</Label>
                <Input type="text" autoComplete="name" id="title" placeholder="Coloca el titulo del curso..." />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="url">Enlace</Label>
                <Input type="url" autoComplete="url" id="url" placeholder="protocolo://dominio.tld/subcarpeta" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input type="number" autoComplete="price" id="price" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="duration">Duración</Label>
                <Input type="text" autoComplete="duration" id="duration" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="modality">Modalidad</Label>
                <Input type="text" autoComplete="modality" id="modality" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="category">Categoria</Label>
                <Input type="text" autoComplete="category" id="category" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="institution">Institución</Label>
                <Input type="text" autoComplete="institution" id="institution" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Input type="text" autoComplete="description" id="description" />
            </div>
            <Button type="submit">Crear Curso</Button>
        </form>
    );
}

export default CreateCourseForm;