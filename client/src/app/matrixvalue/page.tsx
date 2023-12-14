"use client";
import Navbar from "@/components/navbar";
import Title from "@/components/title";
import axios from "axios";
import { re } from "mathjs";
import React, { useEffect, useState } from "react";

const MatrixValue = () => {
  const [dataCriteria, setDataCriteria] = useState([]);
  const [dataAlternative, setDataAlternative] = useState([]);
  const [dataMatrixValue, setDataMatrixValue] = useState([]);

  const getAllCriteria = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:9000/api/criterias");
      setDataCriteria(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

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
  const getAllMatrixValue = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:9000/api/matrixvalues"
      );
      setDataMatrixValue(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const changeValueMatrik = async (id, value) => {
    try {
      //yang diubah cuma value
      const response = await axios.get(
        "http://127.0.0.1:9000/api/matrixvalues/" + id
      );
      const jsonData = response.data;
      const body = {
        value: parseInt(value),
      };
      await axios.put("http://127.0.0.1:9000/api/matrixvalues/" + id, body);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getAllMatrixValue();
    getAllCriteria();
    getAllAlternative();
  }, []);
  return (
    <>
      <div className="container mx-auto shadow-xl mt-3 rounded-lg overflow-hidden">
        <div className="p-5 mb-10">
          <Title />
          <Navbar />
        </div>

        <div className="mb-4 w-full flex">
          <div className="w-1/2 pr-3 bg-gray-50 p-5 shadow rounded-md ml-5 mr-2">
            <h2 className="font-bold">Kriteria</h2>
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
                  </tr>
                </thead>
                <tbody>
                  {dataCriteria.length === 0 && (
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap text-center"
                        colSpan={3}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="w-1/2 pl-3 bg-gray-50 p-5 shadow rounded-md mr-5 ml-2">
            <h2 className="font-bold">Alternatif</h2>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Nama Alternatif
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataAlternative.length === 0 && (
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium whitespace-nowrap text-center"
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Form Matrix Value */}
        <div className="w-full p-5">
          <div className=" bg-gray-50 p-5 shadow rounded-md">
            <div className="w-full">
              <h2 className="font-bold">Nilai Matrik</h2>
              <div className="my-2"></div>
            </div>
            {/* Table Matrik */}
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-2 py-3">
                      Alternatif
                    </th>
                    {dataAlternative.map((data) => (
                      <th scope="col" className="px-6 py-3" key={data._id}>
                        {data.name_alternative}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dataCriteria.map((data, index) => (
                    <tr className="bg-white border-b" key={data._id}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {data.name_criteria}
                      </th>
                      {dataMatrixValue
                        .filter(
                          (dataMatrix) => dataMatrix.id_criteria === data._id
                        )
                        .map((dataMatrix, index) => (
                          <td className="px-6 py-4" key={index}>
                            <input
                              type="number"
                              className="border-2 border-gray-200 p-3 rounded outline-none focus:border-gray-500"
                              placeholder="Nilai"
                              defaultValue={dataMatrix.value}
                              onChange={(e) =>
                                changeValueMatrik(
                                  dataMatrix._id,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* <div className="pb-4 flex items-center justify-center">
          <button
            type="button"
            className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Submit Data
          </button>
        </div> */}
      </div>
    </>
  );
};

export default MatrixValue;
