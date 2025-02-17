import { Book, LogIn, Menu, Sunset, Trees, UserPlus, Zap } from "lucide-react";

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

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: JSX.Element;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
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
    menu = [
        { title: "Educacion continuada", url: "/cursos" },
        {
            title: "Instituciones",
            url: "#",
            items: [
                {
                    title: "Blog",
                    description: "The latest industry news, updates, and info",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Company",
                    description: "Our mission is to innovate and empower the world",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Careers",
                    description: "Browse job listing and discover our workspace",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Support",
                    description:
                        "Get in touch with our support team or visit our community forums",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "#",
                },
            ],
        },
        {
            title: "Facultades",
            url: "#",
            items: [
                {
                    title: "Help Center",
                    description: "Get all the answers you need right here",
                    icon: <Zap className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Contact Us",
                    description: "We are here to help you with any questions you have",
                    icon: <Sunset className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Status",
                    description: "Check the current status of our services and APIs",
                    icon: <Trees className="size-5 shrink-0" />,
                    url: "#",
                },
                {
                    title: "Terms of Service",
                    description: "Our terms and conditions for using our services",
                    icon: <Book className="size-5 shrink-0" />,
                    url: "#",
                },
            ],
        },
        {
            title: "Pricing",
            url: "#",
        },
        {
            title: "Blog",
            url: "#",
        },
    ],
    auth = {
        login: { text: "Acceder", url: "/acceso" },
        signup: { text: "Registrarse", url: "/registro" },
    },
}: NavbarProps) => {

    const institutionHook = useInstitution({ size:7 });
    const facultyHook = useFaculty({ size: 7 });

    console.log(facultyHook);

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
                            {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                    <Link
                                        className="flex select-none gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                                        to={subItem.url}
                                    >
                                        {subItem.icon}
                                        <div>
                                            <div className="text-sm font-semibold">
                                                {subItem.title}
                                            </div>
                                            {subItem.description && (
                                                <p className="text-sm leading-snug text-muted-foreground">
                                                    {subItem.description}
                                                </p>
                                            )}
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
                    {item.items.map((subItem) => (
                        <Link
                            key={subItem.title}
                            className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                            to={subItem.url}
                        >
                            {subItem.icon}
                            <div>
                                <div className="text-sm font-semibold">{subItem.title}</div>
                                {subItem.description && (
                                    <p className="text-sm leading-snug text-muted-foreground">
                                        {subItem.description}
                                    </p>
                                )}
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