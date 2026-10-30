import { ModuleData, Lesson } from '../types/course.types';
import { MODULE_0 } from './modules/module0';
import { MODULE_1 } from './modules/module1';
import { MODULE_2 } from './modules/module2';
import { MODULE_3 } from './modules/module3';
import { MODULE_4 } from './modules/module4';
import { MODULE_5 } from './modules/module5';
import { MODULE_6 } from './modules/module6';
import { MODULE_7 } from './modules/module7';
import { MODULE_8 } from './modules/module8';
import { MODULE_9 } from './modules/module9';
import { MODULE_10 } from './modules/module10';

export const ALL_MODULES: ModuleData[] = [
  MODULE_0,
  MODULE_1,
  MODULE_2,
  MODULE_3,
  MODULE_4,
  MODULE_5,
  MODULE_6,
  MODULE_7,
  MODULE_8,
  MODULE_9,
  MODULE_10,
];

export function getAllModules(): ModuleData[] {
  return ALL_MODULES;
}

export function getModuleBySlug(slug: string): ModuleData | undefined {
  return ALL_MODULES.find(m => m.slug === slug || m.id === slug);
}

export function getAllLessons(): Lesson[] {
  return ALL_MODULES.flatMap(m => m.lessons);
}

export function getLessonBySlug(lessonSlug: string): { lesson: Lesson; module: ModuleData } | undefined {
  for (const mod of ALL_MODULES) {
    const lesson = mod.lessons.find(l => l.slug === lessonSlug || l.id === lessonSlug);
    if (lesson) {
      return { lesson, module: mod };
    }
  }
  return undefined;
}

export function getAdjacentLessons(lessonId: string): { prev?: Lesson; next?: Lesson; currentModule: ModuleData } | undefined {
  const all = getAllLessons();
  const currentIndex = all.findIndex(l => l.id === lessonId || l.slug === lessonId);
  if (currentIndex === -1) return undefined;

  const currentLesson = all[currentIndex];
  const currentModule = ALL_MODULES.find(m => m.id === currentLesson.moduleId)!;
  const prev = currentIndex > 0 ? all[currentIndex - 1] : undefined;
  const next = currentIndex < all.length - 1 ? all[currentIndex + 1] : undefined;

  return { prev, next, currentModule };
}

export function searchCourseContent(query: string): Array<{
  type: 'lesson' | 'module' | 'term';
  title: string;
  snippet: string;
  link: string;
  badge: string;
}> {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: Array<{
    type: 'lesson' | 'module' | 'term';
    title: string;
    snippet: string;
    link: string;
    badge: string;
  }> = [];

  for (const mod of ALL_MODULES) {
    if (mod.title.toLowerCase().includes(q) || mod.summary.toLowerCase().includes(q)) {
      results.push({
        type: 'module',
        title: mod.title,
        snippet: mod.summary,
        link: `/courses/teaming/modules/${mod.slug}`,
        badge: `Track: ${mod.track.toUpperCase()}`
      });
    }

    for (const lesson of mod.lessons) {
      const matchTitle = lesson.title.toLowerCase().includes(q);
      const matchWhy = lesson.whyThisMatters.toLowerCase().includes(q);
      const matchedTerm = lesson.keyTerms.find(k => k.term.toLowerCase().includes(q) || k.definition.toLowerCase().includes(q));

      if (matchTitle || matchWhy || matchedTerm) {
        results.push({
          type: 'lesson',
          title: lesson.title,
          snippet: matchedTerm ? `Key Term: ${matchedTerm.term} — ${matchedTerm.definition}` : lesson.whyThisMatters,
          link: `/courses/teaming/lessons/${lesson.slug}`,
          badge: `${mod.title.split('—')[0].trim()} · ${lesson.estimatedMinutes.total} min`
        });
      }
    }
  }

  return results.slice(0, 15);
}
