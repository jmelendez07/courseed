import React from "react";

export type ColorType =
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
;

export const colors: { value: ColorType; label: string; }[] = [
    { value: "red", label: "Rojo" },
    { value: "orange", label: "Naranjado" },
    { value: "amber", label: "Ambarino" },
    { value: "yellow", label: "Amarrillo" },
    { value: "lime", label: "Lima" },
    { value: "green", label: "Verde" },
    { value: "emerald", label: "Esmeralda" },
    { value: "teal", label: "Verde azulado" },
    { value: "cyan", label: "Cian" },
    { value: "sky", label: "Azul Cielo" },
    { value: "blue", label: "Azul" },
];

interface ColorProps {
    color: ColorType | string;
    setColor: (theme: ColorType) => void;
}

export const ColorContext = React.createContext<ColorProps | null>(null);

function ColorProvider({ children }: { children: React.ReactNode }) {
    const [color, setColor] = React.useState<ColorType | string>(localStorage.getItem("color") || "sky");

    React.useEffect(() => localStorage.setItem("color", color), [color]);

    const contextValue: ColorProps = React.useMemo(
        () => ({
            color,
            setColor
        }), [color]
    );

    return (
        <ColorContext.Provider value={contextValue}>
            {children}
        </ColorContext.Provider>
    );
}

export default ColorProvider;