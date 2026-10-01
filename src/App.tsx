import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import HeroSection from './components/hero/HeroSection'
import ProjectsSection from './components/projects/ProjectsSection'
import JournalSection from './components/journal/JournalSection'
import JourneySection from './components/journey/JourneySection'
import CommunitySection from './components/community/CommunitySection'
import AboutSection from './components/about/AboutSection'
import ContactSection from './components/contact/ContactSection'
import GlobalSprite from './components/sprite/GlobalSprite'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        {/* The interactive companion */}
        <GlobalSprite />
        
        <main className="min-h-screen">
          <HeroSection />
          <ProjectsSection />
          <JournalSection />
          <JourneySection />
          <CommunitySection />
          <AboutSection />
          <ContactSection />
        </main>
      </Layout>
    </ThemeProvider>
  )
}

export default App
