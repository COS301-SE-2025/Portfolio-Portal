import { userName, jobTitle }from "./index"
const Hero = () => {
  return (
    <section className="relative w-full h-screen mx-auto flex items-center">
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            {userName}
          </h1>
          <p className="text-2xl font-light text-gray-300 mb-8">
            {jobTitle}
          </p>
          <p className="text-lg text-gray-400 mb-8">
            Creating digital experiences that are out of this world
          </p>
        </div>
      </div>
      
      {/* Background space elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
    </section>
  )
}

export default Hero