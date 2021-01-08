import { signOut, useSession } from "next-auth/client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Navigation = () => {
  const [session] = useSession();

  const profileName = session?.user.name;
  const profileImage = session ? `${session.user.image}?field=image` : null;

  const Logo = React.forwardRef(({ href }, ref) => (
    <a href={href} ref={ref}>
      <Image
        width={32}
        height={25}
        className="block w-auto h-8 lg:p-2"
        src="/images/envirocar_logo.png"
        alt="enviroCar logo"
      />
    </a>
  ));

  return (
    <div className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-gray-200 lg:border-none">
      <div className="flex justify-between flex-1 px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="flex">
          <div className="flex items-center flex-shrink-0">
            <Link href="/" passHref>
              <Logo />
            </Link>
          </div>
        </div>
        {session && (
          <div className="flex items-center ml-4 md:ml-6">
            <div className="relative ml-3">
              <div className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 lg:py-2 lg:rounded-md">
                <Image
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                  src={profileImage}
                  title={profileName}
                  alt="profilová fotka"
                />
                <button
                  type="button"
                  className="inline-flex items-center py-2 pl-2 ml-2 text-sm font-medium text-gray-600 border border-transparent rounded-md hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="Odhlásiť sa"
                  onClick={(event) => {
                    event.preventDefault();
                    signOut();
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
