import { useEffect } from 'react';

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check for modifier keys
      const isCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;
      const isAlt = event.altKey;

      // Find matching shortcut
      const shortcut = shortcuts.find(s => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = (s.ctrl || s.cmd) ? isCtrl : !isCtrl && !event.metaKey;
        const shiftMatch = s.shift ? isShift : !isShift;
        const altMatch = s.alt ? isAlt : !isAlt;

        return keyMatch && ctrlMatch && shiftMatch && altMatch;
      });

      if (shortcut && !event.target.matches('input, textarea, select')) {
        event.preventDefault();
        shortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export default useKeyboardShortcuts;

