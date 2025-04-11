import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import APIS from "@/enums/apis"
import UserInterface from "@/interfaces/user"
import CourseInterface from "@/interfaces/course"
import { Navbar } from "@/components/ui/navbar"
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from "@/lib/utils"


interface UserCourseResult {
    class: string | null;
    result: string | null;
    confidence: string | null;
}

interface recomendedCoursesInterface {
    id: string | null;
    title: string | null;
    category: string | null;
    institution: string | null;
    price: string | null;
    recommended: boolean | null;
    confidence: string | null;
}

interface section1FormInterface {
    user: string | null;
    course: string | null;
}

interface section2FormInterface {
    user: string | null;
}

export default function Prediction() {
    const [users, setUsers] = useState<UserInterface[]>([]);
    const [courses, setCourses] = useState<CourseInterface[]>([]);
    const [open, setOpen] = useState(false);

    // SECTION 1: User and Course Selection
    const [section1Loading, setSection1Loading] = useState(false);
    const [section1Form, setSection1Form] = useState<section1FormInterface>({
        user: null,
        course: null
    });
    
    const [section1Result, setSection1Result] = useState<UserCourseResult>({
        class: null,
        result: null,
        confidence: null
    });
    
    const fetchSection1 = React.useCallback(() => {
        setSection1Loading(true);
        axios.get('api/predictions/user-course-recomended', {
            params: {
                userId: section1Form.user,
                courseId: section1Form.course,
            }
        })
            .then(response => {
                console.log(response);
                setSection1Result({
                    class: "Recomendar curso",
                    result: response.data.recomended,
                    confidence: response.data.confidence
                });
            })
            .catch(error => {
                console.error("Error fetching user-course prediction:", error)
            })
            .finally(() => setTimeout(() => setSection1Loading(false), 500));
    }, [section1Form.course, section1Form.user]);

    // SECTION 2: Course Recommendations
    const [section2Loading, setSection2Loading] = useState(false);
    const [section2Form, setSection2Form] = useState<section2FormInterface>({
        user: null
    });

    const [section2Result, setSection2Result] = useState<recomendedCoursesInterface[]>([]);
    const fetchSection2 = React.useCallback(() => {
        setSection2Loading(true);
        axios.get('api/predictions/courses-recomended-for-user', {
            params: {
                userId: section2Form.user,
            }
        })
            .then(response => {
                setSection2Result(response.data);
            })
            .catch(error => {
                console.error("Error fetching course recommendations:", error)
            })
            .finally(() => setTimeout(() => setSection2Loading(false), 500));
    }, [section2Form.user]);

    // SECTION 3: Formulario de predicción
    const [section3Loading, setSection3Loading] = useState(false);
    
    const [section3Form, setSection3Form] = useState<section1FormInterface>({
        user: null,
        course: null
    });

    const [section3Result, setSection3Result] = useState<UserCourseResult>({
        class: null,
        result: null,
        confidence: null
    });

    const fetchSection3 = React.useCallback(() => {
        setSection3Loading(true);
        axios.get('api/predictions/form-prediction', {
            params: {
                userId: section3Form.user,
                courseId: section3Form.course,
            }
        })
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error("Error fetching user-course prediction:", error)
            })
            .finally(() => setTimeout(() => setSection3Loading(false), 500));
    }, []);

    React.useEffect(() => {
        axios.get(APIS.USERS, {
            params: {
                size: 100,
                page: 0,
            }
        })
            .then(response => {
                setUsers(response.data.content);
            })
            .catch(error => {
                console.error("Error fetching users:", error)
            });
    }, []);

    React.useEffect(() => {{
        axios.get(APIS.COURSES, {
            params: {
                size: 1000,
                page: 0
            }
        })
            .then(response => {
                setCourses(response.data.content);
            })
            .catch(error => {
                console.error("Error fetching courses:", error)
            });
    }}, []);

    return (
        <main>
            <Navbar />
            <div className="container mx-auto py-10 space-y-8">
                {/* Section 1: User and Course Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle>Selección de Usuario y Curso</CardTitle>
                        <CardDescription>Seleccione un usuario y un curso para mostrar la recomendación</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div className="space-y-2">
                                <label htmlFor="user-select" className="text-sm font-medium">
                                    Usuario
                                </label>
                                <Select value={section1Form.user ?? ""} onValueChange={
                                    (value) => {
                                        setSection1Form({ ...section1Form, user: value });
                                    }
                                }>
                                    <SelectTrigger id="user-select">
                                        <SelectValue placeholder="Seleccionar usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem 
                                                key={user.id} 
                                                value={user.id ?? ""}
                                            >
                                                {user.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="course-select" className="text-sm font-medium">
                                    Curso
                                </label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={open}
                                            className="w-full justify-between"
                                        >
                                            <p className="truncate">
                                                {section1Form.course
                                                    ? courses.find(course => course.id === section1Form.course)?.title
                                                    : "Selecciona un curso..."
                                                }
                                            </p>
                                            <ChevronsUpDown className="opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[400px] p-0">
                                        <Command>
                                        <CommandInput placeholder="Buscar una curso..." />
                                        <CommandList>
                                            <CommandEmpty>No hay resultados.</CommandEmpty>
                                            <CommandGroup>
                                            {courses.map((course) => (
                                                <CommandItem
                                                    key={course.id}
                                                    value={course.title}
                                                    onSelect={(currentValue) => {
                                                        setOpen(false);
                                                        const currentId = courses.find(course => course.title === currentValue)?.id;
                                                        setSection1Form({ ...section1Form, course: currentId ?? "" });
                                                    }}
                                                >
                                                {course.title}
                                                <Check
                                                    className={cn(
                                                    "ml-auto",
                                                    section1Form.course === course.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                </CommandItem>
                                            ))}
                                            </CommandGroup>
                                        </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button disabled={section1Form.course === null || section1Form.user === null || section1Loading} onClick={fetchSection1}>
                                Predecir
                            </Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>CLASE</TableHead>
                                    <TableHead>RESULTADO</TableHead>
                                    <TableHead>CONFIDENCIA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {section1Result?.class === null || section1Result?.result === null || section1Loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            {section1Loading 
                                                ? <div className="w-full flex justify-center">
                                                    <LoaderCircle className="animate-spin" />    
                                                </div> 
                                                : 'No hay registros'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell>{section1Result?.class}</TableCell>
                                        <TableCell>{section1Result?.result ? "true" : "false"}</TableCell>
                                        <TableCell>{section1Result?.confidence}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Section 2: Course Recommendations */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex w-full justify-between">
                            <p>Cursos Recomendados</p>
                            <p className="text-xl">Se encontraron {section2Result.length} cursos</p>
                        </CardTitle>
                        <CardDescription>Seleccione un usuario para ver cursos recomendados</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                            <div className="space-y-2">
                                <label htmlFor="recommend-user-select" className="text-sm font-medium">
                                    Usuario
                                </label>
                                <Select value={section2Form.user ?? ""} onValueChange={value => setSection2Form({ user: value })}>
                                    <SelectTrigger id="recommend-user-select">
                                        <SelectValue placeholder="Seleccionar usuario" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id ?? ""}>
                                                {user.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button disabled={section2Loading || section2Form.user === null} onClick={fetchSection2}>Predecir Cursos Recomendados</Button>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre del Curso</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Institución</TableHead>
                                    <TableHead>Precio</TableHead>
                                    <TableHead>Recomendado</TableHead>
                                    <TableHead>Confidencia</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {section2Result.length === 0 || section2Loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            {section2Loading
                                                ? <div className="w-full flex justify-center">
                                                    <LoaderCircle className="animate-spin" />   
                                                </div>
                                                : 'No hay recomendaciones disponibles'
                                            }
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    section2Result.map((course) => (
                                        <TableRow key={course.id}>
                                            <TableCell>{course.title}</TableCell>
                                            <TableCell>{course.category}</TableCell>
                                            <TableCell>{course.institution}</TableCell>
                                            <TableCell>{course.price}</TableCell>
                                            <TableCell>true</TableCell>
                                            <TableCell>{course.confidence}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Section 3: All Courses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Formulario de predicción</CardTitle>
                        <CardDescription>Información detallada para la predicción</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>CLASE</TableHead>
                                    <TableHead>RESULTADO</TableHead>
                                    <TableHead>CONFIDENCIA</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {section3Result?.class === null || section3Result?.result === null || section3Loading ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                                            {section3Loading 
                                                ? <div className="w-full flex justify-center">
                                                    <LoaderCircle className="animate-spin" />    
                                                </div> 
                                                : 'No hay registros'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell>{section3Result?.class}</TableCell>
                                        <TableCell>{section3Result?.result ? "true" : "false"}</TableCell>
                                        <TableCell>{section3Result?.confidence}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
