/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useState } from "react";

interface DynamicFormProps {
  headers: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: Record<string, any>) => void;
  handleCancel: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DynamicFormUpdate({
  headers,
  template,
  onSubmit,
  handleCancel,
}: DynamicFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({
    ...template,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          name="update-data"
          type="submit"
          className={clsx(
            "w-full flex justify-center py-2 px-4 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-blue-500"
          )}
        >
          Update Data
        </button>
        <button
          type="button"
          onClick={() => handleCancel()}
          className={clsx(
            "w-full flex justify-center py-2 px-4 border border-transparent",
            "rounded-md shadow-sm text-sm font-medium text-white",
            "bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2",
            "focus:ring-offset-2 focus:ring-blue-500"
          )}
          name="cancel-update-data"
        >
          Cancel Update
        </button>
      </div>
    </form>
  );
}
