import React from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import useCourses from "@/hooks/useCourses";

function DialogCourses() {
    const [open, setOpen] = React.useState<boolean>(false);
    const courseHook = useCourses({});

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    return (
        <>
            <Button size="icon" onClick={() => setOpen(true)}>
                <Search />
            </Button>
            <p className="text-sm text-gray-600 hidden lg:block">
                Presiona{" "}
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100">
                    <span className="text-xs">⌘ K</span>
                </kbd>
            </p>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Buscar por titulo, descripción, duración..." />
                <CommandList>
                    <CommandEmpty>No hay resultados.</CommandEmpty>
                    {courseHook.courses.map(course => (
                        <CommandItem key={course.id}>
                            <img 
                                src={course.image} 
                                alt={course.title}
                                className="size-10 object-cover rounded-sm" 
                            />
                            <span>{course.title}</span>
                        </CommandItem>
                    ))}
                    <CommandSeparator />
                    {!courseHook.isLastPage && (
                        <CommandItem>
                            <span 
                                className="w-full text-center"
                                onClick={() => courseHook.setParams({
                                    ...courseHook.params,
                                    pageNumber: courseHook.params.pageNumber + 1
                                })}
                            >
                                ...
                            </span>
                        </CommandItem>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
}

export default DialogCourses;