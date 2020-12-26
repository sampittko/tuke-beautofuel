import Link from "next/link";
import React from "react";

const ErrorPageComponent = ({ statusCode }) => (
  <div className="h-screen w-sreen flex flex-col justify-end">
    <div className="bg-green-700 z-10">
      <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          <span className="block">
            {statusCode === 404
              ? `Stránka neexistuje`
              : `Nastala chyba (${statusCode})`}
          </span>
        </h2>
        <span className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto">
          <Link href="/">Na hlavnú stránku</Link>
        </span>
      </div>
    </div>
    <img
      className="absolute inset-0 h-full w-full object-cover z-0"
      src="https://images.unsplash.com/photo-1537090357686-51aaa968f2ab?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1975&q=80"
      alt=""
    />
  </div>
);

export default ErrorPageComponent;
