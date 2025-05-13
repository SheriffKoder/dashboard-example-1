"use client";

import React, { useEffect, useRef } from "react";

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
}

export const DonutChart: React.FC<DonutChartProps> = ({
  currentProfit,
  totalProfit,
  activeColor = "var(--color-primary)",
  inactiveColor = "rgba(255, 255, 255, 0.1)",
  strokeWidth = 5,
  rounded = true,
  maxAngle = 270, // Maximum angle in degrees (270 = 3/4 of a circle)
  rotation = 44.5,  // Rotation in degrees (positive = clockwise)
  scale = 1,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
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
      
      // Get the content group for scaling
      const contentGroup = svg.querySelector(".chart-content") as SVGGElement;
      if (contentGroup) {
        // Apply scaling transformation
        // The translate part ensures the scaled content remains centered
        contentGroup.setAttribute(
          "transform", 
          `scale(${scale}) translate(${size * (1 - scale) / (2 * scale)}, ${size * (1 - scale) / (2 * scale)})`
        );
      }
      
      // Calculate center and radius
      const center = size / 2;
      const radius = center - strokeWidth / 2;
      
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
        progressCircle.setAttribute("filter", "url(#neon-glow)");
        
        // Remaining circle specific attributes
        remainingCircle.setAttribute("stroke-dasharray", `${remainingArc} ${fullCircumference}`);
        remainingCircle.setAttribute("stroke-dashoffset", `-${progressArc}`);
      }
    };
    
    // Initial update
    updateChart();
    
    // Add resize listener
    const resizeObserver = new ResizeObserver(updateChart);
    resizeObserver.observe(svgRef.current);
    
    return () => {
      if (svgRef.current) {
        resizeObserver.unobserve(svgRef.current);
      }
    };
  }, [currentProfit, totalProfit, strokeWidth, rounded, maxAngle, rotation, scale]);
  
  return (
    <div className="relative w-fit h-full flex items-center justify-center flex-col overflow-visible" style={{ margin: '40px' }}>
      {/* SVG container that will adapt to parent size while maintaining aspect ratio */}
      <svg
        ref={svgRef}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Define the neon glow filter */}
        <defs>
          <filter id="neon-glow" x="-100%" y="-100%" width="300%" height="300%">
            {/* Create multiple blur layers for a more intense glow */}
            <feGaussianBlur stdDeviation="2" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feGaussianBlur stdDeviation="8" result="blur3" />
            <feGaussianBlur stdDeviation="12" result="blur4" />
            
            {/* Apply color matrix to create glow color for each blur layer */}
            <feColorMatrix
              in="blur1"
              type="matrix"
              values="0 0 0 0 0.2   0 0 0 0 0.6   0 0 0 0 1   0 0 0 1 0"
              result="glow1"
            />
            <feColorMatrix
              in="blur2"
              type="matrix"
              values="0 0 0 0 0.2   0 0 0 0 0.6   0 0 0 0 1   0 0 0 0.9 0"
              result="glow2"
            />
            <feColorMatrix
              in="blur3"
              type="matrix"
              values="0 0 0 0 0.2   0 0 0 0 0.6   0 0 0 0 1   0 0 0 0.7 0"
              result="glow3"
            />
            <feColorMatrix
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
        
        {/* Group all content for scaling */}
        <g className="chart-content">
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
        </g>
      </svg>
      
      {/* Center content */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">${currentProfit.toLocaleString()}</span>
        <span className="text-sm text-gray-400">Your balance</span>
      </div>
      <div className="absolute bottom-[5%] w-full flex justify-between px-[10%] text-xs text-[rgb(255,255,255)] opacity-50">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  );
}; 