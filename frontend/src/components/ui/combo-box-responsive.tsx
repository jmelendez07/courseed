import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";

type Status = {
    id: string | null | undefined;
    name: string | undefined;
}

interface ComboBoxResponsiveProps {
    placeholder: string;
    statuses: Status[];
    selectedStatus: Status | null;
    setSelectedStatus: (status: Status | null) => void;
    pagination: boolean;
    onPaginate: () => void;
}

function ComboBoxResponsive({ 
    placeholder, 
    statuses,
    setSelectedStatus,
    selectedStatus,
    pagination,
    onPaginate
}: ComboBoxResponsiveProps) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-between items-center">
                        {selectedStatus ? <>{selectedStatus.name}</> : placeholder}
                        <ChevronsUpDown />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[250px] p-0" align="start">
                    <StatusList 
                        pagination={pagination} 
                        statuses={statuses} 
                        onPaginate={onPaginate}
                        setOpen={setIsOpen} 
                        setSelectedStatus={setSelectedStatus} 
                    />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="justify-between items-center">
                    {selectedStatus ? <>{selectedStatus.name}</> : placeholder}
                    <ChevronsUpDown />
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <StatusList 
                        pagination={pagination} 
                        statuses={statuses} 
                        onPaginate={onPaginate}
                        setOpen={setIsOpen} 
                        setSelectedStatus={setSelectedStatus}
                     />
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function StatusList({setOpen, setSelectedStatus, statuses, pagination, onPaginate}: {
    setOpen: (open: boolean) => void
    setSelectedStatus: (status: Status | null) => void
    statuses: Status[]
    pagination: boolean,
    onPaginate: () => void
}) {
    return (
        <Command>
            <CommandInput placeholder="Buscar..." />
                <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                <CommandGroup>
                    {statuses.map((status) => (
                        <CommandItem
                            key={status.id}
                            value={status.name}
                            onSelect={value => {
                                setSelectedStatus(
                                    statuses.find((priority) => priority.name === value) || null
                                );
                                setOpen(false);
                            }}
                        >
                            {status.name}
                        </CommandItem>
                    ))}
                    {pagination && (
                        <CommandItem
                            key="pagination"
                            value="..."
                            onSelect={() => onPaginate()}
                            className="flex items-center justify-center"
                        >
                            ...
                        </CommandItem>
                    )}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}

export default ComboBoxResponsive;