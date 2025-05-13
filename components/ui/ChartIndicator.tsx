"use client";

import React, { useEffect, useRef } from "react";

interface ChartIndicatorProps {
  currentProfit: number;
  totalProfit: number;
  activeColor?: string;
  inactiveColor?: string;
  strokeWidth?: number;
  maxAngle?: number;
  rotation?: number;
  radiusOffset?: number;
  className?: string;
  style?: React.CSSProperties;
  glowOpacity?: number; // New prop for controlling shadow opacity
}

export const ChartIndicator: React.FC<ChartIndicatorProps> = ({
  currentProfit,
  totalProfit,
  activeColor = "var(--color-primary)",
  inactiveColor = "rgba(255, 255, 255, 0.1)",
  strokeWidth = 5,
  maxAngle = 270, // Maximum angle in degrees (270 = 3/4 of a circle)
  rotation = 44.5,  // Rotation in degrees (positive = clockwise)
  radiusOffset = 5, // Make the base radius smaller than the main chart
  className = "",
  style = {},
  glowOpacity = 1, // Default glow opacity is 1 (100%)
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const filterId = useRef(`outer-glow-${Math.random().toString(36).substr(2, 9)}`);
  
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
      
      // Calculate center and radius - MODIFIED to be smaller
      const center = size / 2;
      const radius = center - strokeWidth / 2 + radiusOffset; // Apply the radius offset
      
      // Calculate the progress percentage
      const percentage = totalProfit > 0 ? (currentProfit / totalProfit) * 100 : 0;
      
      // Calculate the angle in radians for the end of the progress arc
      const progressAngleRad = ((percentage * maxAngle) / 100 + 90 + rotation) * (Math.PI / 180);
      
      // Calculate the circumference of the full circle
      const fullCircumference = 2 * Math.PI * radius;
      
      // Calculate the maximum arc length based on maxAngle
      const maxArcLength = (fullCircumference * maxAngle) / 360;
      
      // Update the outer indicator circles
      const outerProgressCircle = svg.querySelector(".outer-progress-circle") as SVGCircleElement;
      const outerRemainingCircle = svg.querySelector(".outer-remaining-circle") as SVGCircleElement;
      const percentageIndicator = svg.querySelector(".percentage-indicator") as SVGTextElement;
      
      // Define the spacing between the main chart and the outer chart
      const spacing = 5;
      const outerRadius = radius + spacing;
      const outerStrokeWidth = 5; // Thickness for the dot indicator
      
      // Set up the outer indicator circles
      if (outerProgressCircle && outerRemainingCircle) {
        // Calculate the circumference of the outer circle
        const outerCircumference = 2 * Math.PI * outerRadius;
        
        // Calculate the maximum arc length for the outer circle
        const outerMaxArcLength = (outerCircumference * maxAngle) / 360;
        
        // Define the small arc segment size (in percentage of the total progress)
        const arcSegmentSize = 0.01; // Small segment to make it dot-like
        
        // Calculate the progress percentage for the start of the small arc
        // If percentage is 0, keep it at 0, otherwise subtract the segment size
        const startPercentage = percentage > 0 ? Math.max(0, percentage - arcSegmentSize) : 0;
        
        // Calculate the start position of the small arc
        const startArc = (outerMaxArcLength * startPercentage) / 100;
        
        // Calculate the length of the small arc
        const arcLength = percentage > 0 ? (outerMaxArcLength * arcSegmentSize) / 100 : 0;
        
        // Calculate the remaining arc length (everything except our small segment)
        const outerRemainingArc = outerMaxArcLength - arcLength;
        
        // Common attributes for both outer circles
        [outerProgressCircle, outerRemainingCircle].forEach(circle => {
          circle.setAttribute("cx", `${center}`);
          circle.setAttribute("cy", `${center}`);
          circle.setAttribute("r", `${outerRadius}`);
          circle.setAttribute("stroke-width", `${outerStrokeWidth}`);
          circle.setAttribute("stroke-linecap", "round"); // Always round for the dot effect
          // Rotate to start at 6 o'clock (bottom) plus the additional rotation
          circle.setAttribute("transform", `rotate(${90 + rotation}, ${center}, ${center})`);
        });
        
        // Outer progress circle specific attributes (small arc segment)
        outerProgressCircle.setAttribute("stroke-dasharray", `${arcLength} ${outerCircumference}`);
        outerProgressCircle.setAttribute("stroke-dashoffset", `-${startArc}`);
        outerProgressCircle.setAttribute("filter", `url(#${filterId.current})`);
        
        // Outer remaining circle specific attributes (invisible)
        outerRemainingCircle.setAttribute("stroke-dasharray", `${outerRemainingArc} ${outerCircumference}`);
        outerRemainingCircle.setAttribute("stroke-dashoffset", `-${startArc + arcLength}`);
        outerRemainingCircle.setAttribute("stroke", "rgba(0,0,0,0)"); // Make it invisible
      }
      
      // Update the percentage indicator, space between the dot and the number
      if (percentageIndicator) {
        // Calculate the position of the text indicator (on a larger circle)
        const textRadius = outerRadius + 20;
        const indicatorX = center + textRadius * Math.cos(progressAngleRad);
        const indicatorY = center + textRadius * Math.sin(progressAngleRad);
        
        // Update the position of the percentage indicator
        percentageIndicator.setAttribute("x", `${indicatorX}`);
        percentageIndicator.setAttribute("y", `${indicatorY}`);
        percentageIndicator.textContent = `${Math.round(percentage)}%`;
        
        // Make the indicator visible only when there's progress
        percentageIndicator.style.opacity = percentage > 0 ? "1" : "0";
      }
      
      // Get the computed color (resolves CSS variables)
      const computedActiveColor = getComputedColor(activeColor);
      
      // Update the glow filter by recreating it
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
        const blur1 = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        blur1.setAttribute("stdDeviation", "2");
        blur1.setAttribute("result", "blur1");
        
        const blur2 = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
        blur2.setAttribute("stdDeviation", "4");
        blur2.setAttribute("result", "blur2");
        
        // Extract RGB values
        const rgb = extractRGB(computedActiveColor);
        
        // Create color matrix elements with adjusted opacity based on glowOpacity prop
        const matrix1 = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
        matrix1.setAttribute("in", "blur1");
        matrix1.setAttribute("type", "matrix");
        matrix1.setAttribute("result", "glow1");
        matrix1.setAttribute(
          "values",
          `0 0 0 0 ${rgb.r}   0 0 0 0 ${rgb.g}   0 0 0 0 ${rgb.b}   0 0 0 ${1 * glowOpacity} 0`
        );
        
        const matrix2 = document.createElementNS("http://www.w3.org/2000/svg", "feColorMatrix");
        matrix2.setAttribute("in", "blur2");
        matrix2.setAttribute("type", "matrix");
        matrix2.setAttribute("result", "glow2");
        matrix2.setAttribute(
          "values",
          `0 0 0 0 ${rgb.r}   0 0 0 0 ${rgb.g}   0 0 0 0 ${rgb.b}   0 0 0 ${0.8 * glowOpacity} 0`
        );
        
        // Create merge element
        const merge = document.createElementNS("http://www.w3.org/2000/svg", "feMerge");
        
        // Add merge nodes
        const mergeNode1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
        mergeNode1.setAttribute("in", "glow2");
        
        const mergeNode2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
        mergeNode2.setAttribute("in", "glow1");
        
        const mergeNode3 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
        mergeNode3.setAttribute("in", "SourceGraphic");
        
        // Append all elements to the filter
        merge.appendChild(mergeNode1);
        merge.appendChild(mergeNode2);
        merge.appendChild(mergeNode3);
        
        newFilter.appendChild(blur1);
        newFilter.appendChild(blur2);
        newFilter.appendChild(matrix1);
        newFilter.appendChild(matrix2);
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
  }, [currentProfit, totalProfit, strokeWidth, maxAngle, rotation, radiusOffset, activeColor, inactiveColor, glowOpacity]);
  
  // Combine default classes with any custom classes
  const containerClasses = `absolute inset-0 w-full h-full pointer-events-none ${className}`;
  
  return (
    <div ref={containerRef} className={containerClasses} style={style}>
      {/* SVG container that will adapt to parent size while maintaining aspect ratio */}
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define the glow filter for the dot indicator */}
        <defs>
          {/* Filter will be created dynamically in the useEffect */}
          <filter id={filterId.current} x="-100%" y="-100%" width="300%" height="300%">
            {/* Initial placeholder structure that will be replaced */}
            <feGaussianBlur stdDeviation="2" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feColorMatrix in="blur1" type="matrix" result="glow1" />
            <feColorMatrix in="blur2" type="matrix" result="glow2" />
            <feMerge>
              <feMergeNode in="glow2" />
              <feMergeNode in="glow1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer circle (inactive portion - invisible) */}
        <circle
          className="outer-remaining-circle"
          fill="none"
          stroke="rgba(0,0,0,0)"
          strokeLinecap="round"
          strokeWidth="5"
          style={{ transition: "all 0.5s ease" }}
        />
        {/* Outer circle (active portion - small segment) with neon glow */}
        <circle
          className="outer-progress-circle"
          fill="none"
          stroke={activeColor}
          strokeLinecap="round"
          strokeWidth="5"
          style={{ transition: "all 0.5s ease" }}
        />
        
        {/* Percentage indicator that follows the end of the progress arc */}
        <text
          className="percentage-indicator"
          fill="white"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ transition: "all 0.3s ease", filter: "drop-shadow(0 0 3px rgba(0,0,0,0.5))" }}
        >
          {totalProfit > 0 ? Math.round((currentProfit / totalProfit) * 100) : 0}%
        </text>
      </svg>
    </div>
  );
}; 