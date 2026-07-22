import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

export default function FloatingThemeToggle() {
  const { theme, toggleTheme } = useAppContext();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPlaced, setIsPlaced] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const elementStart = useRef({ x: 0, y: 0 });
  const hasMoved = useRef(false);
  const buttonRef = useRef(null);

  // Load position from localStorage on mount with strict NaN checks
  useEffect(() => {
    const savedX = localStorage.getItem('theme-toggle-x');
    const savedY = localStorage.getItem('theme-toggle-y');
    if (savedX !== null && savedY !== null) {
      const parsedX = parseInt(savedX);
      const parsedY = parseInt(savedY);
      if (!isNaN(parsedX) && !isNaN(parsedY)) {
        const x = Math.max(10, Math.min(parsedX, window.innerWidth - 70));
        const y = Math.max(10, Math.min(parsedY, window.innerHeight - 70));
        setPosition({ x, y });
        setIsPlaced(true);
      }
    }
  }, []);

  const initDragPosition = () => {
    if (!isPlaced && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
      setIsPlaced(true);
      return { x: rect.left, y: rect.top };
    }
    return position;
  };

  const handleMouseDown = (e) => {
    const currentPos = initDragPosition();
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
    elementStart.current = { x: currentPos.x, y: currentPos.y };
    hasMoved.current = false;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved.current = true;
    }

    let newX = elementStart.current.x + dx;
    let newY = elementStart.current.y + dy;

    newX = Math.max(10, Math.min(newX, window.innerWidth - 70));
    newY = Math.max(10, Math.min(newY, window.innerHeight - 70));

    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    if (isDragging.current) {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      localStorage.setItem('theme-toggle-x', position.x.toString());
      localStorage.setItem('theme-toggle-y', position.y.toString());

      if (!hasMoved.current) {
        toggleTheme();
      }
    }
  };

  // Touch Support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const currentPos = initDragPosition();
    isDragging.current = true;
    dragStart.current = { x: touch.clientX, y: touch.clientY };
    elementStart.current = { x: currentPos.x, y: currentPos.y };
    hasMoved.current = false;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStart.current.x;
    const dy = touch.clientY - dragStart.current.y;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasMoved.current = true;
    }

    let newX = elementStart.current.x + dx;
    let newY = elementStart.current.y + dy;

    newX = Math.max(10, Math.min(newX, window.innerWidth - 70));
    newY = Math.max(10, Math.min(newY, window.innerHeight - 70));

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    if (isDragging.current) {
      isDragging.current = false;
      localStorage.setItem('theme-toggle-x', position.x.toString());
      localStorage.setItem('theme-toggle-y', position.y.toString());

      if (!hasMoved.current) {
        toggleTheme();
      }
    }
  };

  const buttonStyle = {
    position: 'fixed',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: theme === 'dark' 
      ? 'linear-gradient(135deg, #1e293b, #0f172a)' 
      : 'linear-gradient(135deg, #ffffff, #f1f5f9)',
    border: theme === 'dark'
      ? '2px solid rgba(249, 115, 22, 0.4)'
      : '2px solid rgba(132, 204, 22, 0.4)',
    color: theme === 'dark' ? '#f97316' : '#84cc16',
    boxShadow: theme === 'dark'
      ? '0 0 20px rgba(249, 115, 22, 0.3), 0 4px 6px -1px rgba(0,0,0,0.5)'
      : '0 0 20px rgba(132, 204, 22, 0.25), 0 4px 6px -1px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999,
    cursor: 'grab',
    userSelect: 'none',
    touchAction: 'none',
    transition: isDragging.current ? 'none' : 'box-shadow 0.2s, transform 0.2s',
  };

  if (isPlaced) {
    buttonStyle.left = `${position.x}px`;
    buttonStyle.top = `${position.y}px`;
  } else {
    buttonStyle.right = '30px';
    buttonStyle.bottom = '30px';
  }

  return (
    <button
      ref={buttonRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={buttonStyle}
      className="floating-theme-button"
      title="Drag me! Click to switch theme"
    >
      {theme === 'dark' ? (
        <HiOutlineSun size={26} style={{ pointerEvents: 'none', animation: 'spin 10s linear infinite' }} />
      ) : (
        <HiOutlineMoon size={26} style={{ pointerEvents: 'none' }} />
      )}

      <style>{`
        .floating-theme-button:hover {
          transform: scale(1.08);
        }
        .floating-theme-button:active {
          cursor: grabbing;
          transform: scale(0.98);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  );
}
