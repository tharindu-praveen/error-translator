function ErrorInput({ value, onChange, onTranslate, onClear, loading }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) onTranslate();
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Paste your error
        </span>
        {value && (
          <button onClick={onClear} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            Clear
          </button>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={"TypeError: Cannot read properties of undefined (reading 'map')\n    at App.jsx:24:15\n    at renderWithHooks..."}
        className="w-full bg-transparent text-sm text-gray-200 placeholder-gray-600 p-4 resize-none outline-none font-mono min-h-[180px]"
        spellCheck={false}
      />
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800">
        <span className="text-xs text-gray-600">Ctrl + Enter to translate</span>
        <button
          onClick={onTranslate}
          disabled={!value.trim() || loading}
          className="bg-white text-gray-950 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Translating..." : "Translate →"}
        </button>
      </div>
    </div>
  );
}

export default ErrorInput;