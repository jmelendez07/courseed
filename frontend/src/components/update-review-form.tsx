import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import RatingInput from "./ui/rating-input";
import React from "react";

interface UpdateReviewFormProps {
    rating: number,
    content: string
}

function UpdateReviewForm() {
    
    const [form, setForm] = React.useState<UpdateReviewFormProps>({
        rating: 0,
        content: ""
    });

    const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(form);
    }

    return (
        <form onSubmit={handleSubmit} className="grid items-start gap-4">
            <div className="grid gap-2">
                <Label htmlFor="rating">Valoración</Label>
                <RatingInput onChange={value => setForm({
                    ...form,
                    rating: value
                })} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="content">Contenido</Label>
                <Textarea 
                    id="content" 
                    value={form.content}
                    onChange={e => setForm({
                        ...form,
                        content: e.target.value
                    })}
                    rows={5} 
                />
            </div>
            <Button type="submit">Actualizar Reseña</Button>
        </form>
    );
}

export default UpdateReviewForm;