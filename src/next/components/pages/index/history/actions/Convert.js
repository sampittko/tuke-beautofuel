import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import PurchasesAPI from "../../../../../lib/api/purchases";

const Convert = ({ tracksRefetch, userRefetch, track }) => {
  const [makePurchase, { data, error }] = useMutation(PurchasesAPI.make, {
    variables: {
      purchaseId: track.purchase?.id,
    },
  });

  useEffect(() => {
    if (data && !error) {
      tracksRefetch();
      userRefetch();
    }
  }, [data]);

  const disabled = track.purchase?.quantity === 0;

  return (
    <button
      disabled={disabled}
      onClick={makePurchase}
      type="button"
      className={`flex-shrink-0 p-1 text-gray-400 bg-green-600 border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
        disabled ? "opacity-50 hover:cursor-default" : "hover:bg-green-700 "
      }`}
      title={disabled ? "" : "Nakúpiť odmeny"}
    >
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
        ></path>
      </svg>
    </button>
  );
};

export default Convert;
