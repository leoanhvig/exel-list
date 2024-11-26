import ExcelUploader from "@/components/ExcelUploader";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="w-full mx-auto">
        <h1 className="text-3xl font-bold mb-8">Excel File Manager</h1>
        <ExcelUploader />
      </div>
    </main>
  );
}
