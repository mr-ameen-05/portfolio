import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/layout/Layout'
import HeroSection from './components/hero/HeroSection'
import ProjectsSection from './components/projects/ProjectsSection'
import JournalSection from './components/journal/JournalSection'
import JourneySection from './components/journey/JourneySection'
import CommunitySection from './components/community/CommunitySection'
import AboutSection from './components/about/AboutSection'
import StartLearning from './pages/StartLearning'
import CyberRoadmap from './components/CyberRoadmap'
import ContactSection from './components/contact/ContactSection'
import TerminalBox from './components/TerminalBox'

function App() {
  return (
    <ThemeProvider>
      <Layout>
        {/* The interactive companion */}
        
        <main className="min-h-screen">
          <HeroSection />
          <ProjectsSection />
          <JournalSection />
          <JourneySection />
          <CommunitySection />
          <AboutSection />
          <StartLearning />
          <CyberRoadmap />
          <ContactSection />
        </main>
      </Layout>
    </ThemeProvider>
  )
}

export default App
