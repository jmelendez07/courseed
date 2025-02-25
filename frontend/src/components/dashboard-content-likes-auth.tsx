import useLikesAuth from "@/hooks/useLikesAuth";
import { Button } from "./ui/button";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import Course from "./ui/course";
import LikeDraw from "./ui/LikeDraw";

interface DashboardContentLikesAuthProps {
    className?: string;
}

function DashboardContentLikesAuth({ className }: DashboardContentLikesAuthProps) {
    const likesHook = useLikesAuth({});

    return (
        likesHook.loading ? (
            <div className="flex items-center justify-center w-full h-full">
                <LoaderCircle className="animate-spin" />
            </div>
        ) : (
        <div className={`flex flex-col gap-4 h-full ${className}`}>
            {likesHook.likes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {likesHook.likes.map(like => (
                        like.course && (<Course key={like.id} course={like.course} optionsEnable={false} />)
                    ))}
                </div>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center p-4 text-center gap-4">
                    <LikeDraw />
                    <p className="mb-8 text-base">
                        Parece que aún no has dado ningún like.
                    </p>
                    <Button asChild className="group">
                        <a href="/educacion" target="_blank">
                            Likear una educación continua
                            <ArrowUpRight className="transition-transform group-hover:translate-x-1" />
                        </a>
                    </Button>
                </div>
            )}
        </div>
        )
    );
}

export default DashboardContentLikesAuth;