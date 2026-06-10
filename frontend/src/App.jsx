import { useState, useEffect } from "react";
import ErrorInput from "./components/ErrorInput";
import ResultCard from "./components/ResultCard";
import LoadingSpinner from "./components/LoadingSpinner";
import HistoryPanel from "./components/HistoryPanel";

function App() {
  const [errorText, setErrorText] = useState("");
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const [err, setErr]             = useState(null);
  const [history, setHistory]     = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history + handle shared links on first load
  useEffect(() => {
    const saved = localStorage.getItem("error-translator-history");
    if (saved) setHistory(JSON.parse(saved));

    const params = new URLSearchParams(window.location.search);
    const shared = params.get("result");
    if (shared) {
      try {
        const decoded = JSON.parse(atob(shared));
        setResult(decoded.result);
        setErrorText(decoded.error);
      } catch (e) { /* invalid link, ignore */ }
    }
  }, []);

  const saveToHistory = (text, data) => {
    const entry = {
      id: Date.now(),
      error: text.slice(0, 100) + (text.length > 100 ? "..." : ""),
      fullError: text,
      result: data,
      timestamp: new Date().toISOString(),
    };
    const updated = [entry, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem("error-translator-history", JSON.stringify(updated));
  };

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
      saveToHistory(errorText, data);
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
    window.history.replaceState({}, "", window.location.pathname);
  };

  const handleHistorySelect = (entry) => {
    setErrorText(entry.fullError);
    setResult(entry.result);
    setErr(null);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("error-translator-history");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔴</span>
            <div>
              <h1 className="text-lg font-semibold">Error Translator</h1>
              <p className="text-xs text-gray-400">Paste any error. Get plain English back.</p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🕐</span>
              <span>History ({history.length})</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 flex flex-col gap-6">
        {showHistory && (
          <HistoryPanel
            history={history}
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
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
        {result && <ResultCard result={result} errorText={errorText} />}
      </div>
    </div>
  );
}

export default App;