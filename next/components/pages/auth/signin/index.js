import React from "react";
import { signIn } from "next-auth/client";
import Image from "next/image";

const SignInPageComponent = ({ providers }) => {
  const handleClick = (event, provider) => {
    event.preventDefault();
    signIn(provider.id);
  };

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
                        className="h-5 w-5"
                        enableBackground="new 0 0 512 512"
                        height="512"
                        viewBox="0 0 512 512"
                        width="512"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g>
                          <path
                            d="m507.879 208.612c2.276 0 4.121 1.845 4.121 4.121v43.267c0 16.194-1.504 32.028-4.389 47.388-22.317 119.309-127.427 209.474-253.416 208.605-141.369-.974-254.507-115.199-254.194-256.57.311-141.117 114.809-255.423 255.999-255.423 69.173 0 131.935 27.442 178.014 72.018 1.664 1.609 1.707 4.261.07 5.897l-61.211 61.211c-1.576 1.576-4.122 1.617-5.737.08-28.921-27.529-68.051-44.43-111.136-44.43-88.971 0-160.616 71.136-161.22 160.105-.607 89.553 71.809 162.342 161.22 162.342 72.545 0 133.903-47.924 154.136-113.835h-150.015c-2.276 0-4.121-1.845-4.121-4.121v-86.535c0-2.276 1.845-4.121 4.121-4.121h247.758z"
                            fill="#2196f3"
                          />
                          <g>
                            <path
                              d="m507.879 208.612h-30.905c2.276 0 4.121 1.845 4.121 4.121v43.267c0 16.194-1.504 32.028-4.389 47.388-21.291 113.822-117.936 201.117-236.175 208.15 4.524.267 9.078.423 13.664.455 125.99.869 231.099-89.297 253.416-208.605 2.885-15.36 4.389-31.194 4.389-47.388v-43.268c0-2.275-1.845-4.12-4.121-4.12z"
                              fill="#1e88e5"
                            />
                          </g>
                          <path
                            d="m109.56 188.482-77.748-56.176c43.618-78.891 127.67-132.306 224.188-132.306 69.173 0 131.935 27.442 178.014 72.018 1.664 1.609 1.707 4.261.07 5.897l-61.211 61.211c-1.573 1.573-4.119 1.622-5.73.088-28.921-27.534-68.054-44.437-111.143-44.437-64.932 0-120.902 38.384-146.44 93.705z"
                            fill="#f44336"
                          />
                          <path
                            d="m87.115 172.265 22.445 16.217c23.31-50.494 71.978-86.86 129.668-92.825.434-.047.851-.104 1.293-.146-5.077-.482-10.222-.734-15.426-.734-58.657 0-109.777 30.923-137.98 77.488z"
                            fill="#e53935"
                          />
                          <path
                            d="m403.109 72.018c1.664 1.609 1.707 4.261.07 5.898l-49.683 49.683c4.76 3.62 9.316 7.492 13.64 11.608 1.614 1.537 4.161 1.496 5.737-.08l61.211-61.211c1.637-1.637 1.593-4.288-.07-5.898-46.079-44.576-108.841-72.018-178.014-72.018-5.191 0-10.341.173-15.455.478 63.04 3.755 119.941 30.308 162.564 71.54z"
                            fill="#e53935"
                          />
                          <path
                            d="m443.792 429.977c-46.75 50.448-113.588 82.023-187.792 82.023-100.226 0-186.998-57.597-229.02-141.506l79.375-54.394c23.819 59.267 81.849 101.123 149.645 101.123 42.546 0 81.24-16.483 110.044-43.412z"
                            fill="#4caf50"
                          />
                          <path
                            d="m106.356 316.101-23.406 16.039c27.185 50.644 80.644 85.083 142.145 85.083 5.201 0 10.342-.255 15.417-.736-61.049-5.82-112.174-45.687-134.156-100.386z"
                            fill="#43a047"
                          />
                          <path
                            d="m256 512c74.204 0 141.042-31.575 187.792-82.023l-19.043-13.757c-43.896 54.63-109.746 90.871-184.163 95.314 5.1.304 10.238.466 15.414.466z"
                            fill="#43a047"
                          />
                          <path
                            d="m94.777 256c0 21.242 4.11 41.527 11.579 60.101l-79.376 54.393c-17.265-34.449-26.98-73.338-26.98-114.494 0-44.864 11.538-87.03 31.812-123.694l77.748 56.176c-9.488 20.531-14.783 43.412-14.783 67.518z"
                            fill="#ffc107"
                          />
                          <path
                            d="m82.95 332.14 23.406-16.039c-7.469-18.574-11.579-38.859-11.579-60.101 0-24.106 5.295-46.987 14.783-67.518l-22.445-16.217c-14.575 24.065-23.034 52.304-23.24 82.617-.19 27.954 6.737 54.275 19.075 77.258z"
                            fill="#ffb300"
                          />
                        </g>
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
