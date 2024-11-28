import ExcelUploader from "@/components/ExcelUploader";

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-white">
      <div className="w-full mx-auto">
        <ExcelUploader />
      </div>
    </main>
  );
}
