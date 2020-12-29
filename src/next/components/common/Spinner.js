import { Transition } from "@headlessui/react";
import React from "react";
import Error from "./Error";

const Spinner = ({ dependencies, errors, children }) => {
  const visible = dependencies.includes(true);
  const noErrors = errors.every((error) => error === undefined);

  return (
    <>
      <Transition
        show={visible}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0 scale-90"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-90"
      >
        <div className="h-screen w-screen bg-white flex items-center justify-center">
          <div className="h-5 w-5 bg-green-600" />
        </div>
      </Transition>
      <Transition
        show={!visible}
        enter="transition ease-out duration-500"
        enterFrom="transform opacity-0 scale-90"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-200"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-90"
      >
        {noErrors ? children : <Error errors={errors} />}
      </Transition>
    </>
  );
};

export default Spinner;
