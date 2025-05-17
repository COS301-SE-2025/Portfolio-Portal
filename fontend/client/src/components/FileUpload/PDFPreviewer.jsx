import ActionButtons from './ActionButtons';

const PDFPreviewer = ({ preview, setFile, setPreview }) => {
  return (
    <div className="mt-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Preview</h2>
      <div className="w-full h-80 border border-gray-200 rounded">
        <iframe
          src={preview}
          className="w-full h-full rounded"
          title="PDF Preview"
        ></iframe>
      </div>
      <ActionButtons setFile={setFile} setPreview={setPreview} />
    </div>
  );
};

export default PDFPreviewer;