import { useState, useEffect, useCallback } from 'react';

import { TOOLS } from '../constants';

import { Tool } from '../types';



const STORAGE_KEY = 'starred_tools';



export interface StarredToolsState {

  starredIds: string[];

  starredTools: Tool[];

  isStarred: (id: string) => boolean;

  toggleStar: (id: string) => void;

}



export function useStarredTools(): StarredToolsState {

  const [starredIds, setStarredIds] = useState<string[]>(() => {

    try {

      const saved = localStorage.getItem(STORAGE_KEY);

      return saved ? JSON.parse(saved) : [];

    } catch (e) {

      console.error("Failed to parse starred tools:", e);

      return [];

    }

  });



  // Persist to localStorage whenever starredIds changes

  useEffect(() => {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(starredIds));

  }, [starredIds]);



  const starredTools = TOOLS.filter(t => starredIds.includes(t.id));



  const isStarred = useCallback((id: string) => starredIds.includes(id), [starredIds]);



  const toggleStar = useCallback((id: string) => {

    setStarredIds(prev => 

      prev.includes(id) 

        ? prev.filter(i => i !== id)

        : [...prev, id]

    );

  }, []);



  return { starredIds, starredTools, isStarred, toggleStar };

}