import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Lock, User, Shield, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../../platform/auth/AuthContext';
import { useCourseContent } from '../../../../platform/course/CourseContentContext';

interface CourseLockNoticeProps {
  /** The tier required to unlock this content */
  requiredTier: 'registered' | 'enrolled';
  /** Optional custom title */
  title?: string;
  /** Optional custom message */
  message?: string;
  /** Optional fallback link if user prefers not to sign in */
  fallbackLink?: { label: string; href: string };
}

/**
 * Displays a tier-lock notice with sign in / enroll CTAs.
 * Used by pages/lessons/modules that require a higher access tier.
 */
export const CourseLockNotice: React.FC<CourseLockNoticeProps> = ({
  requiredTier,
  title,
  message,
  fallbackLink,
}) => {
  const { user, entitlements } = useAuth();
  const { enroll } = useCourseContent();
  const location = useLocation();

  const isEnrolled = entitlements?.tier === 'enrolled';
  const isRegistered = entitlements?.tier === 'registered';

  // If already has sufficient access, this shouldn't render, but guard anyway
  const hasAccess =
    requiredTier === 'registered' ? isRegistered || isEnrolled : isEnrolled;

  const tierLabels: Record<'registered' | 'enrolled', { label: string; description: string }> = {
    registered: {
      label: 'Free Account',
      description: 'Create a free account to access introductory lessons, glossary, and sample assessments.',
    },
    enrolled: {
      label: 'Full Enrollment',
      description: 'Enroll to unlock all lessons, labs, assessments, progress tracking, and the capstone.',
    },
  };

  const { label: tierLabel, description } = tierLabels[requiredTier];

  const handleEnroll = async () => {
    if (!user) return; // Must be signed in first
    try {
      await enroll();
    } catch (e) {
      console.error('Enrollment failed', e);
    }
  };

  return (
    <div
      className="min-h-[60vh] flex items-center justify-center px-6"
      role="region"
      aria-labelledby="lock-title"
      aria-describedby="lock-desc"
    >
      <div className="w-full max-w-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-500/10 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-500" aria-hidden="true" />
        </div>

        <h2 id="lock-title" className="text-2xl font-semibold text-text-primary mb-2">
          {title ?? `${tierLabel} Required`}
        </h2>

        <p id="lock-desc" className="text-text-muted mb-6 max-w-md mx-auto">
          {message ?? description}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          {!user ? (
            <>
              <Link
                to="/register"
                state={{ from: location.pathname }}
                className="px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition font-medium flex items-center gap-2"
              >
                <User className="w-4 h-4" aria-hidden="true" />
                Create free account
              </Link>
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="px-5 py-2.5 bg-bg-tertiary border border-border-subtle text-text-primary rounded-lg hover:border-cyan-500/30 transition font-medium"
              >
                Sign in
              </Link>
            </>
          ) : isRegistered && requiredTier === 'enrolled' ? (
            <button
              onClick={handleEnroll}
              disabled={isEnrolled}
              className="px-5 py-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Shield className="w-4 h-4" aria-hidden="true" />
              {isEnrolled ? 'Enrolled' : 'Enroll for full access'}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        {fallbackLink && (
          <p className="text-sm text-text-muted">
            <a
              href={fallbackLink.href}
              className="text-cyan-400 hover:underline flex items-center justify-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {fallbackLink.label}
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-border-subtle text-sm text-text-muted">
          <p>All practice uses isolated, authorized sandboxes with synthetic data.</p>
          <p className="mt-1">No public systems are ever targeted. Learn more in our{' '}
            <a href="/#safety" className="text-cyan-400 hover:underline">
              safety statement
            </a>
            {' '}.</p>
        </div>
      </div>
    </div>
  );
};