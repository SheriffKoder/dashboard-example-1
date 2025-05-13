"use client";

import React from 'react'
import { useEffect, useState, createContext, useContext } from 'react';
import Lenis from 'lenis';

// Wrap the components with this provider to inititate smooth scrolling functionality using Lenis library


/**
 * Context for managing Lenis smooth scrolling functionality
 * @type {React.Context}
 */
// create context
const SmoothScrollerContext = createContext<Lenis | null>(null);

/**
 * Hook to access the Lenis smooth scroll instance
 * @returns {Lenis|null} The Lenis scroll instance
 */
// create hook to access the context
export const useSmoothScroller = () => useContext(SmoothScrollerContext)


/**
 * Provider component that initializes and manages Lenis smooth scrolling
 * Allows server components to be nested within it as children
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} Provider component with smooth scrolling context
 */
export default function ScrollContext_Lenis({children}: { children: React.ReactNode }) {
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);
  const [rafState, setRafState] = useState<number | null>(null);

  useEffect(() => {
    const scroller = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      scroller.raf(time);
      requestAnimationFrame(raf);
    }

    const rf = requestAnimationFrame(raf);
    setRafState(rf);
    setLenisRef(scroller);

    // Cleanup using the scroller instance from this closure
    return () => {
      cancelAnimationFrame(rf);
      scroller.destroy();
    }
  }, []); // Empty dependency array is fine here as we only want to initialize once

  return (
    <SmoothScrollerContext.Provider value={lenisRef}>
      {children}
    </SmoothScrollerContext.Provider>
  )
}

