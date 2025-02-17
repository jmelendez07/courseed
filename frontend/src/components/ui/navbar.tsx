import { ArrowUpRight, LogIn, Menu, UserPlus } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import useInstitution from "@/hooks/useInstitution";
import useFaculty from "@/hooks/useFaculty";
import InstitutionInterface from "@/interfaces/institution";
import CategoryInterface from "@/interfaces/category";

interface MenuItem {
    title: string;
    url: string;
    items?: InstitutionInterface[] | CategoryInterface[];
    description?: string;
    icon?: JSX.Element;
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    auth?: {
        login: {
            text: string;
            url: string;
        };
        signup: {
            text: string;
            url: string;
        };
    };
}

const Navbar = ({
    logo = {
        url: "/",
        src: "/logo.png",
        alt: "Courseed",
        title: "Courseed",
    },
    auth = {
        login: { text: "Acceder", url: "/acceso" },
        signup: { text: "Registrarse", url: "/registro" },
    },
}: NavbarProps) => {

    const institutionHook = useInstitution({ size: 7 });
    const facultyHook = useFaculty({ size: 7 });

    const menu: MenuItem[] = [
        { title: "Educacion continuada", url: "/cursos" },
        {
            title: "Instituciones",
            url: "#",
            items: institutionHook.institutions
        },
        {
            title: "Facultades",
            url: "#",
            items: facultyHook.faculties
        },
        // {
        //     title: "Pricing",
        //     url: "#",
        // },
        // {
        //     title: "Blog",
        //     url: "#",
        // },
    ];

    return (
        <section className="py-4 flex justify-center">
            <div className="container px-4 md:px-8 xl:px-12 2xl:px-16">
                <nav className="hidden justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        <Link to={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="w-8" alt={logo.alt} />
                            <span className="text-lg font-semibold">{logo.title}</span>
                        </Link>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {menu.map((item) => renderMenuItem(item))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                    <div className="flex gap-2 ">
                        <Button asChild variant="outline" size="sm">
                            <Link 
                                to={auth.login.url}
                            >
                                {auth.login.text}
                                <LogIn />
                            </Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link 
                                to={auth.signup.url}
                            >
                                {auth.signup.text}
                                <UserPlus />
                            </Link>
                        </Button>
                    </div>
                </nav>
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        <Link to={logo.url} className="flex items-center gap-2">
                            <img src={logo.src} className="w-8" alt={logo.alt} />
                            <span className="text-lg font-semibold">{logo.title}</span>
                        </Link>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto" side="left">
                                <SheetHeader>
                                    <SheetTitle>
                                        <a href={logo.url} className="flex items-center gap-2">
                                            <img src={logo.src} className="w-8" alt={logo.alt} />
                                            <span className="text-lg font-semibold">
                                                {logo.title}
                                            </span>
                                        </a>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="my-6 flex flex-col gap-6">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {menu.map((item) => renderMobileMenuItem(item))}
                                    </Accordion>
                                    <div className="flex flex-col gap-3 border-t py-4">
                                        <Button asChild variant="outline">
                                            <Link to={auth.login.url}>
                                                {auth.login.text}
                                                <LogIn />
                                            </Link>
                                        </Button>
                                        <Button asChild>
                                            <Link to={auth.signup.url}>
                                                {auth.signup.text}
                                                <UserPlus />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section>
    );
};

const renderMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title} className="text-muted-foreground">
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="w-80 p-3">
                        <NavigationMenuLink>
                            {item.items.map((subItem, _) => (
                                <li key={subItem.id}>
                                    <Link
                                        className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground group"
                                        to={`cursos/?prop=${subItem.id}`}
                                    >
                                        <ArrowUpRight className="w-5 min-w-5 transition-transform group-hover:translate-x-1" />
                                        <div>
                                            <p className="text-sm leading-snug text-muted-foreground">
                                                {subItem.name}
                                            </p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </NavigationMenuLink>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <Link
            key={item.title}
            className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground"
            to={item.url}
        >
            {item.title}
        </Link>
    );
};

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem, _) => (
                        <Link
                            key={subItem.id}
                            className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground group"
                            to={`cursos/?prop=${subItem.id}`}
                        >
                            <ArrowUpRight className="w-5 min-w-5 transition-transform group-hover:translate-x-1" />
                            <div>
                                <p className="text-sm leading-snug text-muted-foreground">
                                    {subItem.name}
                                </p>
                            </div>
                        </Link>
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <Link key={item.title} to={item.url} className="font-semibold">
            {item.title}
        </Link>
    );
};

export { Navbar };