import { ArrowRight, CircleCheck } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import FadeItem from "./ui/fadeItem";
import useSubscribe from "@/hooks/useSubscribe";
import { useAuth } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import React from "react";
import md5 from "blueimp-md5";

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

    const API_KEY = "4Vj8eK4rloUd272L48hsrarnUA";
	const MERCHANT_ID = "508029";
	const ACCOUNT_ID = "512321";

    const subscribeHook = useSubscribe();
    const authHook = useAuth();
    const navigate = useNavigate();

    const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
        if (!authHook?.user) {
            e.preventDefault();
            navigate("/registro/suscriptor", { replace: true });
        } else {
            e.currentTarget.submit();
        }
    }

    const generateSignature = (referenceCode: string, amount: number, currency: string): string => {
        const signatureString = `${API_KEY}~${MERCHANT_ID}~${referenceCode}~${amount}~${currency}`;
        const hash = md5(signatureString);
        return hash;
    };

    const generateReferenceCode = (userId: string, plan: string, duration: "M" | "A") => {
        const timestamp = new Date().toISOString().replace(/[-:TZ]/g, "").slice(0, 14); 
        return `PAYU_${userId}_${plan}_${duration}_${timestamp}`;
    };

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
                                <form 
                                    onSubmit={handleSubscribe}
                                    method="post"
                                    className="h-full"
				                    action={authHook?.user ? 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/' : ''}
                                >
                                    {authHook?.user?.id && (
                                        <>
                                            <input type="hidden" name="merchantId" value={MERCHANT_ID} />
                                            <input type="hidden" name="accountId" value={ACCOUNT_ID} />
                                            <input type="hidden" name="description" value="Pago de prueba con PayU" />
                                            <input type="hidden" name="referenceCode" value={generateReferenceCode(authHook.user.id, plan.id, plan.duration)} />
                                            <input type="hidden" name="amount" value={plan.price} />
                                            <input type="hidden" name="currency" value={plan.currency} />
                                            <input type="hidden" name="signature" value={generateSignature(generateReferenceCode(authHook.user.id, plan.id, plan.duration), plan.price, plan.currency)} />
                                            <input type="hidden" name="test" value="1" />
                                            <input type="hidden" name="responseUrl" value={`${import.meta.env.VITE_BASE_URL}/payment-response`}  />
                                            <input type="hidden" name="confirmationUrl" value={`${import.meta.env.VITE_BACKEND_BASE_URL}/api/payu/confirm`} />
                                        </>
                                    )}
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
                                            >
                                                {plan.button.text}
                                                <ArrowRight className="ml-2 size-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </form>
                            </FadeItem>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Pricing;