"use client";
import Navbar from "@/components/navbar";
import Title from "@/components/title";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { i } from "mathjs";

const Alternative = () => {
  const [name_alternative, setNameAlternative] = useState("");
  const [dataAlternative, setDataAlternative] = useState([]);
  const [dataCriteria, setDataCriteria] = useState([]);

  const getAllAlternative = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:9000/api/alternatives"
      );
      setDataAlternative(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getAllCriteria = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:9000/api/criterias");
      setDataCriteria(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const checkDataNullAlternative = () => {
    if (name_alternative === "") {
      return false;
    } else {
      return true;
    }
  };

  const createMatrixValue = async () => {
    const altLength = dataAlternative.length + 1;
    const criLength = dataCriteria.length;
    const altData = [];
    const criData = [];
    try {
      const responseAlt = await axios.get(
        "http://127.0.0.1:9000/api/alternatives"
      );
      const responseCri = await axios.get(
        "http://127.0.0.1:9000/api/criterias"
      );
      altData.push(responseAlt.data);
      criData.push(responseCri.data);
    } catch (err) {
      console.error(err.message);
    }

    const matrixValue = await axios.get(
      "http://127.0.0.1:9000/api/matrixvalues"
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
          try {
            await axios.post(
              "http://127.0.0.1:9000/api/matrixvalues",
              newMatrixValue
            );
          } catch (err) {
            console.error(err.message);
          }
        }
      }
    } else {
      for (let i = 0; i < criLength; i++) {
        const newMatrixValue = {
          id_alternative: altData[0][altData[0].length - 1]._id,
          id_criteria: criData[0][i]._id,
          value: 0,
        };
        try {
          await axios.post(
            "http://127.0.0.1:9000/api/matrixvalues",
            newMatrixValue
          );
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  };

  const deleteMatrixValue = async (idAlt) => {
    const matrixValue = await axios.get(
      "http://127.0.0.1:9000/api/matrixvalues"
    );
    const matrixValueData = matrixValue.data;

    if (matrixValueData.length !== 0) {
      await axios.delete(
        "http://127.0.0.1:9000/api/matrixvaluesalternative/" + idAlt
      );
    }

    //   deleteMatrixValue.map(async (data) => {
    //     try {
    //       await axios.delete(
    //         "http://127.0.0.1:9000/api/matrixvaluesalternative/" + idAlt
    //       );
    //     } catch (err) {
    //       console.error(err.message);
    //     }
    //   });
  };

  const submitAlternative = async () => {
    if (checkDataNullAlternative()) {
      const newAlternative = {
        name_alternative,
      };

      try {
        await axios
          .post("http://127.0.0.1:9000/api/alternatives", newAlternative)
          .then((data) => {
            Swal.fire({
              title: "Success!",
              text: "Data berhasil ditambahkan",
              icon: "success",
              confirmButtonText: "Cool",
            });
            getAllAlternative();
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
      await axios
        .delete("http://127.0.0.1:9000/api/alternatives/" + id)
        .then((data) => {
          Swal.fire({
            title: "Success!",
            text: "Data berhasil dihapus",
            icon: "success",
            confirmButtonText: "Cool",
          });
          getAllAlternative();
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
    getAllAlternative();
  }, []);
  return (
    <>
      <div className="container mx-auto shadow-xl mt-3 rounded-lg overflow-hidden">
        <div className="p-5 mb-10">
          <Title />
          <nav className="mt-2 flex gap-3 items-center justify-center">
            <Link href={"/criteria"}>Kriteria</Link>
            <Link href={"/alternative"}>Alternatif</Link>
            {/* check if dataCriteria is empty  */}
            {/* sweer alert if dataCriteria is empty */}
            {dataAlternative.length === 0 ? (
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
                <Link href={"/matrixvalue"}>Nilai Matriks</Link>
                <Link href={"resulttopsis"}>Hasil Topsis</Link>
              </>
            )}
          </nav>
        </div>
        <div className="mb-10 w-full flex">
          <div className="w-2/3 mx-auto bg-gray-50 p-5 shadow rounded-md">
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
                    <tr className="bg-white border-b" key={data._id}>
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
                          onClick={() => deleteAlternative(data._id)}
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

export default Alternative;
