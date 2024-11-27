/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import clsx from "clsx";
import { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import DynamicFormHN from "./DynamicFormHN";
import DynamicFormKT from "./DynamicFormKT";
import DynamicFormUpdate from "./DynamicFormUpdate";

function formatDate(dateString: string) {
  // Check if the input is in the format "DDMMYYYY"
  if (/^\d{8}$/.test(dateString)) {
    return dateString.replace(/(\d{2})(\d{2})(\d{4})/, "$1.$2.$3");
  }

  // Check if the input is in the format "MMYYYY"
  if (/^\d{6}$/.test(dateString)) {
    return dateString.replace(/(\d{2})(\d{4})/, "$1.$2");
  }

  // If the input doesn't match either format, return the original string
  return dateString;
}

function capitalizeString(str: string, full = true) {
  // Split the string into an array of words

  if (full) {
    const words = str.split(" ");

    // Capitalize the first letter of each word
    const capitalizedWords = words.map((word) => {
      if (word.length === 0) return word; // Handle empty strings
      return word[0].toUpperCase() + word.slice(1).toLowerCase();
    });
    return capitalizedWords.join(" ");
  } else {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
  }

  // Join the words back into a string
}

const arr = [
  "ngayDangKy",
  "nxnNgaySinh",
  "nxnThoiGianCuTruTu",
  "nxnThoiGianCuTruDen",
  "nktNgaySinh",
  "nktNgayChet",
];
const arr1 = ["nguoiThucHien", "nguoiKy", "nxnHoTen", "nycHoTen", "nktHoTen"];

export default function ExcelUploader() {
  const [excelData, setExcelData] = useState<Record<string, any>[]>([]);
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [showUpload, setShowUpload] = useState(true);
  const [form, setForm] = useState("");
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileName(file.name);
      const reader = new FileReader();

      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (parsedData.length >= 2) {
          let headerRow = parsedData[0] as string[];
          const templateRow = parsedData[1] as any[];
          const template: Record<string, any> = {};
          headerRow = headerRow.map((el) => el.trim());

          headerRow.forEach((header, index) => {
            template[header] = templateRow[index];
          });

          setHeaders(headerRow);
          // setTemplate(template);
          const arr = parsedData.slice(1);
          console.log(arr);
          let dataWithHeaders: Record<string, any>[] = [];
          if (arr && arr.length > 0 && (arr[0] as any[]).length > 0) {
            // Convert remaining rows to objects with headers
            dataWithHeaders = arr.map((row: any) => {
              console.log({ row });
              const obj: Record<string, any> = {};
              headerRow.forEach((header, index) => {
                console.log("row[index]");
                if (row[index]) obj[header] = row[index];
              });
              return obj;
            });
          }
          let list: any = localStorage.getItem("excel");
          if (list) {
            list = JSON.parse(list);
            setExcelData(list);
          } else {
            setExcelData(dataWithHeaders);
          }
          setShowUpload(false);
        }
      };

      reader.readAsBinaryString(file);
    },
    []
  );

  const handleFileUploadHN = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUpload(e);
      setForm("HN");
    },
    [handleFileUpload]
  );

  const handleFileUploadKT = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFileUpload(e);
      setForm("KT");
    },
    [handleFileUpload]
  );

  const handleData = useCallback((newData: any) => {
    const datas = { ...newData };
    const keys = Object.keys(datas);
    keys.forEach((key) => {
      if (arr.includes(key)) {
        const value = datas[key]?.replaceAll(".", "");
        datas[key] = formatDate(value);
      } else if (arr1.includes(key)) {
        datas[key] = capitalizeString(datas[key]);
      } else if (datas[key]?.length > 0) {
        datas[key] = capitalizeString(datas[key] ?? "", false);
      }
    });

    return datas;
  }, []);

  const handleAddData = useCallback(
    (newData: any) => {
      const updatedData = handleData(newData);
      setExcelData([...excelData, updatedData]);
      localStorage.setItem(
        "excel",
        JSON.stringify([...excelData, updatedData])
      );
    },
    [excelData]
  );

  const handleExportData = useCallback(() => {
    const updatedData = [...excelData];

    // Create new workbook and save file
    const ws = XLSX.utils.json_to_sheet(
      [
        headers,
        ...updatedData.map((row) => headers.map((header) => row[header])),
      ],
      { skipHeader: true }
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName);
    localStorage.removeItem("excel");
  }, [excelData, fileName, headers]);

  const handleEdit = useCallback((index: number) => {
    setEditingRow(index);
  }, []);

  const handleCancel = useCallback(() => {
    setEditingRow(null);
  }, [setEditingRow]);

  const handleSave = useCallback(
    (updatedRow: any) => {
      if (editingRow === null) return;
      const newData = [...excelData];
      const updatedData = handleData(updatedRow);
      newData[editingRow] = updatedData;
      setExcelData(newData);
      setEditingRow(null);
    },
    [editingRow, excelData]
  );

  return (
    <div className="space-y-8 w-full">
      {showUpload && (
        <div className="flex items-center gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              {/* <ArrowUpTrayIcon className="max-w-3 w-3 h-3 text-gray-400" /> */}
              <span className="mt-2 text-gray-600">Upload Excel File HN</span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileUploadHN}
              />
            </label>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
            <label className="flex flex-col items-center justify-center cursor-pointer">
              {/* <ArrowUpTrayIcon className="max-w-3 w-3 h-3 text-gray-400" /> */}
              <span className="mt-2 text-gray-600">Upload Excel File KT</span>
              <input
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileUploadKT}
              />
            </label>
          </div>
        </div>
      )}

      {headers.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg p-6">
            {editingRow !== null ? (
              <h2 className="text-xl font-semibold mb-4">
                UPDATE ROW {editingRow}
              </h2>
            ) : (
              <h2 className="text-xl font-semibold mb-4">
                Add New Data, hiện có: {excelData.length}
              </h2>
            )}
            {editingRow !== null ? (
              <DynamicFormUpdate
                headers={headers}
                template={excelData[editingRow]}
                onSubmit={handleSave}
                handleCancel={handleCancel}
              />
            ) : form === "HN" ? (
              <DynamicFormHN
                headers={headers}
                template={excelData[excelData.length - 1]}
                onSubmit={handleAddData}
              />
            ) : form === "KT" ? (
              <DynamicFormKT
                headers={headers}
                template={excelData[excelData.length - 1]}
                onSubmit={handleAddData}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      )}

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        {headers.length > 0 && (
          <div className="">
            <div className="flex space-x-4 items-center mb-4">
              <h2 className="text-xl font-semibold  text-black">
                Current Data: {excelData.length} record(s)
              </h2>
              <button
                type="button"
                className={clsx(
                  "w-[200px] flex justify-center py-2 px-4 border border-transparent",
                  "rounded-md shadow-sm text-sm font-medium text-white",
                  "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2",
                  "focus:ring-offset-2 focus:ring-blue-500"
                )}
                onClick={handleExportData}
              >
                Export File
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                      ACTION
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                      STT
                    </th>
                    {headers.map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...excelData].reverse().map((row, index) => (
                    <tr key={index} className="bg-white border-b ">
                      <td className="px-6 border py-4 whitespace-nowrap text-black text-sm">
                        <button
                          onClick={() =>
                            handleEdit(excelData.length - 1 - index)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          EDIT
                        </button>
                      </td>
                      <td className="px-6 border py-4 whitespace-nowrap text-black text-sm">
                        {index + 1}
                      </td>
                      {headers.map((header, cellIndex) => (
                        <td
                          key={`${index}-${cellIndex}`}
                          className="px-6 border py-4 whitespace-nowrap text-black text-sm"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
