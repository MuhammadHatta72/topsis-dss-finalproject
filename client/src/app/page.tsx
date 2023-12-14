"use client";
import Footer from "@/components/footer";
import Title from "@/components/title";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import axios from "axios";

export default function Home() {
  const deleteAllData = async () => {
    try {
      await axios.delete("http://127.0.0.1:9000/api/criterias/");
      await axios.delete("http://127.0.0.1:9000/api/alternatives/");
      await axios.delete("http://127.0.0.1:9000/api/matrixvalues/");
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    deleteAllData();
  }, []);
  return (
    <>
      <div className="container mx-auto shadow-xl mt-3 rounded-lg overflow-hidden">
        <div className="p-5 mt-5 mb-5">
          <div className="flex flex-row gap-3 items-center justify-center">
            <Title />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center mb-4">
          <Image src="/images/home.jpeg" width={500} height={100} alt="Home" />
          <div>
            <Link
              href={"/uploadcsv"}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Upload File
              </span>
            </Link>
            <Link
              href={"/criteria"}
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-purple-200"
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Form Data
              </span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
