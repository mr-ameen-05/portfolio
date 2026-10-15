import React from 'react';
import { Outlet } from 'react-router-dom';
import { CourseContentProvider } from '../../../../platform/course/CourseContentContext';

/**
 * Course shell: loads the API bundle (or falls back to local content),
 * hydrates progress, and then renders child routes.
 * Access control is handled per-page based on the entitlement tier.
 */
export const CourseAccessGuard: React.FC = () => {
  return (
    <CourseContentProvider>
      <Outlet />
    </CourseContentProvider>
  );
};