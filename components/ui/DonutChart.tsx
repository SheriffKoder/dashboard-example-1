"use client";

import React, { useEffect, useRef } from "react";

// notes
/*

This component is scalable so we can use it as layers on top of each other.
with neon colors adjusted to the active color. that changes with the theme.

<div className="relative w-[400px] h-[400px]">
  <DonutChart 
    currentProfit={1500} 
    totalProfit={3000} 
    scale={1} 
    activeColor="rgba(0, 100, 255, 0.8)"
    className="absolute inset-0"
    style={{ zIndex: 1 }}
  />
  
  <DonutChart 
    currentProfit={2000} 
    totalProfit={3000} 
    scale={0.8} 
    activeColor="rgba(0, 150, 255, 0.8)"
    className="absolute inset-0"
    style={{ zIndex: 2 }}
  />
  
  <DonutChart 
    currentProfit={2500} 
    totalProfit={3000} 
    scale={0.6} 
    activeColor="rgba(0, 200, 255, 0.8)"
    className="absolute inset-0"
    style={{ zIndex: 3 }}
  />
</div>

*/


interface DonutChartProps {
  currentProfit: number;
  totalProfit: number;
  activeColor?: string;
  inactiveColor?: string;
  strokeWidth?: number;
  rounded?: boolean;
  maxAngle?: number;
  rotation?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
  showText?: boolean;
  glowOpacity?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  currentProfit,
  totalProfit,
  activeColor = "var(--color-primary)",
  inactiveColor = "rgba(255, 255, 255, 0.1)",
  strokeWidth = 3,
  rounded = true,
  maxAngle = 270, // Maximum angle in degrees (270 = 3/4 of a circle)
  rotation = 44.5,  // Rotation in degrees (positive = clockwise)
  scale = 1, // Default scale is 1 (100%)
  className = "",
  style = {},
  showText,
  glowOpacity = 1,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const filterId = useRef(`neon-glow-${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Function to extract RGB components from a color string
  const extractRGB = (color: string) => {
    // For hex colors
    if (color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16) / 255;
      const g = parseInt(color.slice(3, 5), 16) / 255;
      const b = parseInt(color.slice(5, 7), 16) / 255;
      return { r, g, b };
    }
    // For rgb/rgba colors
    else if (color.startsWith('rgb')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
      if (match) {
        const r = parseInt(match[1], 10) / 255;
        const g = parseInt(match[2], 10) / 255;
        const b = parseInt(match[3], 10) / 255;
        return { r, g, b };
      }
    }
    // Default to blue if color format is not recognized
    return { r: 0.2, g: 0.6, b: 1.0 };
  };
  
  // Function to get computed color value (resolves CSS variables)
  const getComputedColor = (colorValue: string) => {
    if (!containerRef.current) return colorValue;
    
    // If it's a CSS variable
    if (colorValue.startsWith('var(')) {
      // Create a temporary element
      const tempElement = document.createElement('div');
      tempElement.style.color = colorValue;
      document.body.appendChild(tempElement);
      
      // Get the computed color
      const computedColor = window.getComputedStyle(tempElement).color;
      
      // Clean up
      document.body.removeChild(tempElement);
      
      return computedColor;
    }
    
    return colorValue;
  };
  
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    
    const updateChart = () => {
      const svg = svgRef.current;
      if (!svg) return;
      
      // Get the parent container dimensions
      const container = svg.parentElement;
      if (!container) return;
      
      // Make sure we have a square aspect ratio based on the smaller dimension
      const size = Math.min(container.clientWidth, container.clientHeight);
      
      // Update viewBox to match the size
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      
      // Calculate center and radius
      const center = size / 2;
      
      // Instead of scaling the entire SVG, we'll adjust the radius directly
      // This keeps the stroke width consistent across different sized charts
      const baseRadius = center - strokeWidth / 2;
      const radius = baseRadius * scale;
      
      // Calculate the progress percentage
      const percentage = totalProfit > 0 ? (currentProfit / totalProfit) * 100 : 0;
      
      // Calculate the circumference of the full circle
      const fullCircumference = 2 * Math.PI * radius;
      
      // Calculate the maximum arc length based on maxAngle
      const maxArcLength = (fullCircumference * maxAngle) / 360;
      
      // Calculate the progress arc length (scaled to maxAngle)
      const progressArc = (maxArcLength * percentage) / 100;
      
      // Calculate the remaining arc length within the maxAngle
      const remainingArc = maxArcLength - progressArc;
      
      // Update the progress circle
      const progressCircle = svg.querySelector(".progress-circle") as SVGCircleElement;
      const remainingCircle = svg.querySelector(".remaining-circle") as SVGCircleElement;
      
      if (progressCircle && remainingCircle) {
        // Common attributes for both circles
        [progressCircle, remainingCircle].forEach(circle => {
          circle.setAttribute("cx", `${center}`);
          circle.setAttribute("cy", `${center}`);
          circle.setAttribute("r", `${radius}`);
          circle.setAttribute("stroke-width", `${strokeWidth}`);
          circle.setAttribute("stroke-linecap", rounded ? "round" : "butt");
          // Rotate to start at 6 o'clock (bottom) plus the additional rotation
          circle.setAttribute("transform", `rotate(${90 + rotation}, ${center}, ${center})`);
        });
        
        // Progress circle specific attributes
        progressCircle.setAttribute("stroke-dasharray", `${progressArc} ${fullCircumference}`);
        progressCircle.setAttribute("stroke-dashoffset", "0");
        progressCircle.setAttribute("filter", `url(#${filterId.current})`);
        
        // Remaining circle specific attributes
        remainingCircle.setAttribute("stroke-dasharray", `${remainingArc} ${fullCircumference}`);
        remainingCircle.setAttribute("stroke-dashoffset", `-${progressArc}`);
      }
      
      // Get the computed color (resolves CSS variables)
      const computedActiveColor = getComputedColor(activeColor);
      
      // Update the glow filter color matrices
      const rgb = extractRGB(computedActiveColor);
      
      // Force recreate the filter to ensure color matrices update properly
      const filterDefs = svg.querySelector("defs");
      if (filterDefs) {
        // Create a new filter element
        const newFilter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
        newFilter.setAttribute("id", filterId.current);
        newFilter.setAttribute("x", "-100%");
        newFilter.setAttribute("y", "-100%");
        newFilter.setAttribute("width", "300%");
        newFilter.setAttribute("height", "300%");
        
        // Create blur elements
        const blurLevels = [2, 4, 8, 12];
        const blurElements = blurLevels.map((level, index) => {
          const blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
          blur.setAttribute("stdDeviation", level.toString());
          blur.setAttribute("result", `blur${index + 1}`);
          return blur;
        });
        
        // Create color matrix elements with adjusted opacity based on glowOpacity prop
        const baseOpacityLevels = [1, 0.9, 0.7, 0.5];
        const opacityLevels = baseOpacityLevels.map(level => level * glowOpacity);
        
        const colorMatrices = blurLevels.map((_, index) => {
          const matrix = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
          matrix.setAttribute("in", `blur${index + 1}`);
          matrix.setAttribute("type", "matrix");
          matrix.setAttribute("result", `glow${index + 1}`);
          matrix.setAttribute(
            "values",
            `0 0 0 0 ${rgb.r}   0 0 0 0 ${rgb.g}   0 0 0 0 ${rgb.b}   0 0 0 ${opacityLevels[index]} 0`
          );
          return matrix;
        });
        
        // Create merge element
        const merge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
        
        // Add merge nodes
        const mergeNodes = [
          ...blurLevels.map((_, index) => {
            const node = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
            node.setAttribute("in", `glow${blurLevels.length - index}`);
            return node;
          }),
          (() => {
            const node = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
            node.setAttribute("in", "SourceGraphic");
            return node;
          })()
        ];
        
        // Append all elements to the filter
        blurElements.forEach(blur => newFilter.appendChild(blur));
        colorMatrices.forEach(matrix => newFilter.appendChild(matrix));
        mergeNodes.forEach(node => merge.appendChild(node));
        newFilter.appendChild(merge);
        
        // Replace the old filter with the new one
        const oldFilter = svg.querySelector(`filter#${filterId.current}`);
        if (oldFilter) {
          filterDefs.replaceChild(newFilter, oldFilter);
        } else {
          filterDefs.appendChild(newFilter);
        }
      }
    };
    
