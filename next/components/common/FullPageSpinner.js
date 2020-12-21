import { Transition } from "@headlessui/react";
import React from "react";

const FullPageSpinner = ({ spinning, children }) => (
  <>
    <Transition
      show={spinning}
      enter="transition ease-out duration-300"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-200"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="h-5 w-5 bg-green-600" />
      </div>
    </Transition>
    {!spinning && children}
  </>
);

export default FullPageSpinner;
