import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useCourses from "@/hooks/useCourses";
import useInstitution from "@/hooks/useInstitution";
import { GraduationCap, LucideProps } from "lucide-react";
import { Link } from "react-router-dom";
import DialogCourses from "../dialog-courses";
import React from "react";
import { motion } from "motion/react";
import FadeItem from "./fadeItem";

interface HeroProps {
    heading?: string;
    description?: string;
    button?: {
        text: string;
        icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
        url: string;
    };
}

let easeing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
    animate: {
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.2,
            staggerDirection: 1
        }
    }
}

const fadeInUp = {
    initial: {
        y: -60,
        opacity: 0,
        transition: { duration: 0.6, ease: easeing }
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easeing
        }
    }
};

const btnGroup = {
    initial: {
        y: -60,
        opacity: 0,
        transition: { duration: 0.6, ease: easeing }
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easeing
        }
    }
};

const star = {
    initial: {
        y: 60,
        opacity: 0,
        transition: { duration: 0.8, ease: easeing }
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easeing
        }
    }
};

const img = {
    initial: {
        x: 200,
        opacity: 0,
        transition: { duration: 0.6, ease: easeing }
    },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: easeing
        }
    }
}

const Hero = ({
    heading = "Tu educación continua en un solo lugar.",
    description = "¡Bienvenido a CourSeed! Navega entre cursos, talleres y diplomados. Lleva tu educación al siguiente nivel.",
    button = {
        text: "Explorar Educación",
        icon: GraduationCap,
        url: "/educacion",
    },
}: HeroProps) => {

    const institutionHook = useInstitution({ size: 3 });
    const courseHook = useCourses({ size: 4 });

    return (
        <motion.section
            className="py-12 md:py-12 flex justify-center"
            initial="initial"
            animate="animate"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: easeing }}
                className="w-full px-4 md:px-8 xl:px-12 2xl:px-16"
            >
                <div className="flex flex-col items-center gap-8 md:flex-row">
                    <motion.div key={institutionHook.institutions.length} variants={stagger} className="flex-1">
                        <div className="flex flex-col gap-4 lg:gap-8">
                            <motion.h1 variants={fadeInUp} className="max-w-[80%] text-4xl font-semibold leading-tight text-foreground lg:text-5xl xl:text-7xl">
                                <FadeItem>
                                    {heading}
                                </FadeItem>
                            </motion.h1>
                            <FadeItem>
                                <motion.p variants={fadeInUp} className="text-lg leading-relaxed text-muted-foreground xl:text-2xl">
                                    {description}
                                </motion.p>
                            </FadeItem>
                        </div>
                        <div className="my-6 lg:my-10 flex items-center gap-2">
                            <motion.div variants={btnGroup}>
                                <FadeItem>
                                    <Button asChild size="lg">
                                        <Link to={button.url}>{button.text}<button.icon /></Link>
                                    </Button>
                                </FadeItem>
                            </motion.div>
                            <motion.div variants={btnGroup}>
                                <FadeItem>
                                    <DialogCourses />
                                </FadeItem>
                            </motion.div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative flex -space-x-[1.5rem]">
                                {institutionHook.institutions.map((institution, index) => (
                                    <motion.div key={index} variants={star} whileHover={{ scale: 1.2, borderRadius: '100%', cursor: 'pointer', zIndex: 2 }}>
                                        <FadeItem>
                                            <Avatar
                                                key={index}
                                                className={`relative flex h-12 w-12 flex-shrink-0 rounded-full border-2 dark:border-0 object-cover`}
                                            >
                                                <AvatarFallback>
                                                    {institution.name
                                                        ? institution.name.slice(0, 2).toUpperCase()
                                                        : 'UL'
                                                    }
                                                </AvatarFallback>
                                            </Avatar>
                                        </FadeItem>
                                    </motion.div>
                                ))}
                            </div>
                            <div>
                                <FadeItem>
                                    <motion.p variants={star} className="mb-1 text-sm italic text-muted2-foreground">
                                        &quot;Cursos diseñados para tu éxito&quot;
                                    </motion.p>
                                </FadeItem>
                                <FadeItem>
                                    <motion.p variants={star} className="text-sm font-medium text-muted2-foreground xl:max-w-[70%]">
                                        {institutionHook.institutions.map(i => i.name).join(", ")}.
                                    </motion.p>
                                </FadeItem>
                            </div>
                        </div>
                    </motion.div>
                    <div className="w-full flex-1">
                        <div className="w-full">
                            <AspectRatio ratio={1 / 1} className="h-full w-full overflow-hidden">
                                <motion.div
                                    className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[3.5%]"
                                    variants={stagger}
                                >
                                    <motion.div variants={img} className="overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        {courseHook.courses.length > 0 && (
                                            <FadeItem
                                                className="h-full w-full"
                                            >
                                                <img
                                                    src={courseHook.courses[0].image}
                                                    alt=""
                                                    className="object-cover h-full w-full object-center"
                                                />
                                            </FadeItem>
                                        )}
                                    </motion.div>
                                    <motion.div variants={img} className="relative overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        {courseHook.courses.length > 1 && (
                                            <div className="absolute left-[5%] top-1/2 w-[110%] max-w-[25rem] -translate-y-1/2 overflow-hidden rounded-md">
                                                <FadeItem>
                                                    <AspectRatio ratio={1.739130435 / 1}>
                                                        <img
                                                            src={courseHook.courses[1].image}
                                                            alt=""
                                                            className="size-full object-cover object-center"
                                                        />
                                                    </AspectRatio>
                                                </FadeItem>
                                            </div>
                                        )}
                                    </motion.div>
                                    <motion.div variants={img} className="relative overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        {courseHook.courses.length > 2 && (
                                            <div className="absolute left-[9%] top-[9%] w-[200%] max-w-[37.5rem] overflow-hidden rounded-md">
                                                <FadeItem>
                                                    <AspectRatio ratio={1.6 / 1}>
                                                        <img
                                                            src={courseHook.courses[2].image}
                                                            alt=""
                                                            className="size-full object-cover object-center"
                                                        />
                                                    </AspectRatio>
                                                </FadeItem>
                                            </div>
                                        )}
                                    </motion.div>
                                    <motion.div variants={img} className="relative overflow-hidden rounded-[5.2%] bg-gray-100 dark:bg-zinc-950">
                                        <FadeItem>
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
                                                            className="absolute z-10 w-full rounded-[16%] h-full object-cover"
                                                        />
                                                    )}
                                                </AspectRatio>
                                            </div>
                                        </FadeItem>
                                    </motion.div>
                                </motion.div>
                            </AspectRatio>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.section>
    );
};

export { Hero };