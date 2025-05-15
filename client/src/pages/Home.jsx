import { useState } from 'react'

const Home = () => {
  const [file, setFile] = useState(null)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
  }

  return (
<div className="flex items-center justify-center min-h-screen bg-gray-50">
  <div className="max-w-3xl w-full p-8">
    <h1 className="text-3xl font-bold text-center mb-2">Portfolio Website Generator</h1>
    <p className="text-gray-600 text-center mb-8">Upload your CV to generate a personalized portfolio website</p>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload CV</h2>
      <div className="space-y-6">
        <FileUpload onFileSelect={handleFileSelect} />
        <PDFViewer file={file} />
      </div>
    </div>
  </div>
</div>
  )
}

export default Home