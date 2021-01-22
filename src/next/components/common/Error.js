import React from "react";
import Head from "next/head";

const Error = ({ errors }) => (
  <>
    <Head>
      <title>Nastala chyba | beautofuel</title>
    </Head>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-red-700 rounded-lg shadow-xl lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pt-10 pb-12 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Z nejakého dôvodu</span>
                <span className="block">nastala chyba.</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-red-200">
                Skúste obnoviť stránku a ak ani po niekoľkých obnoveniach nebude
                funkčná, prosím, kontaktujte administrátora.
              </p>
              <button
                onClick={() => location.reload()}
                className="inline-flex items-center px-6 py-3 mt-8 text-base font-medium text-red-600 bg-white border border-transparent rounded-md shadow hover:bg-red-50"
              >
                Obnoviť stránku
              </button>
              <div className="inline-flex ml-3">
                <a
                  href={`mailto:samuel.pitonak@student.tuke.sk?subject=nefunkčný beautofuel - ${errors.map(
                    (error, i) => (error !== undefined ? ` ${error} ` : "")
                  )}`}
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-red-700 bg-red-100 border border-transparent rounded-md hover:bg-red-200"
                >
                  {" "}
                  Kontaktovať administrátora{" "}
                </a>
              </div>
            </div>
          </div>
          <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
            <img
              className="object-cover object-left-top transform translate-x-6 translate-y-6 rounded-md sm:translate-x-16 lg:translate-y-20"
              src="https://images.unsplash.com/photo-1606166245039-ffeba59d83a4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1884&q=80"
              alt="App screenshot"
            />
          </div>
        </div>
      </div>
      <footer className="absolute bottom-0 left-0 w-screen">
        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-base text-center text-gray-400">
                {errors.map((error, i) => {
                  if (!error) return null;
                  return (
                    <span className="px-1" key={i}>
                      {error.toString()}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </>
);

export default Error;
