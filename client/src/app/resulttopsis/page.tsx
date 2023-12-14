"use client";
import Navbar from "@/components/navbar";
import Title from "@/components/title";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as math from "mathjs";
import { get } from "http";
import axios from "axios";

const ResultTopsis = () => {
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

  const getNormalizedMatrix = () => {
    const dataNormalize = [];
    const sumSquares = [];
    // for each criteria
    for (let i = 0; i < dataCriteria.length; i++) {
      let sumSquared = 0;
      for (let j = 0; j < dataAlternative.length; j++) {
        const matrixValue = dataMatrixValue.filter(
          (data) =>
            data.id_alternative === dataAlternative[j]?._id &&
            data.id_criteria === dataCriteria[i]?._id
        );
        const value = matrixValue[0]?.value;
        sumSquared += Math.pow(value, 2);
      }
      sumSquares.push(sumSquared);
    }
    for (let i = 0; i < dataAlternative.length; i++) {
      for (let j = 0; j < dataCriteria.length; j++) {
        const matrixValue = dataMatrixValue.filter(
          (data) =>
            data.id_alternative === dataAlternative[i]?._id &&
            data.id_criteria === dataCriteria[j]?._id
        );
        const value = matrixValue[0]?.value;
        const R = Math.sqrt(sumSquares[j]);
        const normalizedValue = value / R;
        dataNormalize.push({
          id: matrixValue[0]?._id,
          id_alternative: matrixValue[0]?.id_alternative,
          id_criteria: matrixValue[0]?.id_criteria,
          value: normalizedValue,
        });
      }
    }
    return dataNormalize;
  };

  const dataNormalizedMatrix = getNormalizedMatrix();

  const getWeightedNormalizedMatrix = () => {
    const dataWeightedNormalized = [];
    for (let i = 0; i < dataCriteria.length; i++) {
      const weight = dataCriteria[i]?.weight_criteria;
      for (let j = 0; j < dataAlternative.length; j++) {
        const matrixValue = dataNormalizedMatrix.filter(
          (data) =>
            data.id_alternative === dataAlternative[j]?._id &&
            data.id_criteria === dataCriteria[i]?._id
        );
        const value = matrixValue[0]?.value;
        const weightedNormalizedValue = value * weight;
        dataWeightedNormalized.push({
          id: matrixValue[0]?._id,
          id_alternative: matrixValue[0]?.id_alternative,
          id_criteria: matrixValue[0]?.id_criteria,
          value: weightedNormalizedValue,
        });
      }
    }
    return dataWeightedNormalized;
  };

  const dataWeightedNormalizedMatrix = getWeightedNormalizedMatrix();

  const getAPlus = () => {
    const dataAPlus = [];
    for (let i = 0; i < dataCriteria.length; i++) {
      const attribute = dataCriteria[i]?.type_criteria;
      if (attribute === "benefit") {
        const matrixValue = dataWeightedNormalizedMatrix.filter(
          (data) => data.id_criteria === dataCriteria[i]?._id
        );
        const max = Math.max(...matrixValue.map((data) => data.value));
        dataAPlus.push(max);
      } else {
        const matrixValue = dataWeightedNormalizedMatrix.filter(
          (data) => data.id_criteria === dataCriteria[i]?._id
        );
        const min = Math.min(...matrixValue.map((data) => data.value));
        dataAPlus.push(min);
      }
    }
    return dataAPlus;
  };

  const dataAPlus = getAPlus();

  const getAMinus = () => {
    const dataAMinus = [];
    for (let i = 0; i < dataCriteria.length; i++) {
      const attribute = dataCriteria[i]?.type_criteria;
      if (attribute === "benefit") {
        const matrixValue = dataWeightedNormalizedMatrix.filter(
          (data) => data.id_criteria === dataCriteria[i]?._id
        );
        const min = Math.min(...matrixValue.map((data) => data.value));
        dataAMinus.push(min);
      } else {
        const matrixValue = dataWeightedNormalizedMatrix.filter(
          (data) => data.id_criteria === dataCriteria[i]?._id
        );
        const max = Math.max(...matrixValue.map((data) => data.value));
        dataAMinus.push(max);
      }
    }
    return dataAMinus;
  };

  const dataAMinus = getAMinus();

  const getDistanceToAPlus = () => {
    const dataDistanceToAPlus = [];
    for (let i = 0; i < dataAlternative.length; i++) {
      let sum = 0;
      for (let j = 0; j < dataCriteria.length; j++) {
        const matrixValue = dataWeightedNormalizedMatrix.filter(
          (data) => data.id_alternative === dataAlternative[i]?._id
        );
        const value = matrixValue[j]?.value;
        const aPlus = dataAPlus[j];
        const distance = Math.pow(value - aPlus, 2);
        sum += distance;
      }
      const distanceToAPlus = Math.sqrt(sum);
      dataDistanceToAPlus.push(distanceToAPlus);
    }
    return dataDistanceToAPlus;
  };

  const dataDistanceToAPlus = getDistanceToAPlus();

  const getDistanceToAMinus = () => {
    const dataDistanceToAMinus = [];
    for (let i = 0; i < dataAlternative.length; i++) {
      let sum = 0;
      for (let j = 0; j < dataCriteria.length; j++) {
        const matrixValue = dataWeightedNormalizedMatrix.filter(
          (data) => data.id_alternative === dataAlternative[i]?._id
        );
        const value = matrixValue[j]?.value;
        const aMinus = dataAMinus[j];
        const distance = Math.pow(value - aMinus, 2);
        sum += distance;
      }
      const distanceToAMinus = Math.sqrt(sum);
      dataDistanceToAMinus.push(distanceToAMinus);
    }
    return dataDistanceToAMinus;
  };

  const dataDistanceToAMinus = getDistanceToAMinus();

  const getPreferenceValue = () => {
    const dataPreferenceValue = [];
    for (let i = 0; i < dataAlternative.length; i++) {
      const distanceToAPlus = dataDistanceToAPlus[i];
      const distanceToAMinus = dataDistanceToAMinus[i];
      const preferenceValue =
        distanceToAMinus / (distanceToAPlus + distanceToAMinus);
      dataPreferenceValue.push(preferenceValue);
    }
    return dataPreferenceValue;
  };

  const dataPreferenceValue = getPreferenceValue();

  useEffect(() => {
    getAllMatrixValue();
    getAllCriteria();
    getAllAlternative();
  }, []);
  return (
    <>
      <div className="container mx-auto shadow-xl my-3 rounded-lg overflow-hidden">
        <div className="p-5 mb-10">
          <Title />
          <Navbar />
        </div>

        <div className="mb-8 w-full flex flex-col">
          {/* evaluation matrix */}
          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <div className="w-full">
              <h2 className="font-bold">
                Evaluation Matrix (X<sub>ij</sub>)
              </h2>
              <div className="my-2"></div>
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
                            <td className="px-6 py-4" key={dataMatrix._id}>
                              {dataMatrix.value}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <div className="w-full">
              <h2 className="font-bold">
                Normalized Matrix (R<sub>ij</sub>)
              </h2>
              <div className="my-2"></div>
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
                        {dataNormalizedMatrix
                          .filter(
                            (dataMatrix) => dataMatrix.id_criteria === data._id
                          )
                          .map((dataMatrix, index) => (
                            <td className="px-6 py-4" key={dataMatrix._id}>
                              {math.round(dataMatrix.value, 5)}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <div className="w-full">
              <h2 className="font-bold">
                Weighted Normalized Matrix (V<sub>ij</sub>)
              </h2>
              <div className="my-2"></div>
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
                        {dataNormalizedMatrix
                          .filter(
                            (dataMatrix) => dataMatrix.id_criteria === data._id
                          )
                          .map((dataMatrix, index) => (
                            <td className="px-6 py-4" key={dataMatrix._id}>
                              {math.round(
                                dataMatrix.value *
                                  dataCriteria[index]?.weight_criteria,
                                5
                              )}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <div className="w-full">
              <h2 className="font-bold">
                Positive Ideal Solution (A<span className="text-sm">+</span>)
              </h2>
              <div className="my-2"></div>
              {/* Table Matrik */}
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-2 py-3">
                        Kriteria
                      </th>
                      {dataCriteria.map((data) => (
                        <th scope="col" className="px-6 py-3" key={data._id}>
                          {data.name_criteria + " (" + data.type_criteria + ")"}{" "}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        A<sub>j</sub>
                        <sup>+</sup>
                      </th>
                      {dataAPlus.map((data, index) => (
                        <td className="px-6 py-4" key={data._id}>
                          {math.round(data, 5)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <div className="w-full">
              <h2 className="font-bold">
                Negative Ideal Solution (A<span className="text-sm">-</span>)
              </h2>
              <div className="my-2"></div>
              {/* Table Matrik */}
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-2 py-3">
                        Kriteria
                      </th>
                      {dataCriteria.map((data) => (
                        <th scope="col" className="px-6 py-3" key={data._id}>
                          {data.name_criteria + " (" + data.type_criteria + ")"}{" "}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        A<sub>j</sub>
                        <sup>-</sup>
                      </th>
                      {dataAMinus.map((data, index) => (
                        <td className="px-6 py-4" key={data._id}>
                          {math.round(data, 5)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <div className="w-full">
              <h2 className="font-bold">
                Distance to Positive Ideal Solution (D<sub>i</sub>
                <sup>+</sup>)
              </h2>
              <div className="my-2"></div>
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
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        D<sub>i</sub>
                        <sup>+</sup>
                      </th>
                      {dataDistanceToAPlus.map((data, index) => (
                        <td className="px-6 py-4" key={data._id}>
                          {math.round(data, 5)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <div className="w-full">
              <h2 className="font-bold">
                Distance to Negative Ideal Solution (D<sub>i</sub>
                <sup>-</sup>)
              </h2>
              <div className="my-2"></div>
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
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        D<sub>i</sub>
                        <sup>-</sup>
                      </th>
                      {dataDistanceToAMinus.map((data, index) => (
                        <td className="px-6 py-4" key={data._id}>
                          {math.round(data, 5)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mx-auto w-2/3 bg-gray-50 p-5 shadow rounded-md mb-5">
            <h2 className="font-bold">
              Preference Value (V<sub>i</sub>)
            </h2>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Nama Alternatif
                    </th>
                    <th scope="col" className="px-6 py-3">
                      V<sub>i</sub>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {/* sort by best value ranking */}
                  {dataPreferenceValue
                    .map((data, index) => ({
                      value: data,
                      index,
                    }))
                    .sort((a, b) => b.value - a.value)
                    .map((data, index) => (
                      <tr className="bg-white border-b" key={data._id}>
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {index + 1}
                        </th>
                        <td className="px-6 py-4">
                          {dataAlternative[data.index]?.name_alternative}
                        </td>
                        <td className="px-6 py-4">
                          {math.round(data.value, 5)}
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

export default ResultTopsis;
