function Page404() {
    return (
        <main className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 font-inter">
            <div className="text-center">
                <p className="text-base font-semibold text-sky-600">
                    404
                </p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                    Página no encontrada
                </h1>
                <p className="mt-6 text-base leading-7 text-gray-600">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <a
                        href="/"
                        className="bg-sky-600 px-4 py-3 rounded-full text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                    >
                        Volver al inicio
                    </a>
                </div>
            </div>
        </main>
    );
}

export default Page404;