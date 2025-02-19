import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useCourses from "@/hooks/useCourses";
import useInstitution from "@/hooks/useInstitution";
import { GraduationCap, LucideProps, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroProps {
    heading?: string;
    description?: string;
    button?: {
        text: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
        url: string;
    };
}

const Hero = ({
    heading = "Tu educación continuada en un solo lugar.",
    description = "¡Bienvenido a CourSeed! Navega entre cursos, talleres y diplomados. Lleva tu educación al siguiente nivel.",
    button = {
        text: "Explorar Educación",
        icon: GraduationCap,
        url: "/cursos",
    },
}: HeroProps) => {

    const institutionHook = useInstitution({ size: 3 });
    const courseHook = useCourses({ size: 4 });

    return (
        <section className="py-12 md:py-20 flex justify-center">
            <div className="container px-4 md:px-8 xl:px-12 2xl:px-16">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex-1">
                        <div className="flex flex-col gap-4 lg:gap-8">
                            <h1 className="max-w-[80%] text-4xl font-semibold leading-tight text-foreground lg:text-5xl xl:text-7xl">
                                {heading}
                            </h1>
                            <p className="text-lg leading-relaxed text-muted-foreground xl:text-2xl">
                                {description}
                            </p>
                        </div>
                        <div className="my-6 lg:my-10 flex items-center gap-2">
                            <Button asChild size="lg">
                                <Link to={button.url}>{button.text}<button.icon /></Link>
                            </Button>
                            <Button size="icon">
                                <Search />
                            </Button>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative flex -space-x-[1.5rem]">
                                {institutionHook.institutions.map((institution, index) => (
                                    <Avatar
                                        key={index}
                                        className={`relative z-${index + 1}0 flex h-12 w-12 flex-shrink-0 rounded-full border-2 border-white object-cover`}
                                    >
                                        <AvatarImage src={institution.name} alt="" />
                                        <AvatarFallback>{institution.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                ))}
                            </div>
                            <div>
                                <p className="mb-1 text-sm italic text-muted2-foreground">
                                    &quot;Cursos diseñados para tu éxito&quot;
                                </p>
                                <p className="text-sm font-medium text-muted2-foreground xl:max-w-[70%]">
                                    {institutionHook.institutions.map(i => i.name).join(", ")}.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full flex-1">
                        <div className="w-full max-w-[50rem]">
                            <AspectRatio ratio={1 / 1} className="h-full w-full">
                                <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[3.5%]">
                                    <div className="overflow-hidden rounded-[5.2%] bg-gray-100">
                                        {courseHook.courses.length > 0 && (
                                            <img
                                                src={courseHook.courses[0].image}
                                                alt=""
                                                className="object-cover h-full w-full object-center"
                                            />
                                        )}
                                    </div>
                                    <div className="relative overflow-hidden rounded-[5.2%] bg-gray-100">
                                        {courseHook.courses.length > 1 && (
                                            <div className="absolute left-[5%] top-1/2 w-[110%] max-w-[25rem] -translate-y-1/2 overflow-hidden rounded-md">
                                                <AspectRatio ratio={1.739130435 / 1}>
                                                    <img
                                                        src={courseHook.courses[1].image}
                                                        alt=""
                                                        className="size-full object-cover object-center"
                                                    />
                                                </AspectRatio>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative overflow-hidden rounded-[5.2%] bg-gray-100">
                                        {courseHook.courses.length > 2 && (
                                            <div className="absolute left-[9%] top-[9%] w-[200%] max-w-[37.5rem] overflow-hidden rounded-md">
                                                <AspectRatio ratio={1.6 / 1}>
                                                    <img
                                                        src={courseHook.courses[2].image}
                                                        alt=""
                                                        className="size-full object-cover object-center"
                                                    />
                                                </AspectRatio>
                                            </div>
                                        )}
                                    </div>
                                    <div className="relative overflow-hidden rounded-[5.2%] bg-gray-100">
                                        <div className="relative left-[50%] top-[12%] w-[70%] max-w-[17.5rem] -translate-x-[50%]">
                                            <AspectRatio ratio={0.52 / 1}>
                                                <img
                                                    src="https://shadcnblocks.com/images/block/mockups/phone-1.png"
                                                    alt=""
                                                    className="absolute z-20 w-full"
                                                />
                                                {courseHook.courses.length > 3 && (
                                                <img
                                                    src={courseHook.courses[3].image}
                                                    alt=""
                                                    className="absolute z-10 w-full rounded-[16%] bg-red-100 h-full object-cover"
                                                />
                                                )}
                                            </AspectRatio>
                                        </div>
                                    </div>
                                </div>
                            </AspectRatio>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Hero };