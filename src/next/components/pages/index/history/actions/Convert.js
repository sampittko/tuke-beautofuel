import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import PurchasesAPI from "../../../../../lib/api/purchases";

const Convert = ({ tracksRefetch, userRefetch, track }) => {
  const [makePurchase, { data, error }] = useMutation(PurchasesAPI.make, {
    variables: {
      purchaseId: track.purchase.id,
    },
  });

  useEffect(() => {
    if (data && !error) {
      tracksRefetch();
      userRefetch();
    }
  }, [data]);

  return (
    <button
      onClick={makePurchase}
      type="button"
      className="flex-shrink-0 text-gray-400 p-1 border border-transparent rounded-full shadow-sm bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
    >
      <svg
        className="h-5 w-5 text-white"
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
