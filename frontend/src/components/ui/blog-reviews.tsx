import { Badge } from "@/components/ui/badge";
import { forwardRef } from "react";
import ReviewInterface from "@/interfaces/review";
import Review from "./review";
import { Button } from "./button";
import { ChevronUp } from "lucide-react";

interface BlogReviewsProps {
    tagline: string;
    heading: string;
    description: string;
    reviews: ReviewInterface[]
}

const BlogReviews = forwardRef<HTMLElement, BlogReviewsProps>(({
    tagline,
    heading,
    description,
    reviews,
}, ref) => {
    return (
        <section ref={ref} className="py-12">
            <div className="w-full mx-auto flex px-4 md:px-8 xl:px-12 2xl:px-16 flex-col items-center gap-16 lg:px-16">
                <div className="text-center">
                    <Badge variant="secondary" className="mb-6">
                        {tagline}
                    </Badge>
                    <h2 className="mb-3 text-pretty text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6 lg:max-w-3xl lg:text-5xl">
                        {heading}
                    </h2>
                    <p className="mb-8 text-muted-foreground md:text-base lg:max-w-2xl lg:text-lg">
                        {description}
                    </p>
                </div>
                {reviews.length > 0 ? (
                    <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 2xl:flex 2xl:flex-wrap 2xl:items-center">
                        {reviews.map(review => (
                            <Review
                                key={review.id}
                                review={review}
                                className="md:w-[400px] md:max-w-[400px]"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                        >
                            ¡No hay Reseñas! Vuelve arriba.
                            <ChevronUp />
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
});

export { BlogReviews };
