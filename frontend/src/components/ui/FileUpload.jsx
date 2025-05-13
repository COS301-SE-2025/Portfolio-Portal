import { useRef, useState } from 'react'

const FileUpload = ({ onFileSelect }) => {
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        onFileSelect(selectedFile)
        setError(null)
      } else {
        onFileSelect(null)
        setError('Please upload a PDF file only')
      }
    }
  }

  return (
<div className="flex flex-col items-center">
  <p className="text-gray-600 mb-2 text-center">Click below to upload your CV (PDF only)</p>
  <button
    onClick={handleUploadClick}
    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
  >
    Upload CV
  </button>
  <input
    type="file"
    ref={fileInputRef}
    onChange={handleFileChange}
    accept=".pdf"
    className="hidden"
  />
  {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
</div>
  )
}

export default FileUpload