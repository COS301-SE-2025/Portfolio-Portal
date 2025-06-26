import OfficeNavbar from "../components/Templates/office/Navbar";
import OfficeHero from "../components/Templates/office/Hero";
import OfficeAbout from "../components/Templates/office/About";
import OfficeExperience from "../components/Templates/office/Experience";
import OfficeContact from "../components/Templates/office/Contact";

const OfficePage = () => {
  return (
    <div className='relative z-0 bg-gray-900 text-white'>
      <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
        <OfficeNavbar />
        <OfficeHero />
        <OfficeAbout />
        <OfficeExperience />
        <OfficeContact />
      </div>
    </div>
  )
}

export default OfficePage;