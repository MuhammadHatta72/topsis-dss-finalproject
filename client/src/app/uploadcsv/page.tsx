"use client";
import Title from "@/components/title";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import axios from "axios";

const UploadCSV = () => {
  const showLoadingAlert = async () => {
    // Tampilkan pesan SweetAlert dengan animasi loading
    const loadingAlert = await Swal.fire({
      title: "Loading...",
      text: "Data sedang diproses, silahkan tunggu!",
      timer: 20000, // Durasi tampilan pesan (dalam milidetik)
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
    });

    // Setelah 10 detik, tutup pesan SweetAlert dan tampilkan pesan OK
    if (loadingAlert.dismiss === Swal.DismissReason.timer) {
      await Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil diupload!",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/criteria";
        }
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    try {
      const reader = new FileReader();

      reader.onload = async function (e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });

        workbook.SheetNames.forEach(async (sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const extractedData = XLSX.utils.sheet_to_json(sheet);
          if (sheetName === "Kriteria" || sheetName === "Alternatif") {
            if (sheetName === "Kriteria") {
              for (let i = 0; i < extractedData.length; i++) {
                const newCriteria = {
                  name_criteria: extractedData[i]["Nama Kriteria"],
                  weight_criteria: extractedData[i]["Bobot"],
                  type_criteria: extractedData[i]["Atribut"],
                };
                try {
                  await axios.post(
                    "http://127.0.0.1:9000/api/criterias",
                    newCriteria
                  );
                } catch (err) {
                  console.error(err.message);
                }
              }
            } else if (sheetName === "Alternatif") {
              for (let i = 0; i < extractedData.length; i++) {
                const newAlternative = {
                  name_alternative: extractedData[i]["Nama Alternatif"],
                };
                try {
                  await axios.post(
                    "http://127.0.0.1:9000/api/alternatives",
                    newAlternative
                  );
                } catch (err) {
                  console.error(err.message);
                }
              }
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "File yang diupload tidak sesuai template!",
              });
            }

            const fetchData = async () => {
              try {
                const altResponse = await axios.get(
                  "http://127.0.0.1:9000/api/alternatives"
                );
                const criResponse = await axios.get(
                  "http://127.0.0.1:9000/api/criterias"
                );

                const altData = altResponse.data;
                const criData = criResponse.data;

                return { altData, criData };
              } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
              }
            };

            fetchData()
              .then(async (data) => {
                const altData = data.altData;
                const criData = data.criData;

                for (let i = 0; i < altData.length; i++) {
                  for (let j = 0; j < criData.length; j++) {
                    const checkMatrixExist = () => {
                      return axios
                        .get("http://127.0.0.1:9000/api/matrixvalues")
                        .then((matrixValueResponse) => {
                          const existingMatrixValue =
                            matrixValueResponse.data.find(
                              (matrixValue) =>
                                matrixValue.id_alternative === altData[i]._id &&
                                matrixValue.id_criteria === criData[j]._id
                            );
                          return existingMatrixValue;
                        })
                        .catch((error) => {
                          console.error("Error fetching data:", error);
                          throw error;
                        });
                    };

                    checkMatrixExist()
                      .then((existingMatrixValue) => {
                        if (!existingMatrixValue) {
                          const newMatrixValue = {
                            id_alternative: altData[i]._id,
                            id_criteria: criData[j]._id,
                            value: 0,
                          };
                          axios
                            .post(
                              "http://127.0.0.1:9000/api/matrixvalues",
                              newMatrixValue
                            )
                            .then((response) => {})
                            .catch((err) => {
                              console.error(err.message);
                            });
                        }
                      })
                      .catch((error) => {
                        console.error("Error:", error);
                      });
                  }
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "File yang diupload tidak sesuai template!",
            });
          }
        });
      };

      reader.readAsBinaryString(file);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "File yang diupload tidak sesuai template!",
      });
    }

    showLoadingAlert();
  };
  return (
    <>
      <div className="container mx-auto shadow-xl mt-3 py-5 rounded-lg overflow-hidden">
        <Title />

        <div className="mt-10 mx-10">
          <h2 className="text-left font-semibold">Download Template</h2>
          <div className="flex items-center justify-start w-full my-2">
            <a href="/files/template_hitung_topsis.xlsx" download>
              <button
                type="button"
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              >
                Download Template
              </button>
            </a>
          </div>
        </div>
        <hr className="w-full border-1 border-gray-300 my-2" />
        <div className="mx-10">
          <h2 className="text-left font-semibold">
            Upload File CSV atau Excel
          </h2>
          <div className="flex items-center justify-center w-full my-2">
            <label
              htmlFor="file-excel"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSV or Excel
                </p>
              </div>
              <input
                id="file-excel"
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e)}
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              />
            </label>
          </div>
          {/* <button
            type="button"
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-4"
          >
            Proses File
          </button> */}
        </div>
      </div>
    </>
  );
};

export default UploadCSV;
