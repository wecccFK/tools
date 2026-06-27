import { useState, useEffect, useCallback } from 'react';
import { TOOLS } from '../constants';
import type { Tool } from '../types';

const STORAGE_KEY = 'momo-starred';

function readStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter(id => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export function useStarredTools() {
  const [starredIds, setStarredIds] = useState<string[]>([]);

  useEffect(() => {
    setStarredIds(readStoredIds());
  }, []);

  const toggleStar = useCallback((id: string) => {
    setStarredIds(prev => {
      const next = prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id];
      writeStoredIds(next);
      return next;
    });
  }, []);

  const isStarred = useCallback((id: string) => starredIds.includes(id), [starredIds]);

  const starredTools: Tool[] = starredIds
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is Tool => Boolean(t));

  return { starredIds, starredTools, isStarred, toggleStar };
}
