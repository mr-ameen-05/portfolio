import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import HeroSection from './components/hero/HeroSection';
import ProjectsSection from './components/projects/ProjectsSection';
import ServicesSection from './components/services/ServicesSection';
import HowIWorkSection from './components/process/HowIWorkSection';
import TrustSection from './components/trust/TrustSection';
import TechStackSection from './components/stack/TechStackSection';
import JournalSection from './components/journal/JournalSection';
import AboutSection from './components/about/AboutSection';
import JourneySection from './components/journey/JourneySection';
import CommunitySection from './components/community/CommunitySection';
import FAQSection from './components/faq/FAQSection';
import ContactSection from './components/contact/ContactSection';
import FinalCTASection from './components/cta/FinalCTASection';
import GlobalSprite from './components/sprite/GlobalSprite';
import { SITE } from './config/site.config';
import { SmoothScrollProvider } from './components/scroll/SmoothScrollContext';
import SectionTransitionWrapper from './components/scroll/SectionTransitionWrapper';
import LaserInterlockDivider from './components/scroll/LaserInterlockDivider';
import ScrollTelemetryHUD from './components/scroll/ScrollTelemetryHUD';

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
        <GlobalSprite />
        <ScrollTelemetryHUD />
        <main className="min-h-screen">
          {/* 02. Hero, 03. Professional Introduction, 04. Core Expertise */}
          <SectionTransitionWrapper enableDepth={false}>
            <HeroSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_05" label="SELECTED_PROJECTS" />

          {/* 05. Selected Projects */}
          <SectionTransitionWrapper>
            <ProjectsSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_06" label="SERVICES_OFFERING" />

          {/* 06. Services */}
          <SectionTransitionWrapper>
            <ServicesSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_07" label="ENGINEERING_PROCESS" />

          {/* 07. How I Work */}
          <SectionTransitionWrapper>
            <HowIWorkSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_08" label="TRUST_ASSURANCE" />

          {/* 08. Trust & Assurance */}
          <SectionTransitionWrapper>
            <TrustSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_09" label="TECHNICAL_STACK" />

          {/* 09. Technical Stack */}
          <SectionTransitionWrapper>
            <TechStackSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_10" label="FIELD_NOTES" />

          {/* 10. Field Notes */}
          <SectionTransitionWrapper>
            <JournalSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_11" label="ABOUT_OPERATOR" />

          {/* 11. About Me */}
          <SectionTransitionWrapper>
            <AboutSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_12" label="CAREER_TIMELINE" />

          {/* 12. Professional Journey */}
          <SectionTransitionWrapper>
            <JourneySection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_13" label="COMMUNITY_ETHOS" />

          {/* 13. Community & Knowledge Sharing */}
          <SectionTransitionWrapper>
            <CommunitySection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_14" label="OPERATIONAL_FAQ" />

          {/* 14. Frequently Asked Questions */}
          <SectionTransitionWrapper>
            <FAQSection />
          </SectionTransitionWrapper>

          <LaserInterlockDivider sectionCode="SEC_15" label="COMMUNICATION_UPLINK" />

          {/* 15. Project Enquiry */}
          <SectionTransitionWrapper>
            <ContactSection />
          </SectionTransitionWrapper>

          {/* 16. Final Call to Action */}
          <SectionTransitionWrapper>
            <FinalCTASection />
          </SectionTransitionWrapper>
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
