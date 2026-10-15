import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import HeroSection from './components/hero/HeroSection';
import ProjectsSection from './components/projects/ProjectsSection';
import JournalSection from './components/journal/JournalSection';
import JourneySection from './components/journey/JourneySection';
import CommunitySection from './components/community/CommunitySection';
import PracticePlatformsSection from './components/platforms/PracticePlatformsSection';
import AboutSection from './components/about/AboutSection';
import ContactSection from './components/contact/ContactSection';

// Practical Cybersecurity Course Section
import { LearnerProvider } from './courses/teaming/context/LearnerContext';
import { CourseAccessGuard } from './courses/teaming/components/layout/CourseAccessGuard';
import { TeamingLandingPage } from './courses/teaming/pages/TeamingLandingPage';
import { ModuleOverviewPage } from './courses/teaming/pages/ModuleOverviewPage';
import { LessonPlayerPage } from './courses/teaming/pages/LessonPlayerPage';
import { CourseResourcesPage } from './courses/teaming/pages/CourseResourcesPage';
import { CourseGlossaryPage } from './courses/teaming/pages/CourseGlossaryPage';
import { LearnerProgressPage } from './courses/teaming/pages/LearnerProgressPage';
import { CapstonePage } from './courses/teaming/pages/CapstonePage';

function PortfolioHome() {
  return (
    <Layout>
      <main className="min-h-screen">
        <HeroSection />
        <ProjectsSection />
        <JournalSection />
        <JourneySection />
        <CommunitySection />
        <PracticePlatformsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </Layout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Portfolio Single-Page Experience */}
          <Route path="/" element={<PortfolioHome />} />

          {/* Practical Cybersecurity Course Section Routes */}
          <Route
            path="/courses/teaming"
            element={
              <LearnerProvider>
                <CourseAccessGuard />
              </LearnerProvider>
            }
          >
            <Route index element={<TeamingLandingPage />} />
            <Route path="modules/:moduleId" element={<ModuleOverviewPage />} />
            <Route path="lessons/:slug" element={<LessonPlayerPage />} />
            <Route path="resources" element={<CourseResourcesPage />} />
            <Route path="glossary" element={<CourseGlossaryPage />} />
            <Route path="progress" element={<LearnerProgressPage />} />
            <Route path="capstone" element={<CapstonePage />} />
          </Route>

          {/* Convenience Redirects */}
          <Route path="/courses" element={<Navigate to="/courses/teaming" replace />} />
          <Route path="/courses/teaming/modules" element={<Navigate to="/courses/teaming" replace />} />
          <Route path="/courses/teaming/lessons" element={<Navigate to="/courses/teaming" replace />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