    // Initial update
    updateChart();
    
    // Add resize listener
    const resizeObserver = new ResizeObserver(updateChart);
    resizeObserver.observe(svgRef.current);
    
    // Add a MutationObserver to detect theme changes
    const mutationObserver = new MutationObserver(updateChart);
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    return () => {
      if (svgRef.current) {
        resizeObserver.unobserve(svgRef.current);
      }
      mutationObserver.disconnect();
    };
  }, [currentProfit, totalProfit, strokeWidth, rounded, maxAngle, rotation, scale, activeColor, inactiveColor, glowOpacity]);
  
  // Combine default classes with any custom classes
  const containerClasses = `w-full h-full flex items-center justify-center flex-col overflow-visible ${className}`;
  
  // Determine whether to show text based on the showText prop or scale
  const shouldShowText = showText !== undefined ? showText : scale === 1;
  
  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      {/* SVG container that will adapt to parent size while maintaining aspect ratio */}
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define the neon glow filter with dynamic color */}
        <defs>
          <filter id={filterId.current} x="-100%" y="-100%" width="300%" height="300%">
            {/* Create multiple blur layers for a more intense glow */}
            <feGaussianBlur stdDeviation="2" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feGaussianBlur stdDeviation="8" result="blur3" />
            <feGaussianBlur stdDeviation="12" result="blur4" />
            
            {/* Apply color matrix to create glow color for each blur layer */}
            <feColorMatrix
              className="glow-color-matrix"
              in="blur1"
              type="matrix"
              values="0 0 0 0 0.2   0 0 0 0 0.6   0 0 0 0 1   0 0 0 1 0"
              result="glow1"
            />
            <feColorMatrix
              className="glow-color-matrix"
              in="blur2"
              type="matrix"
              values="0 0 0 0 0.2   0 0 0 0 0.6   0 0 0 0 1   0 0 0 0.9 0"
              result="glow2"
            />
            <feColorMatrix
              className="glow-color-matrix"
              in="blur3"
              type="matrix"
              values="0 0 0 0 0.2   0 0 0 0 0.6   0 0 0 0 1   0 0 0 0.7 0"
              result="glow3"
            />
            <feColorMatrix
              className="glow-color-matrix"
              in="blur4"
              type="matrix"
              values="0 0 0 0 0.2   0 0 0 0 0.6   0 0 0 0 1   0 0 0 0.5 0"
              result="glow4"
            />
            
            {/* Merge all the glow layers with the original shape */}
            <feMerge>
              <feMergeNode in="glow4" />
              <feMergeNode in="glow3" />
              <feMergeNode in="glow2" />
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle (inactive portion) */}
        <circle
          className="remaining-circle"
          fill="none"
          stroke={inactiveColor}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeWidth={strokeWidth}
          style={{ transition: "all 0.5s ease" }}
        />
        {/* Foreground circle (active portion) with neon glow */}
        <circle
          className="progress-circle"
          fill="none"
          stroke={activeColor}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeWidth={strokeWidth}
          style={{ transition: "all 0.5s ease" }}
        />
      </svg>
      
      {/* Center content - Show based on shouldShowText */}
      {shouldShowText && (
        <>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">${currentProfit.toLocaleString()}</span>
            <span className="text-sm text-gray-400">Your balance</span>
          </div>
          <div style={{
            paddingLeft: `calc(10%*${scale}*2.8)`,
            paddingRight: `calc(10%*${scale}*2.8)`,
          }} className="absolute bottom-[7%] w-full flex justify-between text-xs text-[rgb(255,255,255)] opacity-50">
            <span>0%</span>
            <span>100%</span>
          </div>
        </>
      )}
    </div>
  );
}; 