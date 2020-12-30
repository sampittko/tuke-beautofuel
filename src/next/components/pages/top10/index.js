import React from "react";
import { useSession } from "next-auth/client";
import Navigation from "../../common/Navigation";
import Share from "./Share";
import Stats from "./Stats";
import Table from "./Table";
import Spinner from "../../common/Spinner";
import { useQuery } from "@apollo/client";
import PhaseAPI from "../../../lib/api/phase";

const Top10PageComponent = () => {
  const [session] = useSession();

  const { loading: phaseLoading, error: phaseError, data: phase } = useQuery(
    PhaseAPI.only
  );

  return (
    <Spinner dependencies={[phaseLoading]} errors={[phaseError]}>
      <div className="min-h-screen bg-gray-100">
        <Navigation />

        <div className="bg-green-600 pb-32">
          <header className="py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-center uppercase text-3xl font-bold text-white">
                Sieň slávy
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
            <Table />
            {session && <Share />}
            <Stats phaseNumber={phase?.phase.number} />
          </div>
        </main>

        <footer>
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; 2021 Samuel Pitoňák. Všetky práva vyhradené.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Spinner>
  );
};

export default Top10PageComponent;
