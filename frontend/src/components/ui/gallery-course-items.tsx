import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import Course from "./course";
import CourseInterface from "@/interfaces/course";

interface GalleryCoursesProps {
    heading: string;
    linkText: string;
    url: string;
    items: CourseInterface[];
}

const GalleryCourseItems = ({
    heading,
    url,
    linkText,
    items,
}: GalleryCoursesProps) => {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    useEffect(() => {
        if (!carouselApi) {
            return;
        }
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
        };
        updateSelection();
        carouselApi.on("select", updateSelection);
        return () => {
            carouselApi.off("select", updateSelection);
        };
    }, [carouselApi]);
    return (
        <section className="py-12 flex flex-col items-center">
            <div className="container px-4 md:px-8 xl:px-12 2xl:px-16">
                <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
                    <div>
                        <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
                            {heading}
                        </h2>
                        <Link
                            to={url}
                            className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
                        >
                            {linkText}
                            <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                    <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollPrev();
                            }}
                            disabled={!canScrollPrev}
                            className="disabled:pointer-events-auto"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                                carouselApi?.scrollNext();
                            }}
                            disabled={!canScrollNext}
                            className="disabled:pointer-events-auto"
                        >
                            <ArrowRight className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <Carousel
                    setApi={setCarouselApi}
                    opts={{
                        breakpoints: {
                            "(max-width: 768px)": {
                                dragFree: true,
                            },
                        },
                    }}
                    className="relative"
                > 
                    <CarouselContent className="mx-0 mr-4 md:mx-4 xl:mx-8 2xl:mx-[max(3rem,calc(50vw-730px))]">
                        {items.map((item) => (
                            <CarouselItem key={item.id} className="pl-4 md:max-w-[400px] grid">
                                <Course 
                                    course={item}
                                    optionsEnable={false}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                {/* 2xl:mx-12 */}
            </div>
        </section>
    );
};

export { GalleryCourseItems };
