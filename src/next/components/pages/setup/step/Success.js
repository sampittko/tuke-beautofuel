import React from "react";

const Success = () => (
  <div className="bg-white">
    <div className="px-4 py-12 mx-auto text-center max-w-7xl sm:px-6 lg:py-16 lg:px-8">
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        <span className="block">Dokončené!</span>
      </h2>
      <div className="flex justify-center mt-8">
        <div className="inline-flex rounded-md shadow">
          <a
            target="_blank"
            href="https://docs.google.com/document/d/1kpCLRQ3O1odZIP_doRgF57LRM0_YAiDj9XHl2ub7BV4/edit"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
          >
            Detaily o experimente
          </a>
        </div>
        <div className="inline-flex ml-3">
          <a
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-green-700 bg-green-100 border border-transparent rounded-md hover:bg-green-200"
          >
            Presunúť sa do centrály
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default Success;
