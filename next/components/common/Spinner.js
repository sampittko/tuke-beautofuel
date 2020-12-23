import { Transition } from "@headlessui/react";
import React from "react";

const Spinner = ({ visible, children }) => (
  <>
    <Transition
      show={!!visible}
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
      {children}
    </Transition>
  </>
);

export default Spinner;
