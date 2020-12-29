import React from "react";

const SyncButton = ({ onSyncClick: handleClick, syncing }) => (
  <button
    onClick={handleClick}
    disabled={syncing}
    type="button"
    className={`inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
      syncing ? "opacity-60 hover:cursor-default" : "hover:bg-green-700"
    }`}
  >
    Synchronizovať jazdy
    <svg
      className={`ml-2 -mr-1 h-5 w-5 ${syncing ? "animate-spin" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      ></path>
    </svg>
  </button>
);

export default SyncButton;
