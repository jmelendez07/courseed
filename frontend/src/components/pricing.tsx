import { ArrowRight, CircleCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import FadeItem from "./ui/fadeItem";
import useSubscribe from "@/hooks/useSubscribe";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

interface PricingFeature {
    text: string;
}

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: string;
    yearlyPrice: string;
    features: PricingFeature[];
    button: {
        text: string;
        url: string;
    };
}

interface PricingProps {
    heading?: string;
    description?: string;
    plans?: PricingPlan[];
}

function Pricing({
    heading = "Elige el Plan Perfecto para Ti",
    description = "Impulsa tus cursos con el plan que mejor se adapte a tus necesidades. Publica cursos y llega a más estudiantes.",
    plans = [
        {
            id: "plus",
            name: "Plus",
            description: "For personal use",
            monthlyPrice: "$19",
            yearlyPrice: "$15",
            features: [
                { text: "Up to 5 team members" },
                { text: "Basic components library" },
                { text: "Community support" },
                { text: "1GB storage space" },
            ],
            button: {
                text: "Comprar",
                url: "https://www.shadcnblocks.com",
            },
        },
        {
            id: "pro",
            name: "Pro",
            description: "For professionals",
            monthlyPrice: "$49",
            yearlyPrice: "$35",
            features: [
                { text: "Unlimited team members" },
                { text: "Advanced components" },
                { text: "Priority support" },
                { text: "Unlimited storage" },
            ],
            button: {
                text: "Comprar",
                url: "https://www.shadcnblocks.com",
            },
        },
        {
            id: "pro",
            name: "Pro",
            description: "For professionals",
            monthlyPrice: "$49",
            yearlyPrice: "$35",
            features: [
                { text: "Unlimited team members" },
                { text: "Advanced components" },
                { text: "Priority support" },
                { text: "Unlimited storage" },
            ],
            button: {
                text: "Comprar",
                url: "https://www.shadcnblocks.com",
            },
        },
    ],
}: PricingProps) {

    const subscribeHook = useSubscribe();
    const authHook = useAuth();
    const navigate = useNavigate();

    const handleSubscribe = () => {
        if (authHook?.user) {
            subscribeHook.handleSubscribe();
        } else {
            navigate("/registro/suscriptor", { replace: true });
        }
    }

    return (
        <section id="#precios" className="py-12">
            <div className="w-full">
                <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
                    <FadeItem>
                        <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
                            {heading}
                        </h2>
                    </FadeItem>
                    <FadeItem>
                        <p className="text-muted-foreground lg:text-xl">{description}</p>
                    </FadeItem>
                    <div className="flex flex-col items-stretch gap-6 md:flex-row 2xl:gap-12">
                        {plans.map((plan, index) => (
                            <FadeItem key={index}>
                                <Card className="flex w-80 h-full flex-col justify-between text-left">
                                    <CardHeader>
                                        <CardTitle>
                                            <p>{plan.name}</p>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {plan.description}
                                        </p>
                                        <span className="text-4xl font-bold">
                                            {plan.monthlyPrice}
                                        </span>
                                        {/* <p className="text-muted-foreground">
                                        Billed{" "}
                                        {isYearly
                                            ? `$${Number(plan.yearlyPrice.slice(1)) * 12}`
                                            : `$${Number(plan.monthlyPrice.slice(1)) * 12}`}{" "}
                                        annually
                                    </p> */}
                                    </CardHeader>
                                    <CardContent>
                                        <Separator className="mb-6" />
                                        {plan.id === "pro" && (
                                            <p className="mb-3 font-semibold">
                                                Everything in Plus, and:
                                            </p>
                                        )}
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center gap-2">
                                                    <CircleCheck className="size-4" />
                                                    <span>{feature.text}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter className="mt-auto">
                                        <Button 
                                            onClick={handleSubscribe} 
                                            className="w-full"
                                        >
                                            {plan.button.text}
                                            <ArrowRight className="ml-2 size-4" />
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </FadeItem>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Pricing;