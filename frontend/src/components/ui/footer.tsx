import { Link } from "react-router-dom";

interface MenuItem {
    title: string;
    links: {
        text: string;
        url: string;
    }[];
}

interface FooterProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    tagline?: string;
    menuItems?: MenuItem[];
    copyright?: string;
    bottomLinks?: {
        text: string;
        url: string;
    }[];
}

const Footer = ({
    logo = {
        src: "/logo.png",
        alt: "Courseed",
        title: "Courseed",
        url: "/",
    },
    tagline = "Todo en un solo lugar.",
    menuItems = [
        {
            title: "Producto",
            links: [
                { text: "Descripción General", url: "#" },
                { text: "Precios", url: "#" },
                { text: "Mercado", url: "#" },
                { text: "Características", url: "#" },
                { text: "Integraciones", url: "#" },
            ],
        },
        {
            title: "Compañia",
            links: [
                { text: "Acerca de ", url: "#" },
                { text: "Equipo", url: "#" },
                { text: "Blog", url: "#" },
                { text: "Trabajos", url: "#" },
                { text: "Contacto", url: "#" },
                { text: "Privacidad", url: "#" },
            ],
        },
        {
            title: "Recursos",
            links: [
                { text: "Ayuda", url: "#" },
                { text: "Ventas", url: "#" },
                { text: "Publicidad", url: "#" },
            ],
        },
        {
            title: "Redes Sociales",
            links: [
                { text: "X", url: "#" },
                { text: "Instagram", url: "#" },
                { text: "Facebook", url: "#" },
            ],
        },
    ],
    bottomLinks = [
        { text: "Terminos y Condiciones", url: "#" },
        { text: "Politica de Privacidad", url: "#" },
    ],
}: FooterProps) => {
    return (
        <section className="py-12 flex justify-center">
            <div className="container px-4 md:px-8 xl:px-12 2xl:px-16">
                <footer>
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
                        <div className="col-span-2 mb-8 lg:mb-0">
                            <div className="flex items-center gap-2 lg:justify-start">
                                <Link to="/">
                                    <img
                                        src={logo.src}
                                        alt={logo.alt}
                                        title={logo.title}
                                        className="h-10"
                                    />
                                </Link>
                                <p className="text-xl font-semibold">{logo.title}</p>
                            </div>
                            <p className="mt-4 font-bold">{tagline}</p>
                        </div>
                        {menuItems.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold">{section.title}</h3>
                                <ul className="space-y-4 text-muted-foreground">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary"
                                        >
                                            <a href={link.url}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
                        <p>© {new Date().getFullYear()} Copyright. Todos los derechos reservados.</p> 
                        <ul className="flex gap-4">
                            {bottomLinks.map((link, linkIdx) => (
                                <li key={linkIdx} className="underline hover:text-primary">
                                    <a href={link.url}>{link.text}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </footer>
            </div>
        </section>
    );
};

export { Footer };
