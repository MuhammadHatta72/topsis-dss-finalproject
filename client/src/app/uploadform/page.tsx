"use client";
import Navbar from "@/components/navbar";
import axios from "axios";
import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";

const UploadForm = () => {
  const [name_criteria, setNameCriteria] = useState("");
  const [weight, setWeight] = useState("");
  const [attribute, setAttribute] = useState("");

  const [name_alternative, setNameAlternative] = useState("");

  const [dataCriteria, setDataCriteria] = useState([]);
  const [dataAlternative, setDataAlternative] = useState([]);

  const getAllCriteria = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:9000/api/criterias/");
      // setDataCriteria(jsonData);
      console.log(response);
    } catch (err) {
      console.error(err.message);
    }
  };

  const checkDataNullCriteria = () => {
    if (name_criteria === "") {
      return false;
    } else if (weight === "") {
      return false;
    } else if (attribute === "") {
      return false;
    } else {
      return true;
    }
  };

  const checkDataNullAlternative = () => {
    if (name_alternative === "") {
      return false;
    } else {
      return true;
    }
  };

  const submitCriteria = () => {
    if (checkDataNullCriteria()) {
      const newCriteria = {
        name_criteria,
        weight,
        attribute,
      };

      try {
        // fetch("http://localhost:8000/criteria", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(newCriteria),
        // }).then((data) => {
        //   Swal.fire({
        //     title: "Success!",
        //     text: "Data berhasil ditambahkan",
        //     icon: "success",
        //     confirmButtonText: "Cool",
        //   });
        //   getAllCriteria();
        // });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Data gagal ditambahkan",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }

      setNameCriteria("");
      setWeight("");
      setAttribute("");
    } else {
      Swal.fire({
        title: "Error!",
        text: "Data tidak boleh kosong",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  const deleteCriteria = async (id) => {
    try {
      // await fetch("http://localhost:8000/criteria/" + id, {
      //   method: "DELETE",
      // }).then((data) => {
      //   Swal.fire({
      //     title: "Success!",
      //     text: "Criteria berhasil dihapus",
      //     icon: "success",
      //     confirmButtonText: "Cool",
      //   });
      //   getAllCriteria();
      // });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Data gagal dihapus",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  const getAllAlternative = async () => {
    try {
      // const response = await fetch("http://localhost:8000/alternative");
      // const jsonData = await response.json();
      // setDataAlternative(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const submitAlternative = () => {
    if (checkDataNullAlternative()) {
      const newAlternative = {
        name_alternative,
      };

      try {
        // fetch("http://localhost:8000/alternative", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify(newAlternative),
        // }).then((data) => {
        //   Swal.fire({
        //     title: "Success!",
        //     text: "Data berhasil ditambahkan",
        //     icon: "success",
        //     confirmButtonText: "Cool",
        //   });
        //   getAllAlternative();
        // });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Data gagal ditambahkan",
          icon: "error",
          confirmButtonText: "Cool",
        });
      }

      setNameAlternative("");
    } else {
      Swal.fire({
        title: "Error!",
        text: "Data tidak boleh kosong",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  const deleteAlternative = async (id) => {
    try {
      // await fetch("http://localhost:8000/alternative/" + id, {
      //   method: "DELETE",
      // }).then((data) => {
      //   Swal.fire({
      //     title: "Success!",
      //     text: "Alternative berhasil dihapus",
      //     icon: "success",
      //     confirmButtonText: "Cool",
      //   });
      //   getAllAlternative();
      // });
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "Data gagal dihapus",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  useEffect(() => {
    getAllCriteria();
    getAllAlternative();
  }, []);

  return (
    <>
      <div className="container mx-auto shadow-xl mt-3 rounded-lg overflow-hidden">
        <Navbar />

        <div className="mb-4 w-full flex">
          <div className="w-1/2 pl-10 pr-3 bg-gray-50 p-5 shadow rounded-md ml-5 mr-2">
            <h2 className="font-bold">Kriteria</h2>
            <div className="my-2 ">
              <form className="w-full flex flex-row gap-2">
                <div className="mb-1 w-full">
                  <input
                    type="text"
                    id="name_criteria"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nama Kriteria"
                    onChange={(e) => setNameCriteria(e.target.value)}
                    value={name_criteria}
                    required
                  />
                </div>
                <div className="mb-1 w-full">
                  <input
                    type="text"
                    id="weight"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Bobot"
                    onChange={(e) => setWeight(e.target.value)}
                    value={weight}
                    required
                  />
                </div>
                <div className="mb-1 w-full">
                  <select
                    id="attribute"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Atribut"
                    onChange={(e) => setAttribute(e.target.value)}
                    value={attribute}
                    required
                  >
                    <option value="">Pilih Atribut</option>
                    <option value="benefit">Benefit</option>
                    <option value="cost">Cost</option>
                  </select>
                </div>
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={submitCriteria}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Nama Kriteria
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Bobot
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Atribut
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataCriteria.length === 0 && (
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap text-center"
                        colSpan={4}
                      >
                        No Data
                      </th>
                    </tr>
                  )}
                  {dataCriteria.map((data) => (
                    <tr className="bg-white border-b" key={data.id}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {data.name_criteria}
                      </th>
                      <td className="px-6 py-4">{data.weight}</td>
                      <td className="px-6 py-4">{data.attribute}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          className=""
                          onClick={() => deleteCriteria(data.id)}
                        >
                          <svg
                            className="w-5 h-5 text-red-500 hover:text-red-700"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 20"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-1/2 pl-3 pr-10 bg-gray-50 p-5 shadow rounded-md mr-5 ml-2">
            <h2 className="font-bold">Alternatif</h2>
            <div className="my-2 ">
              <form className="w-full flex flex-row gap-2">
                <div className="mb-1 w-full">
                  <input
                    type="text"
                    id="name_alternative"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Nama Alternatif"
                    onChange={(e) => setNameAlternative(e.target.value)}
                    value={name_alternative}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                  onClick={submitAlternative}
                >
                  <svg
                    className="w-5 h-5 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 1v16M1 9h16"
                    />
                  </svg>
                </button>
              </form>
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Nama Alternatif
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataAlternative.length === 0 && (
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap text-center"
                        colSpan={2}
                      >
                        No Data
                      </th>
                    </tr>
                  )}
                  {dataAlternative.map((data) => (
                    <tr className="bg-white border-b" key={data.id}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {data.name_alternative}
                      </th>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          className=""
                          onClick={() => deleteAlternative(data.id)}
                        >
                          <svg
                            className="w-5 h-5 text-red-500 hover:text-red-700"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 18 20"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="pl-5 pb-4">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Submit Data
          </button>
        </div>
      </div>
    </>
  );
};

export default UploadForm;
