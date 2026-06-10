function HistoryPanel({ history, onSelect, onClear, onClose }) {
  const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (days  > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (mins  > 0) return `${mins}m ago`;
    return "just now";
  };

  const severityColor = {
    warning: "text-yellow-400",
    error:   "text-orange-400",
    fatal:   "text-red-400",
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-sm font-medium">Recent errors</span>
        <div className="flex items-center gap-4">
          <button onClick={onClear} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
            Clear all
          </button>
          <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ✕ Close
          </button>
        </div>
      </div>
      <div className="flex flex-col divide-y divide-gray-800">
        {history.map((entry) => (
          <button
            key={entry.id}
            onClick={() => onSelect(entry)}
            className="flex items-start justify-between gap-4 px-4 py-3 hover:bg-gray-800/50 transition-colors text-left w-full"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 truncate font-mono">{entry.error}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${severityColor[entry.result?.severity] || "text-gray-400"}`}>
                  {entry.result?.severity}
                </span>
                <span className="text-xs text-gray-600">·</span>
                <span className="text-xs text-gray-600">{entry.result?.language}</span>
              </div>
            </div>
            <span className="text-xs text-gray-600 flex-shrink-0 pt-0.5">
              {timeAgo(entry.timestamp)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryPanel;