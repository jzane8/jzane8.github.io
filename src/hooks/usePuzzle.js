import { useState, useCallback, useMemo, useRef, useEffect } from 'react';

const STORAGE_KEY = 'wheelPuzzleSession';
const BASE_COOLDOWN = 30000; // 30 seconds
const MAX_COOLDOWN = 300000; // 5 minutes
const RESET_AFTER = 86400000; // 24 hours

/**
 * Manages the puzzle session: tracking failures, cooldowns, difficulty,
 * and the Konami-style cheat code (Arrow: Up Down Left Right).
 */

function loadSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function defaultSession() {
  return {
    failureCount: 0,
    lastFailureTime: null,
    totalAttempts: 0,
    lastSuccessTime: null,
    currentCooldown: 0,
    puzzleHistory: [],
  };
}

export function usePuzzle() {
  const [session, setSession] = useState(() => {
    const saved = loadSession();
    if (saved) {
      // Auto-reset after 24 hours of no failures
      if (saved.lastFailureTime && Date.now() - saved.lastFailureTime > RESET_AFTER) {
        return defaultSession();
      }
      return saved;
    }
    return defaultSession();
  });

  // Persist session changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session]);

  const calculateCooldown = useCallback((failureCount) => {
    return Math.min(BASE_COOLDOWN * Math.pow(2, failureCount - 1), MAX_COOLDOWN);
  }, []);

  const isInCooldown = useCallback(() => {
    if (!session.lastFailureTime || session.currentCooldown === 0) return false;
    return Date.now() - session.lastFailureTime < session.currentCooldown;
  }, [session]);

  const getRemainingCooldown = useCallback(() => {
    if (!session.lastFailureTime || session.currentCooldown === 0) return 0;
    const elapsed = Date.now() - session.lastFailureTime;
    return Math.max(0, session.currentCooldown - elapsed);
  }, [session]);

  const recordAttempt = useCallback((puzzleType, success) => {
    setSession((prev) => {
      const next = {
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        puzzleHistory: [
          ...prev.puzzleHistory,
          { type: puzzleType, success, timestamp: Date.now() },
        ],
      };

      // Cap history at 50 entries
      if (next.puzzleHistory.length > 50) {
        next.puzzleHistory = next.puzzleHistory.slice(-50);
      }

      if (success) {
        next.lastSuccessTime = Date.now();
        next.failureCount = Math.max(0, prev.failureCount - 1);
      } else {
        const newFailureCount = prev.failureCount + 1;
        next.failureCount = newFailureCount;
        next.lastFailureTime = Date.now();
        next.currentCooldown = Math.min(
          BASE_COOLDOWN * Math.pow(2, newFailureCount - 1),
          MAX_COOLDOWN
        );
      }

      return next;
    });
  }, []);

  const resetSession = useCallback(() => {
    setSession(defaultSession());
  }, []);

  const clearCooldown = useCallback(() => {
    setSession((prev) => ({
      ...prev,
      currentCooldown: 0,
      lastFailureTime: null,
      failureCount: 0,
    }));
  }, []);

  const getAvailablePuzzles = useCallback(() => {
    const all = ['sequence', 'math', 'memory', 'cipher', 'logic'];
    const fc = session.failureCount;
    if (fc === 0) return all;
    if (fc <= 2) return all.filter((p) => p !== 'sequence');
    if (fc <= 4) return ['memory', 'cipher', 'logic'];
    return ['cipher', 'logic'];
  }, [session.failureCount]);

  const getDifficultyLevel = useCallback(() => {
    const fc = session.failureCount;
    if (fc === 0) return 'normal';
    if (fc <= 2) return 'increased';
    if (fc <= 4) return 'hard';
    return 'extreme';
  }, [session.failureCount]);

  // Konami cheat code listener
  const cheatBuffer = useRef([]);
  const CHEAT_SEQ = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  useEffect(() => {
    function onKeyDown(e) {
      cheatBuffer.current.push(e.key);
      if (cheatBuffer.current.length > 4) cheatBuffer.current.shift();
      if (
        cheatBuffer.current.length === 4 &&
        JSON.stringify(cheatBuffer.current) === JSON.stringify(CHEAT_SEQ)
      ) {
        clearCooldown();
        cheatBuffer.current = [];
        // Dispatch custom event so UI can react
        window.dispatchEvent(new CustomEvent('cheat-activated'));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [clearCooldown]);

  return useMemo(() => ({
    session,
    isInCooldown,
    getRemainingCooldown,
    recordAttempt,
    resetSession,
    clearCooldown,
    getAvailablePuzzles,
    getDifficultyLevel,
  }), [session, isInCooldown, getRemainingCooldown, recordAttempt, resetSession, clearCooldown, getAvailablePuzzles, getDifficultyLevel]);
}
