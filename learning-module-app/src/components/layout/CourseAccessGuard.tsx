import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLearner } from '../../context/LearnerContext';
import { CourseGate } from './CourseGate';

/**
 * Blocks every course route until the visitor has enrolled with
 * a name + email. Must be rendered inside a <LearnerProvider>.
 */
export const CourseAccessGuard: React.FC = () => {
  const { isEnrolled } = useLearner();

  if (!isEnrolled) {
    return <CourseGate />;
  }

  return <Outlet />;
};
