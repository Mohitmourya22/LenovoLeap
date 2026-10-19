import { useRef, useState } from "react";
import { UploadCloudIcon, LoaderIcon, FileTextIcon, XIcon } from "lucide-react";

// Resume intake card. Calls onUpload({ file, name }) which should return a promise;
// the form resets once that promise resolves.
function ResumeUploadCard({ onUpload, isUploading }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [dragging, setDragging] = useState(false);

  const pickFile = (selected) => {
    if (selected) setFile(selected);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    pickFile(event.dataTransfer.files?.[0]);
  };

  const handleSubmit = async () => {
    if (!file || isUploading) return;
    try {
      await onUpload({ file, name: name.trim() });
      setFile(null);
      setName("");
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      // error toast is handled by the mutation hook
    }
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-indigo-700">Screen a resume</div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition ${
          dragging ? "border-indigo-400 bg-indigo-50" : "border-slate-300 bg-slate-50 hover:border-indigo-300"
        }`}
      >
        {file ? (
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <FileTextIcon className="size-5" />
            </div>
            <div className="text-left">
              <div className="max-w-[220px] truncate text-sm font-semibold text-slate-900">{file.name}</div>
              <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(0)} KB</div>
            </div>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="rounded-lg p-1 text-slate-400 hover:text-rose-500"
            >
              <XIcon className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
              <UploadCloudIcon className="size-6" />
            </div>
            <div className="text-sm font-semibold text-slate-700">Drop a resume here or click to browse</div>
            <div className="mt-1 text-xs text-slate-400">PDF, DOCX, or TXT · up to 5MB</div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="hidden"
          onChange={(event) => pickFile(event.target.files?.[0])}
        />
      </div>

      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Candidate name (optional — auto-detected)"
        className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400"
      />

      <button
        onClick={handleSubmit}
        disabled={!file || isUploading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? <LoaderIcon className="size-5 animate-spin" /> : <UploadCloudIcon className="size-5" />}
        {isUploading ? "Screening…" : "Upload & Screen"}
      </button>
    </div>
  );
}

export default ResumeUploadCard;
