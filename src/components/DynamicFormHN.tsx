/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";

interface DynamicFormProps {
  headers: string[];
  template: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
}

const defaultValue: any = {
  nguoiKy: "Doãn Đình Tứ",
  chucVuNguoiKy: "Chủ tịch",
  nguoiThucHien: "Ngụy Thanh Tuyên",
  nxnGioiTinh: "1",
  nxnLoaiGiayToTuyThan: "1",
  nxnDanToc: "Kinh",
  nxnQuocTich: "Việt Nam",
  nxnLoaiMucDichSuDung: "1",
  nxnLoaiCuTru: "1",
  nxnThoiGianCuTruTai: "Giao Thanh",
  nxnTinhTrangHonNhan: "Chưa kết hôn lần nào",
  nxnNoiCuTru: "Xóm , Giao Thanh",
  nxnSoGiayToTuyThan: "162",
  nxnMucDichSuDung: "",
  nycQuanHe: "",
  nxnThoiGianCuTruDen: "",
  nxnHoTen: "",
  nycHoTen: "",
};

export default function DynamicFormHN({
  headers,
  template,
  onSubmit,
}: DynamicFormProps) {
  // const so = useMemo(() => {
  //   const vale = Number(template["so"] ?? 0) + 1;
  //   if (vale < 10) return `00${vale}`;
  //   if (vale < 100) return `0${vale}`;
  //   return `${vale}`;
  // }, [template]);
  // const trangSo = useMemo(() => {
  //   const vale = Number(template["trangSo"] ?? 0) + 1;
  //   if (vale < 10) return `0${vale}`;
  //   return `${vale}`;
  // }, [template]);

  const defaultData1 = useMemo(() => {
    if (template)
      return {
        ...template,
        ...defaultValue,
        // so: so,
        // trangSo,
      };
    else return defaultValue;
  }, [template]);

  useEffect(() => {
    console.log("defaultData1", defaultData1);
  }, [defaultData1]);

  const [formData, setFormData] = useState<Record<string, any>>(defaultData1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // setFormData({ ...template, ...defaultValue });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    const newData: any = {
      nxnGioiTinh: "1",
      nxnDanToc: "Kinh",
      nxnQuocTich: "Việt Nam",
      nxnLoaiGiayToTuyThan: "1",
      nxnLoaiMucDichSuDung: "1",
      nxnLoaiCuTru: "1",
      nxnThoiGianCuTruTai: "Giao Thanh",
      nxnTinhTrangHonNhan: "Chưa kết hôn lần nào",
      nxnNoiCuTru: "Xóm , Giao Thanh",
      nxnSoGiayToTuyThan: "162",
      nxnMucDichSuDung: "",
      nycQuanHe: "",
      nycHoTen: "",
      nxnHoTen: "",
      nxnNgaySinh: "",
      nxnThoiGianCuTruTu: "",
    };
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 mb-6 md:grid-cols-2">
        {headers.map((header) => (
          <div key={header}>
            <label
              htmlFor={header}
              className="block text-sm mb-2 font-medium text-gray-900 "
            >
              {header}
            </label>
            <input
              type="text"
              id={header}
              name={header}
              value={formData[header]}
              onChange={handleChange}
              required={false}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  "
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button
          type="submit"
          className={clsx(
            "w-full flex justify-center py-2 px-4 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-blue-500"
          )}
        >
          Add Data
        </button>
        <button
          type="button"
          onClick={resetForm}
          className={clsx(
            "w-full flex justify-center py-2 px-4 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-blue-500"
          )}
        >
          Reset form
        </button>
      </div>
    </form>
  );
}
