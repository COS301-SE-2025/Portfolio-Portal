import { userName } from './index'; // Correct relative import from same directory

const OfficeNavbar = () => {
  return (
    <nav className="backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 bg-gray-900/70">
      <div className="max-w-6xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-gray-300">
            {userName}
          </span>
        </a>
        
        <div className="hidden w-full md:block md:w-auto">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            <li>
              <a href="#about" className="block py-2 px-3 text-gray-300 hover:text-blue-400 transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#experience" className="block py-2 px-3 text-gray-300 hover:text-blue-400 transition-colors">
                Experience
              </a>
            </li>
            <li>
              <a href="#contact" className="block py-2 px-3 text-gray-300 hover:text-blue-400 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default OfficeNavbar;