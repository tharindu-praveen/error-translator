function LoadingSpinner() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-2 border-gray-700 border-t-white rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-sm text-gray-300 font-medium">Translating your error...</p>
        <p className="text-xs text-gray-600 mt-1">Claude is reading the stack trace</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;