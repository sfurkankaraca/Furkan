"use client";

export default function CSVDownloadButton({ csv, filename = "export.csv" }: { csv: string; filename?: string }) {
  function download() {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  return (
    <button type="button" onClick={download} className="rounded-xl bg-white text-black px-3 py-1.5 text-sm hover:bg-white/90">
      CSV indir
    </button>
  );
}
