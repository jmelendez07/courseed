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
    getReverseColor: () => ColorType;
}

export const ColorContext = React.createContext<ColorProps | null>(null);

function ColorProvider({ children }: { children: React.ReactNode }) {
    const [color, setColor] = React.useState<ColorType | string>(localStorage.getItem("color") || "sky");

    React.useEffect(() => localStorage.setItem("color", color), [color]);

    /**
     * Obtiene el color complementario según el círculo cromático
     * @returns El color complementario del color actual según el círculo cromático
     */
    const getReverseColor = React.useCallback((): ColorType => {
        // Mapa de colores complementarios basado en el círculo cromático
        const complementaryColors: Record<ColorType, ColorType> = {
            'red': 'cyan',      // Rojo - Cian
            'orange': 'sky',    // Naranja - Azul cielo
            'amber': 'blue',    // Ámbar - Azul
            'yellow': 'blue',   // Amarillo - Azul
            'lime': 'teal',     // Lima - Verde azulado
            'green': 'red',     // Verde - Rojo
            'emerald': 'red',   // Esmeralda - Rojo
            'teal': 'orange',   // Verde azulado - Naranja
            'cyan': 'red',      // Cian - Rojo
            'sky': 'orange',    // Azul cielo - Naranja
            'blue': 'yellow',   // Azul - Amarillo
        };
        
        // Si el color está en nuestra lista, devuelve su complementario
        if (color in complementaryColors) {
            return complementaryColors[color as ColorType];
        }
        
        // Color por defecto si no se encuentra
        return 'blue';
    }, [color]); // Dependencia del color actual

    const contextValue: ColorProps = React.useMemo(
        () => ({
            color,
            setColor,
            getReverseColor
        }), [color, getReverseColor]
    );

    return (
        <ColorContext.Provider value={contextValue}>
            {children}
        </ColorContext.Provider>
    );
}

export default ColorProvider;