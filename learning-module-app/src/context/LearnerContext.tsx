import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { LearnerProfile } from '../types/course.types';
import { enrollmentService, EnrollResult } from '../services/enrollmentService';

interface LearnerContextValue {
  profile: LearnerProfile | null;
  isEnrolled: boolean;
  /** True when the record reached the backend (false = device-local fallback). */
  isServerConfirmed: boolean;
  enroll: (name: string, email: string) => Promise<EnrollResult>;
  signOut: () => void;
}

const LearnerContext = createContext<LearnerContextValue | undefined>(undefined);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  // Synchronous hydration from localStorage — no gate flash for returning learners.
  const [profile, setProfile] = useState<LearnerProfile | null>(() => enrollmentService.getProfile());

  const enroll = useCallback(async (name: string, email: string) => {
    const result = await enrollmentService.enroll(name, email);
    setProfile(result.profile);
    return result;
  }, []);

  const signOut = useCallback(() => {
    enrollmentService.clearProfile();
    setProfile(null);
  }, []);

  const value = useMemo<LearnerContextValue>(
    () => ({
      profile,
      isEnrolled: profile !== null,
      isServerConfirmed: profile?.source === 'server',
      enroll,
      signOut
    }),
    [profile, enroll, signOut]
  );

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner(): LearnerContextValue {
  const context = useContext(LearnerContext);
  if (context === undefined) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
}
