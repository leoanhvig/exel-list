/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { useState } from "react";

interface DataFormProps {
  onSubmit: (data: any) => void;
}

export default function DataForm({ onSubmit }: DataFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ name: "", email: "", department: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={clsx(
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          )}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={clsx(
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          )}
        />
      </div>

      <div>
        <label
          htmlFor="department"
          className="block text-sm font-medium text-gray-700"
        >
          Department
        </label>
        <input
          type="text"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          className={clsx(
            "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
            "focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          )}
        />
      </div>

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
    </form>
  );
}
