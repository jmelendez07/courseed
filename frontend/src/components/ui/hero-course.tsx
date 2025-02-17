import { ArrowUpRight, MessageSquareText, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import ReviewInterface from "@/interfaces/review";
import { cn } from "@/lib/utils";

interface HeroCourseProps {
    url?: string;
    image?: string;
    heading?: string;
    description?: string;
    buttons?: {
        primary: {
            text: string;
            url: string;
        };
        secondary?: {
            text: string;
            url: string;
        };
    };
    reviews?: ReviewInterface[];
    handlePrimaryButton?: () => void;
    duration?: string,
    price?: number,
    modality?: string
}

const HeroCourse = ({
    url,
    image,
    heading,
    description,
    reviews,
    handlePrimaryButton,
    duration,
    price,
    modality
}: HeroCourseProps) => {

    function getAverageRating(): number {
        if (!reviews) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return reviews.length > 0 ? totalRating / reviews.length : 0;
    }

    const options = [
        {
            "name": "Duración",
            "value": duration
        },
        {
            "name": "Modalidad",
            "value": modality
        },
        {
            "name": "Precio",
            "value": price
        }
    ];

    return (
        <section className="py-12 flex justify-center">
            <div className="container grid items-start px-4 md:px-8 xl:px-12 2xl:px-16 gap-10 lg:grid-cols-2 lg:gap-20">
                <div
                    className="mx-auto flex flex-col items-center text-center md:ml-auto lg:max-w-3xl 
                    lg:items-start lg:text-left top-0 h-fit md:sticky"
                >
                    <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl xl:text-7xl">
                        {heading}
                    </h1>
                    <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl text-justify line-clamp-3">
                        {description}
                    </p>
                    <div className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
                        <span className="inline-flex items-center -space-x-4">
                            {reviews && reviews.map((review, index) => (
                                <Avatar key={index} className="size-12 border">
                                    <AvatarFallback className="rounded-lg">{review.user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            ))}
                        </span>
                        <div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`size-5 ${index < getAverageRating()
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'fill-gray-300 text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <p className="text-left font-medium text-muted-foreground">
                                {(reviews && reviews.length > 0) ? (
                                    <>{reviews.length} Reseñas de Usuarios</>
                                ) : (
                                    <>Aun no hay reseñas</>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                        <Button onClick={() => {
                            if (handlePrimaryButton) handlePrimaryButton()
                        }} className="w-full sm:w-auto">
                            Reseñas
                            <MessageSquareText />
                        </Button>
                        <Button asChild variant="outline" className="w-full sm:w-auto">
                            <a
                                href={url}
                                target="_blank"
                            >
                                Visitar Sitio Oficial
                                <ArrowUpRight className="ml-2 size-4" />
                            </a>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-12 md:gap-20">
                    <div className="flex bg-muted">
                        <img
                            src={image}
                            alt={heading}
                            className="min-h-[350px] max-h-[600px] w-full rounded-md object-cover lg:h-[600px] lg:max-h-[800px]"
                        />
                    </div>
                    <section className="py-12">
                        <div className="text-center lg:text-left">
                            <h1 className="text-left text-3xl font-medium md:text-4xl">
                                Caracteristicas
                            </h1>
                        </div>
                        <div className="mx-auto flex flex-col">
                            {options.map(option => (
                                <div
                                    className="flex items-center justify-between border-b py-6"
                                >
                                    <p className="font-semibold">
                                        {option.name}
                                    </p>
                                    <div
                                        className={cn(
                                            buttonVariants({
                                                variant: "outline",
                                                size: "sm",
                                            }),
                                            "pointer-events-none rounded-full",
                                        )}
                                    >
                                        {option.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    );
};

export { HeroCourse };
