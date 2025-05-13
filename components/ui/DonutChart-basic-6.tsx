"use client";

import React, { useEffect, useRef } from "react";

interface DonutChartProps {
  currentProfit: number;
  totalProfit: number;
  activeColor?: string;
  inactiveColor?: string;
  strokeWidth?: number;
  rounded?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  currentProfit,
  totalProfit,
  activeColor = "var(--color-primary)",
  inactiveColor = "rgba(255, 255, 255, 0.1)",
  strokeWidth = 20,
  rounded = true,
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
      
      // Calculate center and radius
      const center = size / 2;
      const radius = center - strokeWidth / 2;
      
      // Calculate the progress percentage
      const percentage = totalProfit > 0 ? (currentProfit / totalProfit) * 100 : 0;
      
      // Calculate the circumference
      const circumference = 2 * Math.PI * radius;
      
      // Calculate the progress arc length
      const progressArc = (circumference * percentage) / 100;
      const remainingArc = circumference - progressArc;
      
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
          // Rotate to start at 6 o'clock (bottom)
          circle.setAttribute("transform", `rotate(90, ${center}, ${center})`);
        });
        
        // Progress circle specific attributes
        progressCircle.setAttribute("stroke-dasharray", `${progressArc} ${circumference}`);
        progressCircle.setAttribute("stroke-dashoffset", "0");
        
        // Remaining circle specific attributes
        remainingCircle.setAttribute("stroke-dasharray", `${remainingArc} ${circumference}`);
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
  }, [currentProfit, totalProfit, strokeWidth, rounded]);
  
  // Calculate percentage for display
  const percentage = totalProfit > 0 ? Math.round((currentProfit / totalProfit) * 100) : 0;
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
      >
        <circle
          className="remaining-circle"
          fill="none"
          stroke={inactiveColor}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeWidth={strokeWidth}
          style={{ transition: "all 0.5s ease" }}
        />
        <circle
          className="progress-circle"
          fill="none"
          stroke={activeColor}
          strokeLinecap={rounded ? "round" : "butt"}
          strokeWidth={strokeWidth}
          style={{ transition: "all 0.5s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{percentage}%</span>
        <span className="text-sm text-gray-400">Profit</span>
      </div>
    </div>
  );
}; 