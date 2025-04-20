import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash, User, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import CategoryInterface from "@/interfaces/category";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import dayjs from "dayjs";

interface CategoryCardProps {
    category: CategoryInterface
    isOwner: boolean
    onEdit: () => void
    onDelete: () => void
}

export function CategoryCard({ category, isOwner, onEdit, onDelete }: CategoryCardProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

    return (
        <Card className="overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="relative p-0">
                <div className="relative w-full h-48 overflow-hidden">
                    <Avatar className="w-full h-full rounded-none">
                        <AvatarImage 
                            src={category.image ?? ""} 
                            alt={category.name}
                            className="object-cover w-48 h-48"
                        />
                        <AvatarFallback className="w-full h-full text-6xl text-gray-500 rounded-none">{category.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {isOwner && <Badge className="absolute top-2 right-2 bg-primary">Your Category</Badge>}
                </div>
            </CardHeader>
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold line-clamp-2">{category.name}</h3>
                    { isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Abrir menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={onEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => setDeleteDialogOpen(true)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <User className="mr-1 h-3 w-3" />
                    <span className="truncate">{category.user?.email || "Sin usuario"}</span>
                </div>
            </CardContent>
            <CardFooter className="border-t p-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <span>Creado el: {dayjs(category.createdAt).format("L")}</span>
                </div>
            </CardFooter>

            { isOwner && (
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the category "{category.name}". This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Card>
    )
}