import RegisterSubscriptorForm from "@/components/form/register-subscriptor-form";

function RegisterSubscribe() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <RegisterSubscriptorForm />
            </div>
        </div>
    );
}

export default RegisterSubscribe;