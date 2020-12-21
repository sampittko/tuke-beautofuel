import React from "react";
import { signIn, useSession } from "next-auth/client";
import Image from "next/image";
import Authenticated from "../../../common/authenticated";

const SignInPageComponent = ({ providers }) => {
  const [session] = useSession();

  const handleClick = (event, provider) => {
    event.preventDefault();
    signIn(provider.id);
  };

  if (session) {
    return <Authenticated />;
  }

  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Image
            src="/images/favicon.ico"
            layout="fixed"
            width={50}
            height={50}
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Prihlásenie do účtu
          </h2>

          <div className="mt-8">
            <div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Prihlásenie prostredníctvom
                </p>

                <div className="mt-1 grid grid-cols-3 gap-3">
                  {Object.values(providers).map((provider) => (
                    <button
                      key={provider.id}
                      onClick={(event) => handleClick(event, provider)}
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">
                        Sign in with {provider.name}
                      </span>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1602853175733-5ad62dc6a2c8?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1923&q=80"
          alt=""
        />
      </div>
    </div>
  );
};

export default SignInPageComponent;
