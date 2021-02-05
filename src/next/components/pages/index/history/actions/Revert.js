import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import PurchasesAPI from "../../../../../lib/api/purchases";

const Revert = ({ tracksRefetch, userRefetch, track }) => {
  const [revertPurchase, { data, error }] = useMutation(PurchasesAPI.revert, {
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
      onClick={revertPurchase}
      type="button"
      className={`flex-shrink-0 p-1 text-gray-400 bg-gray-600 border border-transparent rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
        disabled ? "opacity-50 hover:cursor-default" : "hover:bg-gray-700 "
      }`}
      title={disabled ? "" : "Vrátiť odmeny"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5 text-white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z"
        />
      </svg>
    </button>
  );
};

export default Revert;
