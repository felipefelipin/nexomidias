import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSection from '../components/home/HeroSection'
import WhyChoose from '../components/home/WhyChoose'
import WhyLicense from '../components/home/WhyLicense'
import UgcSection from '../components/home/UgcSection'
import FaqSection from '../components/home/FaqSection'

function Home() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#faq') {
      const el = document.getElementById('faq')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  return (
    <>
      <HeroSection />
      <WhyChoose />
      <WhyLicense />
      <UgcSection />
      <div id="faq">
        <FaqSection />
      </div>
    </>
  )
}

export default Home
