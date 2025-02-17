import ReviewInterface from "@/interfaces/review";
import { Card, CardContent } from "./card";
import { Avatar, AvatarFallback } from "./avatar";
import { Star } from "lucide-react";
import React from "react";
import dayjs from "dayjs";

interface ReviewProps {
    review: ReviewInterface;
    className?: string;
}

function Review({ review, className }: ReviewProps) {

    const getName = React.useCallback(() => {
        const name = review.user.email.split('@')[0];
        if (name) {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return '';
    }, [review.user.email]);

    return (
        <Card
            className={`flex flex-col transition-shadow duration-300 ease-in-out hover:shadow-lg ${className}`}
        >
            <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>{review.user.email.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{getName()}</p>
                        <p className="text-xs text-muted-foreground">{review.user.email}</p>
                    </div>
                </div>
                <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, index) => (
                        <Star
                            key={index}
                            className={`h-5 w-5 ${index < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                    ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-4">{review.content}</p>
                <p className="text-xs text-muted-foreground">
                    {dayjs(review.createdAt).format("LLL")}
                </p>
            </CardContent>
        </Card>
    );
}

export default Review;