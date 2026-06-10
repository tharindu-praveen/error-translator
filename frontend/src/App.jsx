import { useState } from "react";
import ErrorInput from "./components/ErrorInput";
import ResultCard from "./components/ResultCard";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const [errorText, setErrorText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const handleTranslate = async () => {
    if (!errorText.trim()) return;
    setLoading(true);
    setResult(null);
    setErr(null);
    try {
      const response = await fetch("http://localhost:3001/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: errorText }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setResult(data);
    } catch (e) {
      setErr("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setErrorText("");
    setResult(null);
    setErr(null);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🔴</span>
          <div>
            <h1 className="text-lg font-semibold">Error Translator</h1>
            <p className="text-xs text-gray-400">Paste any error. Get plain English back.</p>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
        <ErrorInput
          value={errorText}
          onChange={setErrorText}
          onTranslate={handleTranslate}
          onClear={handleClear}
          loading={loading}
        />
        {loading && <LoadingSpinner />}
        {err && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
            {err}
          </div>
        )}
        {result && <ResultCard result={result} />}
      </div>
    </div>
  );
}

export default App;