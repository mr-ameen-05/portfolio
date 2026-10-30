import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LearnerProvider } from './context/LearnerContext';
import { CourseAccessGuard } from './components/layout/CourseAccessGuard';
import { TeamingLandingPage } from './pages/TeamingLandingPage';
import { ModuleOverviewPage } from './pages/ModuleOverviewPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { CourseResourcesPage } from './pages/CourseResourcesPage';
import { CourseGlossaryPage } from './pages/CourseGlossaryPage';
import { LearnerProgressPage } from './pages/LearnerProgressPage';
import { CapstonePage } from './pages/CapstonePage';

export default function App() {
  return (
    <LearnerProvider>
      <BrowserRouter>
        <Routes>
          {/* Direct Subdomain Root Routes (e.g. https://learn.aiameen.online/) */}
          <Route element={<CourseAccessGuard />}>
            <Route index element={<TeamingLandingPage />} />
            <Route path="modules/:moduleId" element={<ModuleOverviewPage />} />
            <Route path="lessons/:slug" element={<LessonPlayerPage />} />
            <Route path="resources" element={<CourseResourcesPage />} />
            <Route path="glossary" element={<CourseGlossaryPage />} />
            <Route path="progress" element={<LearnerProgressPage />} />
            <Route path="capstone" element={<CapstonePage />} />
          </Route>

          {/* Backward compatibility with legacy path /courses/teaming */}
          <Route path="/courses/teaming" element={<CourseAccessGuard />}>
            <Route index element={<TeamingLandingPage />} />
            <Route path="modules/:moduleId" element={<ModuleOverviewPage />} />
            <Route path="lessons/:slug" element={<LessonPlayerPage />} />
            <Route path="resources" element={<CourseResourcesPage />} />
            <Route path="glossary" element={<CourseGlossaryPage />} />
            <Route path="progress" element={<LearnerProgressPage />} />
            <Route path="capstone" element={<CapstonePage />} />
          </Route>

          <Route path="/courses" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LearnerProvider>
  );
}
