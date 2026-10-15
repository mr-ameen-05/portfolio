import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, ShieldCheck } from 'lucide-react';
import { CourseNav } from '../components/layout/CourseNav';
import { CourseBreadcrumb } from '../components/layout/CourseBreadcrumb';
import { COURSE_RESOURCES } from '../data/resourcesData';
import { useAuth } from '../../../platform/auth/AuthContext';
import { useCourseContent } from '../../../platform/course/CourseContentContext';
import { CourseLockNotice } from '../components/layout/CourseLockNotice';

export const CapstonePage: React.FC = () => {
  const { user, entitlements } = useAuth();
  const { usingLocalContent } = useCourseContent();

  // Require enrolled tier for capstone
  const isEnrolled = entitlements?.tier === 'enrolled';
  if (!isEnrolled && !usingLocalContent) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <CourseNav />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <CourseBreadcrumb
            items={[
              { label: 'Module 10 Capstone Scenario' },
            ]}
          />
          <CourseLockNotice
            requiredTier="enrolled"
            title="Full Enrollment Required: Capstone"
            message="The capstone project requires full course enrollment to access the assessment rubric and submission workflow."
          />
        </main>
      </div>
    );
  }

  // Rubric self-evaluation criteria
  const rubricSections = [
    {
      id: 'partA',
      title: 'Part A: Scoping, ROE, and STRIDE Threat Model',
      maxPoints: 20,
      criteria: [
        'Explicit written authorization and defined boundary parameters (IP ranges, domain scopes)',
        'Comprehensive emergency halt contacts, communication channels, and testing windows',
        'Multi-tier architectural data flow diagram with trust boundaries identified',
        'Systematic STRIDE mapping across dispatch portal, tracker API, and cold-chain broker',
      ],
    },
    {
      id: 'partB',
      title: 'Part B: Finding Identification & Exploit Documentation',
      maxPoints: 20,
      criteria: [
        'High-severity finding documented with calibrated CVSS v3.1 score and vector string',
        'Reproducible proof-of-concept steps executed exclusively against synthetic test fixture',
        'Root-cause technical analysis clearly explaining the underlying design or code defect',
        'Realistic enterprise business impact assessment (patient data exposure, supply disruption)',
      ],
    },
    {
      id: 'partC',
      title: 'Part C: SOC Detection & Telemetry Analysis',
      maxPoints: 20,
      criteria: [
        'Normalized log evidence collected from relevant telemetry source (auditd, web, Zeek)',
        'Accurate correlation with MITRE ATT&CK technique and tactic IDs',
        'Actionable detection rule authored (Sigma, Splunk SPL, or Suricata signature)',
        'False-positive baseline analysis and tuning considerations documented',
      ],
    },
    {
      id: 'partD',
      title: 'Part D: Remediation Engineering & Code Fix',
      maxPoints: 20,
      criteria: [
        'Production-quality patch or architectural defense resolving the root cause',
        'Defense-in-depth controls implemented (input validation, rate limiting, principle of least privilege)',
        'Implementation instructions clear enough for software or infrastructure engineers to deploy',
        'Performance and regression considerations evaluated',
      ],
    },
    {
      id: 'partE',
      title: 'Part E: Executive Debrief & Retest Verification',
      maxPoints: 20,
      criteria: [
        'Executive summary written in business-risk terms without technical jargon overload',
        'Prioritized remediation roadmap with realistic timelines and resource requirements',
        'Retest methodology defined to verify remediation effectiveness and prevent regression',
        'Documented post-assessment sign-off procedure between offensive and defensive stakeholders',
      ],
    },
  ];

  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  const toggleCriterion = (key: string) => {
    setCheckedCriteria(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Calculate score based on checked criteria (each criterion is maxPoints / 4)
  const calculateScore = () => {
    let score = 0;
    rubricSections.forEach(section => {
      const pointsPerItem = section.maxPoints / section.criteria.length;
      section.criteria.forEach((_, idx) => {
        if (checkedCriteria[`${section.id}-${idx}`]) {
          score += pointsPerItem;
        }
      });
    });
    return Math.round(score);
  };

  const totalScore = calculateScore();
  const passingScore = 75;
  const isPassing = totalScore >= passingScore;

  const rubricResource = COURSE_RESOURCES.find(r => r.id === 'res-capstone-rubric');

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <CourseNav />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <CourseBreadcrumb
          items={[
            { label: 'Module 10 Capstone Scenario' },
          ]}
        />

        {/* Hero Banner */}
        <section className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-6 md:p-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/40 bg-purple-500/10 text-xs font-mono text-purple-400">
            <span>🎯 Module 10 Capstone Project</span>
            <span>•</span>
            <span>Enterprise Purple Team Assessment</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans text-text-primary">
            Meridian Health Logistics Capstone
          </h1>

          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl">
            You have been retained as lead Purple Team architect for Meridian Health Logistics (MHL), a regional healthcare logistics provider managing cold-chain pharmaceutical transport and biological specimen courier tracking across 14 hospital networks.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#rubric-calculator"
              className="px-5 py-2.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider bg-purple-500 text-white hover:bg-purple-600 transition-colors"
            >
              📊 Open Self-Grading Rubric
            </a>
            {rubricResource && (
              <Link
                to="/courses/teaming/resources"
                className="px-4 py-2.5 rounded-lg font-mono text-xs border border-border-subtle hover:border-purple-400 text-text-secondary hover:text-text-primary bg-bg-primary transition-colors"
              >
                📥 Download Capstone Rubric Template (.md)
              </Link>
            )}
            <Link
              to="/courses/teaming/modules/capstone-meridian-health-logistics"
              className="px-4 py-2.5 rounded-lg font-mono text-xs border border-border-subtle hover:border-purple-400 text-text-secondary hover:text-text-primary bg-bg-primary transition-colors"
            >
              📖 Review Module 10 Lessons
            </Link>
          </div>
        </section>

        {/* Target Organization Architecture Spec */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-sans text-text-primary flex items-center gap-2">
            <span>🏢</span> Meridian Health Logistics (MHL) Environment
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/30 space-y-3">
              <h3 className="text-sm font-bold font-mono text-accent uppercase">
                Scope & Architecture
              </h3>
              <ul className="space-y-2 text-xs font-mono text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent">▸</span>
                  <div>
                    <strong className="text-text-primary">Dispatch Web Portal:</strong> React/Node.js on Ubuntu Linux, reverse-proxied by NGINX (`dispatch.meridian-hl.internal`).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">▸</span>
                  <div>
                    <strong className="text-text-primary">Specimen Tracking API:</strong> Python FastAPI microservice on Docker container (`tracker.meridian-hl.internal`).
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">▸</span>
                  <div>
                    <strong className="text-text-primary">Cold-Chain Telemetry:</strong> Mosquitto MQTT broker ingesting refrigerator temperature sensors.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">▸</span>
                  <div>
                    <strong className="text-text-primary">Database Tier:</strong> PostgreSQL 15 storing patient specimen manifests and GPS breadcrumbs.
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/30 space-y-3">
              <h3 className="text-sm font-bold font-mono text-rose-400 uppercase">
                Rules of Engagement Constraints
              </h3>
              <ul className="space-y-2 text-xs font-mono text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">⚠️</span>
                  <div>
                    <strong className="text-text-primary">Live Refrigeration Units Out-of-Scope:</strong> Under no circumstances may active refrigeration units in transit be disrupted.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">⚠️</span>
                  <div>
                    <strong className="text-text-primary">Synthetic Data Only:</strong> Testing must target the staging subnet (`10.14.80.0/24`) populated with synthetic records.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400">⚠️</span>
                  <div>
                    <strong className="text-text-primary">SOC Coordination:</strong> SOC lead must be alerted before and immediately after any test payloads are dispatched.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 5 Deliverables (Parts A-E) */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold font-sans text-text-primary flex items-center gap-2">
            <span>📋</span> Required Capstone Deliverables (Parts A–E)
          </h2>

          <div className="space-y-4">
            <div className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-mono text-xs font-bold">
                  Part A (20 Pts)
                </span>
                <h3 className="text-base font-bold font-sans text-text-primary">
                  Scoping, Rules of Engagement, and Threat Model
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Draft an official scoping memo covering authorized host targets, communication protocols, emergency escalation contacts, and an architectural STRIDE threat model targeting the cold-chain telemetry broker.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-xs font-bold">
                  Part B (20 Pts)
                </span>
                <h3 className="text-base font-bold font-sans text-text-primary">
                  Finding Identification & Exploit Demonstration
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Document a Broken Object Level Authorization (BOLA) vulnerability in the specimen tracker API (`/api/v1/shipments/{'{id}'}`) using a standardized finding card format, including CVSS v3.1 score, root-cause code analysis, and non-destructive curl reproduction.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-xs font-bold">
                  Part C (20 Pts)
                </span>
                <h3 className="text-base font-bold font-sans text-text-primary">
                  SOC Detection and Telemetry Analysis
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Analyze normalized NGINX access logs and auditd telemetry capturing unauthorized horizontal ID enumeration. Author an actionable detection rule (Sigma format or SIEM query) with false-positive mitigation notes.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-xs font-bold">
                  Part D (20 Pts)
                </span>
                <h3 className="text-base font-bold font-sans text-text-primary">
                  Remediation Engineering and Code Fix
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Write a complete code remediation for the vulnerable endpoint incorporating tenant-scoped authorization checks and prepared queries. Provide deployment instructions and rate-limiting configurations.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border-subtle bg-bg-secondary/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-xs font-bold">
                  Part E (20 Pts)
                </span>
                <h3 className="text-base font-bold font-sans text-text-primary">
                  Executive Debrief and Retest Plan
                </h3>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Create a 1-page executive debrief summarizing business risk, patient privacy exposure, remediation cost-benefit, and an explicit retest verification plan with sign-off criteria.
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Self-Grading Rubric Calculator */}
        <section
          id="rubric-calculator"
          className="rounded-2xl border border-border-subtle bg-bg-secondary/40 p-6 md:p-8 space-y-6 scroll-mt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                Assessment Evaluator
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-sans text-text-primary mt-1">
                Capstone Rubric Score Calculator
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg border border-border-subtle bg-bg-primary text-right font-mono">
                <div className="text-[10px] text-text-muted uppercase">Your Score</div>
                <div className={`text-2xl font-bold ${isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {totalScore} <span className="text-text-muted text-xs font-normal">/ 100</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg border border-border-subtle bg-bg-primary/50 text-xs font-mono">
            <span>{isPassing ? '✅' : 'ℹ️'}</span>
            <span className={isPassing ? 'text-emerald-400 font-semibold' : 'text-text-secondary'}>
              {isPassing
                ? `Passing Threshold Met (${totalScore} >= ${passingScore} pts). Your capstone meets professional verification standards!`
                : `Passing Threshold: ${passingScore} pts. Check off the requirements you have satisfied to compute your readiness.`}
            </span>
          </div>

          {/* Rubric Criteria Sections */}
          <div className="space-y-6">
            {rubricSections.map(section => (
              <div
                key={section.id}
                className="p-5 rounded-xl border border-border-subtle bg-bg-primary/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold font-mono text-text-primary">
                    {section.title}
                  </h3>
                  <span className="text-xs font-mono text-purple-400 font-semibold">
                    {section.maxPoints} Points Max
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  {section.criteria.map((crit, cIdx) => {
                    const key = `${section.id}-${cIdx}`;
                    const isChecked = Boolean(checkedCriteria[key]);

                    return (
                      <label
                        key={key}
                        className={`flex items-start gap-3 p-2.5 rounded border cursor-pointer transition-colors text-xs ${
                          isChecked
                            ? 'bg-purple-500/10 border-purple-500/40 text-text-primary'
                            : 'bg-bg-primary border-border-subtle/60 text-text-secondary hover:border-border-subtle'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCriterion(key)}
                          className="mt-0.5 rounded border-border-subtle text-purple-500 focus:ring-0 focus:ring-offset-0 bg-bg-primary cursor-pointer"
                        />
                        <span className="leading-relaxed flex-1">{crit}</span>
                        <span className="font-mono text-[10px] text-text-muted flex-shrink-0">
                          +{section.maxPoints / section.criteria.length} pts
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Submission and Action Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border-subtle">
            <p className="text-xs font-mono text-text-muted">
              Tip: Prepare your written deliverable using our provided Markdown template in the Resource Library.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCheckedCriteria({})}
                className="px-3 py-1.5 rounded border border-border-subtle text-xs font-mono text-text-muted hover:text-text-primary"
              >
                Reset Scores
              </button>
              <Link
                to="/courses/teaming/progress"
                className="px-4 py-2 rounded bg-accent text-black font-mono font-bold text-xs uppercase hover:bg-accent/90"
              >
                Go to Progress Dashboard →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
