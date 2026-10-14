import { LearnerProfile } from '../types/course.types';
import { progressService } from './progressService';

const PROFILE_KEY = 'portfolio_teaming_learner_profile_v1';
// Kept in sync for the certificate generator on the progress page (legacy key).
const LEGACY_NAME_KEY = 'course_learner_name';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface EnrollResult {
  profile: LearnerProfile;
  /** true when the record reached the backend; false when saved device-locally. */
  serverConfirmed: boolean;
  /** Optional human-readable note (e.g. offline fallback). */
  message?: string;
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Please enter your name.';
  if (trimmed.length < 2) return 'Name must be at least 2 characters.';
  if (trimmed.length > 80) return 'Name is too long (80 characters max).';
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Please enter your email address.';
  if (!EMAIL_PATTERN.test(trimmed)) return 'Please enter a valid email address.';
  if (trimmed.length > 160) return 'Email is too long.';
  return null;
}

export class EnrollmentService {
  private static instance: EnrollmentService;

  static getInstance(): EnrollmentService {
    if (!EnrollmentService.instance) {
      EnrollmentService.instance = new EnrollmentService();
    }
    return EnrollmentService.instance;
  }

  /** Synchronous read so the route guard never flashes the gate for enrolled learners. */
  getProfile(): LearnerProfile | null {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Partial<LearnerProfile>;
      if (!parsed || !parsed.name || !parsed.email) return null;
      return {
        name: parsed.name,
        email: parsed.email,
        enrolledAt: parsed.enrolledAt || Date.now(),
        source: parsed.source === 'server' ? 'server' : 'local'
      };
    } catch {
      return null;
    }
  }

  isEnrolled(): boolean {
    return this.getProfile() !== null;
  }

  private persist(profile: LearnerProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      // Mirror the display name for the certificate generator.
      localStorage.setItem(LEGACY_NAME_KEY, profile.name);
    } catch (e) {
      console.warn('Failed to persist learner profile to localStorage', e);
    }
  }

  async enroll(rawName: string, rawEmail: string): Promise<EnrollResult> {
    const name = rawName.trim();
    const email = rawEmail.trim();

    const nameError = validateName(name);
    if (nameError) throw new Error(nameError);
    const emailError = validateEmail(email);
    if (emailError) throw new Error(emailError);

    const progress = progressService.getProgress();
    const learnerId = progress.learnerId;

    // 1. Attempt to capture the enrollment on the backend.
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch('/api/course-enroll.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          learner_id: learnerId,
          enrolled_at: Date.now()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data && data.success) {
          const profile: LearnerProfile = {
            name,
            email,
            enrolledAt: Date.now(),
            source: 'server'
          };
          this.persist(profile);
          return { profile, serverConfirmed: true };
        }
      }
    } catch {
      // Server unreachable — fall through to the device-local record.
    }

    // 2. Device-local fallback so the learner is never blocked by the network.
    const profile: LearnerProfile = {
      name,
      email,
      enrolledAt: Date.now(),
      source: 'local'
    };
    this.persist(profile);
    return {
      profile,
      serverConfirmed: false,
      message: 'Saved on this device. We could not reach the enrollment server, so your details will sync on your next visit.'
    };
  }

  /** Removes the enrollment so the gate can be shown again (switch learner). */
  clearProfile(): void {
    try {
      localStorage.removeItem(PROFILE_KEY);
      localStorage.removeItem(LEGACY_NAME_KEY);
    } catch {
      // ignore
    }
  }
}

export const enrollmentService = EnrollmentService.getInstance();
