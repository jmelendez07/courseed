import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { Edit, MoreVertical, Star, Trash2, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import ReviewCourseUserInterface from "@/interfaces/review-course-user";

interface ReviewComponentProps {
    review: ReviewCourseUserInterface,
    handleEdit?: (review: ReviewCourseUserInterface) => void
    handleDelete?: (review: ReviewCourseUserInterface) => void
}

function ReviewLarge({ review, handleEdit, handleDelete }: ReviewComponentProps) {
    return (
        <Card
            className="flex flex-col bg-white ease-in-out hover:shadow-lg transition-shadow duration-300"
        >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <h2 className="text-lg font-semibold leading-tight">{review.course.title}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    if (handleEdit) handleEdit(review);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    if (handleDelete) handleDelete(review); 
                  }}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="relative w-full h-40 overflow-hidden mb-4">
                <img
                  src={review.course.image}
                  alt={review.course.title}
                  className="w-full max-h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "https://picsum.photos/400/300"
                    e.currentTarget.onerror = null
                  }}
                />
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${index < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{review.content}</p>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-gray-500 cursor-pointer">
                      <User className="h-4 w-4 mr-1" />
                      <span>{review.user.email}</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>User ID: {review.user.id}</p>
                    <p>Created: {new Date(review.user.createdAt!).toLocaleDateString()}</p>
                    <p>Updated: {new Date(review.user.updatedAt!).toLocaleDateString()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
        </Card>
    );
}

export default ReviewLarge;