const severityConfig = {
  warning: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", label: "⚠ Warning" },
  error:   { color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/20", label: "✖ Error"   },
  fatal:   { color: "text-red-400",    bg: "bg-red-400/10 border-red-400/20",       label: "💀 Fatal"   },
};

function ResultCard({ result }) {
  const severity = severityConfig[result.severity] || severityConfig.error;

  const copyToClipboard = () => {
    const text = `What happened: ${result.summary}\n\nWhy: ${result.cause}\n\nFix:\n${result.steps.map((s,i)=>`${i+1}. ${s}`).join("\n")}\n\nTip: ${result.tip}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${severity.bg} ${severity.color}`}>
            {severity.label}
          </span>
          <span className="text-xs text-gray-500 bg-gray-800 px-2.5 py-1 rounded-full">
            {result.language}
          </span>
        </div>
        <button onClick={copyToClipboard} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
          Copy ↗
        </button>
      </div>

      <div className="px-5 py-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">What happened</p>
        <p className="text-white text-base leading-relaxed">{result.summary}</p>
      </div>

      <div className="px-5 py-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Why it happened</p>
        <p className="text-gray-300 text-sm leading-relaxed">{result.cause}</p>
      </div>

      <div className="px-5 py-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-3">How to fix it</p>
        <ol className="flex flex-col gap-2">
          {result.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-300">
              <span className="text-gray-600 font-mono font-medium flex-shrink-0">{i+1}.</span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 py-4 bg-gray-800/50">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Pro tip</p>
        <p className="text-gray-400 text-sm leading-relaxed">{result.tip}</p>
      </div>
    </div>
  );
}

export default ResultCard;