const ActionButtons = ({ setFile, setPreview }) => {
  const handleSubmit = () => {
    alert('CV uploaded successfully! This is where you would process the file.');
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="mt-4 flex gap-3 w-full">
      <button
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        onClick={handleSubmit}
      >
        Submit CV
      </button>
      <button
        className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        onClick={handleRemove}
      >
        Remove
      </button>
    </div>
  );
};

export default ActionButtons;