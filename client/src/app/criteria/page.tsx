"use client";
import Navbar from "@/components/navbar";
import Title from "@/components/title";
import axios from "axios";
import { stat } from "fs";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";

const Criteria = () => {
  const [name_criteria, setNameCriteria] = useState("");
  const [weight, setWeight] = useState("");
  const [attribute, setAttribute] = useState("");

  const [dataCriteria, setDataCriteria] = useState([]);
  const [dataAlternative, setDataAlternative] = useState([]);

  const getAllCriteria = async () => {
    try {
      const responseCriteria = await axios.get(
        "http://127.0.0.1:9000/api/criterias/"
      );
      const responseAlternative = await axios.get(
        "http://127.0.0.1:9000/api/alternatives/"
      );
      setDataCriteria(responseCriteria.data);
      setDataAlternative(responseAlternative.data);
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

  const createMatrixValue = async () => {
    const altLength = dataAlternative.length;
    const criLength = dataCriteria.length + 1;
    const altData = [];
    const criData = [];
    try {
      const responseAlt = await axios.get(
        "http://127.0.0.1:9000/api/alternatives/"
      );
      const responseCri = await axios.get(
        "http://127.0.0.1:9000/api/criterias/"
      );
      altData.push(responseAlt.data);
      criData.push(responseCri.data);
    } catch (err) {
      console.error(err.message);
    }
    const matrixValue = await axios.get(
      "http://127.0.0.1:9000/api/matrixvalues/"
    );
    const matrixValueData = matrixValue.data;

    if (matrixValueData.length === 0) {
      for (let i = 0; i < altLength; i++) {
        for (let j = 0; j < criLength; j++) {
          const newMatrixValue = {
            id_alternative: altData[0][i]._id,
            id_criteria: criData[0][j]._id,
            value: 0,
          };
          await axios.post(
            "http://127.0.0.1:9000/api/matrixvalues/",
            newMatrixValue
          );
        }
      }
    } else {
      for (let i = 0; i < altLength; i++) {
        for (let j = 0; j < criLength; j++) {
          const newMatrixValue = {
            id_alternative: altData[0][i]._id,
            id_criteria: criData[0][j]._id,
            value: 0,
          };
          const checkMatrixValue = matrixValueData.filter(
            (data) =>
              data.id_alternative === newMatrixValue.id_alternative &&
              data.id_criteria === newMatrixValue.id_criteria
          );
          if (checkMatrixValue.length === 0) {
            await axios.post(
              "http://127.0.0.1:9000/api/matrixvalues",
              newMatrixValue
            );
          }
        }
      }
    }
  };

  const deleteMatrixValue = async (idCri) => {
    const matrixValue = await axios.get(
      "http://127.0.0.1:9000/api/matrixvalues/"
    );
    const matrixValueData = matrixValue.data;

    if (matrixValueData.length !== 0) {
      await axios.delete(
        "http://127.0.0.1:9000/api/matrixvaluescriteria/" + idCri
      );
    }

    // deleteMatrixValue.map(async (data) => {
    //   try {
    //     await axios.delete(
    //       "http://127.0.0.1:9000/api/matrixvaluescriteria/" + idCri
    //     );
    //   } catch (err) {
    //     console.error(err.message);
    //   }
    // });
  };

  const submitCriteria = async () => {
    if (checkDataNullCriteria()) {
      const newCriteria = {
        name_criteria: name_criteria,
        weight_criteria: parseInt(weight),
        type_criteria: attribute,
      };

      try {
        await axios
          .post("http://127.0.0.1:9000/api/criterias", newCriteria)
          .then((data) => {
            Swal.fire({
              title: "Success!",
              text: "Data berhasil ditambahkan",
              icon: "success",
              confirmButtonText: "Cool",
            });
            getAllCriteria();
            createMatrixValue();
          });
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
      await axios
        .delete("http://127.0.0.1:9000/api/criterias/" + id)
        .then((data) => {
          Swal.fire({
            title: "Success!",
            text: "Criteria berhasil dihapus",
            icon: "success",
            confirmButtonText: "Cool",
          });
          getAllCriteria();
          deleteMatrixValue(id);
        });
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
  }, []);

  return (
    <>
      <div className="container mx-auto shadow-xl mt-3 rounded-lg overflow-hidden">
        <div className="p-5 mb-10">
          <Title />
          <nav className="mt-2 flex gap-3 items-center justify-center">
            <Link href={"/criteria"}>Kriteria</Link>
            {/* check if dataCriteria is empty  */}
            {/* sweer alert if dataCriteria is empty */}
            {dataCriteria.length === 0 ? (
              // return swal
              <>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Error!",
                      text: "Data Kriteria tidak boleh kosong",
                      icon: "error",
                      confirmButtonText: "Cool",
                    });
                  }}
                >
                  Alternatif
                </button>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Error!",
                      text: "Data Kriteria tidak boleh kosong",
                      icon: "error",
                      confirmButtonText: "Cool",
                    });
                  }}
                >
                  Nilai Matriks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Error!",
                      text: "Data Kriteria tidak boleh kosong",
                      icon: "error",
                      confirmButtonText: "Cool",
                    });
                  }}
                >
                  Hasil Topsis
                </button>
              </>
            ) : (
              <>
                <Link href={"/alternative"}>Alternatif</Link>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Error!",
                      text: "Harap isi data alternatif terlebih dahulu",
                      icon: "error",
                      confirmButtonText: "Cool",
                    });
                  }}
                >
                  Nilai Matriks
                </button>
                <button
                  type="button"
                  onClick={() => {
                    Swal.fire({
                      title: "Error!",
                      text: "Harap isi data alternatif terlebih dahulu",
                      icon: "error",
                      confirmButtonText: "Cool",
                    });
                  }}
                >
                  Hasil Topsis
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="mb-20 w-full flex">
          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md">
            <h2 className="font-bold">Kriteria</h2>
            <div className="my-2 ">
              <form className="w-full flex flex-row gap-2">
                <div className="mb-1 w-full">
                  <input
                    type="text"
                    id="criteria"
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
                    <tr className="bg-white border-b" key={data._id}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {data.name_criteria}
                      </th>
                      <td className="px-6 py-4">{data.weight_criteria}</td>
                      <td className="px-6 py-4">{data.type_criteria}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          type="button"
                          className=""
                          onClick={() => deleteCriteria(data._id)}
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
      </div>
    </>
  );
};

export default Criteria;
