const PDFViewer = ({ file }) => {
  if (!file) return null
  
  return (
<div className="mt-6 w-full">
    <p className="text-green-600 mb-2 text-center">File uploaded successfully: {file.name}</p>
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <iframe
        src={URL.createObjectURL(file)}
        className="w-full h-96"
        title="CV Preview"
      />
    </div>
  </div>
  )
}

export default PDFViewer