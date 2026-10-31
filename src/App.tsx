import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import HeroSection from './components/hero/HeroSection';
import { SITE } from './config/site.config';
import { SmoothScrollProvider } from './components/scroll/SmoothScrollContext';
import SectionTransitionWrapper from './components/scroll/SectionTransitionWrapper';
import LaserInterlockDivider from './components/scroll/LaserInterlockDivider';

// Lazy-load below-the-fold components to reduce initial JS bundle and boost mobile LCP
const ProjectsSection = React.lazy(() => import('./components/projects/ProjectsSection'));
const ServicesSection = React.lazy(() => import('./components/services/ServicesSection'));
const TechStackSection = React.lazy(() => import('./components/stack/TechStackSection'));
const JourneySection = React.lazy(() => import('./components/journey/JourneySection'));
const FAQSection = React.lazy(() => import('./components/faq/FAQSection'));
const ContactSection = React.lazy(() => import('./components/contact/ContactSection'));
const FinalCTASection = React.lazy(() => import('./components/cta/FinalCTASection'));
const GlobalSprite = React.lazy(() => import('./components/sprite/GlobalSprite'));
const ScrollTelemetryHUD = React.lazy(() => import('./components/scroll/ScrollTelemetryHUD'));

function SubdomainRedirect() {
  React.useEffect(() => {
    window.location.href = SITE.coursesUrl;
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
      <h1 className="font-mono text-base font-bold mb-2">Redirecting to Cybersecurity Learning Platform...</h1>
      <p className="font-mono text-xs text-text-secondary max-w-md">
        The interactive 11-module course is hosted on its dedicated subdomain at{' '}
        <a href={SITE.coursesUrl} className="text-accent underline font-semibold">
          {SITE.coursesUrl}
        </a>
      </p>
    </div>
  );
}

function PortfolioHome() {
  return (
    <SmoothScrollProvider>
      <Layout>
        <React.Suspense fallback={null}>
          <GlobalSprite />
          <ScrollTelemetryHUD />
        </React.Suspense>
        <main className="min-h-screen">
          {/* 01. Hero & System Telemetry (Eagerly Rendered for Instant LCP) */}
          <SectionTransitionWrapper enableDepth={false} id="hero">
            <HeroSection />
          </SectionTransitionWrapper>

          {/* Below-the-fold sections stream in without delaying Hero render */}
          <React.Suspense fallback={<div className="min-h-[300px]" />}>
            <LaserInterlockDivider sectionCode="SEC_02" label="SELECTED_WORK" />

            {/* 02. Selected Work */}
            <SectionTransitionWrapper id="projects">
              <ProjectsSection />
            </SectionTransitionWrapper>

            <LaserInterlockDivider sectionCode="SEC_03" label="SERVICES_ENGAGEMENT" />

            {/* 03. Engineering Services */}
            <SectionTransitionWrapper id="services">
              <ServicesSection />
            </SectionTransitionWrapper>

            <LaserInterlockDivider sectionCode="SEC_04" label="TECHNICAL_STACK" />

            {/* 04. Technical Stack */}
            <SectionTransitionWrapper id="stack">
              <TechStackSection />
            </SectionTransitionWrapper>

            <LaserInterlockDivider sectionCode="SEC_05" label="EVOLUTION" />

            {/* 05. Evolution */}
            <SectionTransitionWrapper id="journey">
              <JourneySection />
            </SectionTransitionWrapper>

            <LaserInterlockDivider sectionCode="SEC_06" label="OPERATIONAL_ENQUIRY" />

            {/* 06. Operational FAQ & Project Enquiry */}
            <SectionTransitionWrapper id="faq">
              <FAQSection />
            </SectionTransitionWrapper>

            <SectionTransitionWrapper id="contact">
              <ContactSection />
              <FinalCTASection />
            </SectionTransitionWrapper>
          </React.Suspense>
        </main>
      </Layout>
    </SmoothScrollProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Portfolio Single-Page Experience */}
          <Route path="/" element={<PortfolioHome />} />

          {/* Subdomain Redirects for legacy course routes */}
          <Route path="/courses/*" element={<SubdomainRedirect />} />
          <Route path="/course/*" element={<SubdomainRedirect />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
