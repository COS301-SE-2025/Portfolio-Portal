import Navbar from "../components/Templates/forest/Navbar";
import Hero from "../components/Templates/forest/Hero";
import About from "../components/Templates/forest/About";
import Experience from "../components/Templates/forest/Experience";
import Contact from "../components/Templates/forest/Contact";

const Forest = () => {
  return (
    <div className="relative z-0 bg-white text-gray-800">
      <div className='bg-[url("/paper-bg.png")] bg-cover bg-no-repeat bg-center'>
        <Navbar />
        <Hero />
        <About />
        <Experience />
        <Contact />
      </div>
    </div>
  );
};

export default Forest;
