const About = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-16 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          About Me
        </h2>
        
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-full">
              <div className="rounded-full overflow-hidden bg-black aspect-square">
                <img 
                  src="/api/placeholder/400/400" 
                  alt="Profile" 
                  className="w-full h-full object-cover opacity-80" 
                />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <p className="text-lg text-gray-300 mb-6">
              Hello! I'm a passionate developer specializing in creating beautiful, functional websites and applications. My journey in the digital universe has given me a unique perspective on blending design and functionality.
            </p>
            <p className="text-lg text-gray-300 mb-6">
              With a keen eye for detail and a commitment to excellence, I approach each project as an opportunity to create something exceptional. When I'm not coding, you can find me stargazing, exploring sci-fi worlds, or learning about new technologies.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300">React</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300">JavaScript</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300">TailwindCSS</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300">Node.js</span>
              <span className="px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300">UI/UX Design</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
    </section>
  )
}

export default About