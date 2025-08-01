'use client'

import React from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation'

const ForbiddenPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col bg-white pt-16 pb-12">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-6 lg:px-8">
        <div className="flex flex-shrink-0 justify-center">
          <Image
            src="/401_Image.png"
            alt="Error"
            width={500}
            height={500}
            className="object-center overflow-hidden"
          />
        </div>
        <div className="py-16">
          <div className="text-center">
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-600 sm:text-5xl">
              Forbidden
            </h1>
            <p className="mt-10 text-base text-gray-500">
              You are not authorized to access this page.
            </p>
            <button
              onClick={() => router.back()}
              className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForbiddenPage;
