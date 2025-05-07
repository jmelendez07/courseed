import { ArrowRight, CircleCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import FadeItem from "@/components/ui/fadeItem";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import React from "react";
import useSelectedPlan from "@/hooks/useSelectedPlan";

interface PricingFeature {
    text: string;
}

interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    duration: "M" | "A";
    features: PricingFeature[];
    button: {
        text: string;
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
            id: "basic",
            name: "Basico",
            description: "Para uso personal",
            price: 50000,
            currency: "COP",
            duration: "M",
            features: [
                { text: "Up to 5 team members" },
                { text: "Basic components library" },
                { text: "Community support" },
                { text: "1GB storage space" },
            ],
            button: {
                text: "Comprar",
            },
        },
        {
            id: "plus",
            name: "Plus",
            description: "Para instituciones grandes",
            price: 200000,
            currency: "COP",
            duration: "M",
            features: [
                { text: "Unlimited team members" },
                { text: "Advanced components" },
                { text: "Priority support" },
                { text: "Unlimited storage" },
            ],
            button: {
                text: "Comprar",
            },
        },
        {
            id: "Pro",
            name: "Pro",
            description: "Para insituticiones pequeñas",
            price: 100000,
            currency: "COP",
            duration: "A",
            features: [
                { text: "Unlimited team members" },
                { text: "Advanced components" },
                { text: "Priority support" },
                { text: "Unlimited storage" },
            ],
            button: {
                text: "Comprar",
            },
        },
    ],
}: PricingProps) {

    const authHook = useAuth();
    const navigate = useNavigate();
    const planHook = useSelectedPlan();

    const handleSubscribe = (e: React.MouseEvent<HTMLButtonElement>, plan: PricingPlan) => {
        e.preventDefault();

        if (authHook?.user?.id) {    
            planHook.redirectToPayU(authHook.user.id, plan);
        } else {
            planHook.savePlan(plan);
            navigate("/registro/suscriptor", { replace: true });
        }
    }

    const getLocalePrice = (price: number): string => {
        return price.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    return (
        <section id="precios" className="py-12">
            <div className="w-full px-4">
                <div className="mx-auto flex flex-col items-center gap-6 text-center">
                    <FadeItem>
                        <h2 className="text-pretty text-4xl font-bold lg:text-6xl">
                            {heading}
                        </h2>
                    </FadeItem>
                    <FadeItem>
                        <p className="text-muted-foreground lg:text-xl">{description}</p>
                    </FadeItem>
                    <div className="w-full flex flex-col items-center gap-6 md:flex-row md:justify-center 2xl:gap-12">
                        {plans.map((plan, index) => (
                            <FadeItem key={index}>
                                <Card className="flex w-80 2xl:w-full h-full flex-col justify-between text-left">
                                    <CardHeader>
                                        <CardTitle>
                                            <p>{plan.name}</p>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            {plan.description}
                                        </p>
                                        <span className="text-4xl font-bold">
                                            {getLocalePrice(plan.price)} {plan.currency}
                                        </span>
                                    </CardHeader>
                                    <CardContent>
                                        <Separator className="mb-6" />
                                        {plan.id === "plus" && (
                                            <p className="mb-3 font-semibold">
                                                Todo en Pro, y:
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
                                            type="submit"
                                            className="w-full"
                                            onClick={(e) => handleSubscribe(e, plan)}
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