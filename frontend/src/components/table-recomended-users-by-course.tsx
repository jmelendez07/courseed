import APIS from "@/enums/apis";
import CourseInterface from "@/interfaces/course";
import UserInterface from "@/interfaces/user";
import axios, { AxiosResponse } from "axios";
import { ArrowUpDown, ClipboardPaste, DollarSign, LoaderCircle, Timer, X } from "lucide-react";
import React from "react";
import LazyImage from "./ui/LazyImage";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ColorContext } from "@/providers/ColorProvider";

interface TableRecomendedUsersByCourseProps {
    course: CourseInterface;
    exit: () => void;
}

interface ResponseUsersProps {
    content: UserInterface[];
    last: boolean;
    empty: boolean;
    totalElements: number;
}

const copyPrediction = (course: UserInterface) => {
	if (course.prediction) {
		const wrapWithQuotes = (value: string): string => {
			return value.includes(" ") ? `'${value}'` : value;
		};

		const predictionMessage = `${wrapWithQuotes(course.prediction.userInterest)},${course.prediction.userAvailableTime},${course.prediction.budget},${wrapWithQuotes(course.prediction.platformPreference)},${wrapWithQuotes(course.prediction.courseModality)},${course.prediction.courseDuration},${course.prediction.coursePrice},${wrapWithQuotes(course.prediction.courseCategory)},${course.prediction.courseRatingAvg},${wrapWithQuotes(course.prediction.courseMaxReaction)},${course.prediction.courseVisits},${course.prediction.courseReviewsCount},?`;

		navigator.clipboard.writeText(predictionMessage.trim())
			.then(() => {
				alert("Predicción copiada al portapapeles.");
			})
			.catch((err) => {
				console.error("Error al copiar al portapapeles:", err);
				alert("No se pudo copiar al portapapeles.");
			});
	}
}

function TableRecomendedUsersByCourse({ course, exit }: TableRecomendedUsersByCourseProps) {
    const [users, setUsers] = React.useState<UserInterface[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const pageSize = 10;
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [isLastPage, setIsLastPage] = React.useState<boolean>(false);
    const [totalUsers, setTotalUsers] = React.useState<number>(0);
    const [totalRecomendedUsers, setTotalRecomendedUsers] = React.useState<number>(0);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const colorContext = React.useContext(ColorContext);

    React.useEffect(() => {
        setLoading(true);
        axios.get(APIS.USERS_RECOMENDED_BY_COURSE + course.id, {
            params: {
                page: pageNumber,
                size: pageSize
            }
        })
            .then((response: AxiosResponse<ResponseUsersProps>) => {
                setUsers(response.data.content);
                setIsLastPage(response.data.last || response.data.empty);
                setTotalRecomendedUsers(response.data.totalElements);
            })
            .catch(() => {
                setIsLastPage(true);
            })
            .finally(() => setLoading(false));
    }, [pageNumber]);

    React.useEffect(() => {
        axios.get(APIS.USERS_COUNT)
            .then((response: AxiosResponse<number>) => {
                setTotalUsers(response.data);
            })
    }, []);

    const columns: ColumnDef<UserInterface>[] = [
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Usuario
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const email: string = row.getValue('email');
                const image: string = row.original.image ?? '';
                return (
                    <div className="flex items-center gap-2 pl-3.5 overflow-hidden">
                        <Avatar>
                            <AvatarImage src={image} />
							<AvatarFallback>{email.slice(0, 2).toUpperCase()}</AvatarFallback>
						</Avatar>
                        <p className="truncate max-w-[240px]">{email}</p>
                    </div>
                );
            }
        },
        {
            id: "interest",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Categoria de Interes
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const interest: string = row.original.prediction?.userInterest ?? '';
                return (
                    <p className="truncate pl-4">{interest}</p>
                );
            }
        },
        {
            id: "duration",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Tiempo disponible
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const duration = row.original.prediction?.userAvailableTime;
    
                return <div className="flex items-center gap-x-1 pl-4">
                    {duration} horas
                    <Timer className="size-4 text-gray-600" />
                </div>
            },
        },
        {
            id: "budget",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Presupuesto
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const price = row.original.prediction?.budget;
                const formattedPrice : string = price
                    ? new Intl.NumberFormat("es-ES", {
                        style: "currency",
                        currency: "COP",
                    }).format(price)
                    : '0';
    
                return <div className="flex items-center gap-x-1 pl-4">
                    {formattedPrice}
                    <DollarSign className="size-4 text-gray-600" />
                </div>
            },
        },
        {
            accessorKey: "category",
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Preferencia de plataforma
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => {
                const platformPreference: string = row.original.prediction?.platformPreference ?? ''; 

                return (
                    <p className="pl-4">
                        {platformPreference}
                    </p>
                )
            }
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <Button onClick={() => copyPrediction(row.original)} variant="ghost" className="h-8 w-8 !p-0">
                        <ClipboardPaste className="!size-5" />
                    </Button>
                )
            },
        },
    ];
    
    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    return (
        <div 
            className={`grid grid-cols-1 grid-rows-[auto_1fr] gap-6 ${loading ? 'h-full' : ''}`}
        >
            <div className="grid grid-cols-[1fr_auto] justify-between items-center gap-x-10">
                <div className="grid items-center grid-cols-[auto_1fr] gap-x-2">
                    <LazyImage src={course.image ?? ''} className="min-w-10 min-h-10 size-10 shrink-0 rounded-md object-cover" />
                    <h2 className="truncate text-2xl font-semibold">
                        {course.title}
                    </h2>
                </div> 
                <button 
                    type="button"
                    onClick={exit} 
                    className="p-2 border border-gray-200 bg-gray-100 rounded-md hover:bg-gray-200 hover:border-gray-300 transition-all duration-200 ease-out"
                >
                    <X className="size-4" />
                </button>
            </div>
            <div 
                className={`grid grid-cols-1 w-full ${loading ? 'place-items-center h-full' : 'place-content-start'}`}
            >
                {loading ? (
                    <LoaderCircle className="animate-spin text-gray-600" />
                ) : (
                    <>
                        <div className="flex sm:items-center pb-4 flex-col gap-2 sm:flex-row sm:justify-between">
                            <div className="flex items-center">
                                <h2 className="text-xl font-medium flex items-center gap-2">
                                    <span>Usuarios recomendados</span>
                                    <span>
                                        <span className={`text-${colorContext?.color}-600`}>
                                            {totalRecomendedUsers + " "}
                                        </span>
                                        / {totalUsers}
                                    </span>
                                </h2>
                            </div>
                            <Input
                                placeholder="Buscar por email..."
                                value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn("email")?.setFilterValue(event.target.value)
                                }
                                className="max-w-sm"
                            />
                        </div>
                        <div 
                            className="rounded-md border border-zinc-200 dark:border-zinc-800 
                            dark:file:text-zinc-50 dark:placeholder:text-zinc-400 
                            dark:focus-visible:ring-zinc-300"
                        >
                            <Table>
                                <TableHeader>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )}
                                                    </TableHead>
                                                )
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                data-state={row.getIsSelected() && "selected"}
                                            >
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="py-5">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No hay Usuarios.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageNumber(pageNumber - 1)}
                                disabled={pageNumber <= 0}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPageNumber(pageNumber + 1)}
                                disabled={isLastPage}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default TableRecomendedUsersByCourse;