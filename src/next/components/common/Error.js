import React from "react";
import Head from "next/head";

const Error = () => (
  <>
    <Head>
      <title>Nastala chyba | beautofuel</title>
    </Head>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-700 rounded-lg shadow-xl overflow-hidden lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
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
                className="mt-8 bg-white border border-transparent rounded-md shadow px-6 py-3 inline-flex items-center text-base font-medium text-red-600 hover:bg-red-50"
              >
                Obnoviť stránku
              </button>
              <div className="ml-3 inline-flex">
                <a
                  href="mailto:samuel.pitonak@student.tuke.sk?subject=nefunkčný beautofuel"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                >
                  {" "}
                  Kontaktovať administrátora{" "}
                </a>
              </div>
            </div>
          </div>
          <div className="-mt-6 aspect-w-5 aspect-h-3 md:aspect-w-2 md:aspect-h-1">
            <img
              className="transform translate-x-6 translate-y-6 rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20"
              src="https://images.unsplash.com/photo-1606166245039-ffeba59d83a4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1884&q=80"
              alt="App screenshot"
            />
          </div>
        </div>
      </div>
    </div>
  </>
);

export default Error;
