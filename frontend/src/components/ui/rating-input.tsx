import React from "react";
import { Star } from "lucide-react";

interface RatinInputProps {
    onChange?: (rating: number) => void
}

function RatingInput({ onChange }: RatinInputProps) {
    const [rating, setRating] = React.useState<number>(0);
    const [hover, setHover] = React.useState<number>(0);

    const handleRating = (value: number) => {
        setRating(value);
        if (onChange) onChange(value);
    }

    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    className={`p-0 ${(hover || rating) >= star ? "text-yellow-400 hover:text-yellow-400/30" : "text-gray-300"}`}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    type="button"
                >
                    <Star className="size-5 fill-current" />
                </button>
            ))}
        </div>
    )
}

export default RatingInput;