//src/pages/Office.jsx
import Navbar from "../components/Templates/office/Navbar";
import Hero from "../components/Templates/office/Hero";
import About from "../components/Templates/office/About";
import Experience from "../components/Templates/office/Experience";
import Contact from "../components/Templates/office/Contact";

const Office = () => {
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

export default Office;
