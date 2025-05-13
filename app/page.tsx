"use client";

import { ThemeButtons } from "@/components/ui/ThemeToggler_Button";
import { DonutChart } from "@/components/ui/DonutChart";
import { Coins, Copy } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ChartIndicator } from "@/components/ui/ChartIndicator";
import Image from "next/image";
import { LineChart } from "@/components/ui/LineChart";
type data = {
  company: string;
  location: {
    name: string;
    left: number;
    top: number;
  };
  revenue: number;
  increase: number;
  totalProfit: number;
  datasets?: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      profit: number;
    }>;
  };
}

const data: data[] = [
  {
    company: "Company 1",
    location: {
      name: "Cairo, EG",
      left: 55.9,
      top: 55.1
    },
    revenue: 10000,
    increase: 10,
    totalProfit: 5000,
    datasets: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Revenue',
          data: [18, 25, 15, 35, 22],
          profit: 4500,
        },
        {
          label: 'Profit',
          data: [12, 7, 20, 25, 30],
          profit: 4000,
        },
        {
          label: 'Growth',
          data: [12, 2, 25, 30, 20],
          profit: 4500,
        }
      ]
    }
  },
  {
    company: "Company 2",
    location: {
      name: "New York, US",
      left: 27.36,
      top: 45.26
    },
    revenue: 20000,
    increase: 20,
    totalProfit: 5000,
    datasets: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Revenue',
          data: [15, 20, 25, 30, 35],
          profit: 4000,
        },
        {
          label: 'Profit',
          data: [10, 15, 18, 22, 28],
          profit: 3500,
        },
        {
          label: 'Growth',
          data: [8, 12, 20, 25, 32],
          profit: 5000,
        }
      ]
    }
  },
  {
    company: "Company 3",
    location: {
      name: "Berlin, DE",
      left: 50.11,
      top: 42.88
    },
    revenue: 15000,
    increase: 15,
    totalProfit: 5000,
    datasets: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Revenue',
          data: [20, 15, 25, 18, 30],
          profit: 2000,
        },
        {
          label: 'Profit',
          data: [15, 10, 20, 15, 25],
          profit: 3000,
        },
        {
          label: 'Growth',
          data: [10, 15, 22, 18, 24],
          profit: 3500,
        }
      ]
    }
  },
];

export default function Home() {

  const [selectedCompany, setSelectedCompany] = useState<data | null>(data[1]);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [primaryColor, setPrimaryColor] = useState<string>("#000000");
  const [secondaryColor, setSecondaryColor] = useState<string>("#000000");
  const [tertiaryColor, setTertiaryColor] = useState<string>("#000000");

  // Function to update colors from CSS variables
  const updateColors = () => {
    const colorPrimary = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary').trim();
    const colorSecondary = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-secondary').trim();
    const colorTertiary = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-tertiary').trim();
    
    if (colorPrimary) setPrimaryColor(colorPrimary);
    if (colorSecondary) setSecondaryColor(colorSecondary);
    if (colorTertiary) setTertiaryColor(colorTertiary);
  };

  // Initial color setup
  useEffect(() => {
    updateColors();
  }, []);

  // Listen for theme changes
  useEffect(() => {
    // Create a MutationObserver to watch for changes to the document's class or style
    const observer = new MutationObserver(updateColors);
    
    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class', 'style'] 
    });
    
    // Clean up the observer on component unmount
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Implement the logic to handle click event
  };

  return (
    <div className="h-screen p-1 bg-[#5b548a]">
        <div className="bg-background w-full flex flex-col h-full border border-[#4c4279] rounded-4xl px-8 py-4 text-white cf2">
            <ThemeButtons />
            
            {/* Line 1 */}
            <div className="h-[10%] flex justify-between items-center mb-[50px]">

              {/* Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                <p className="text-xs text-gray-400 font-semibold">Welcome back, John Doe</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-12 uppercase">
                <p className="text-xs text-gray-400 font-semibold tracking-wider">Live Tracking</p>
                <p className="text-xs text-gray-400 font-semibold tracking-wider">Product</p>
                <p className="text-xs text-gray-400 font-semibold tracking-wider">Summary</p>
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-gray-400" />
                  <p className="text-xs text-gray-400 font-semibold tracking-wider">Invoice</p>

                </div>
              </div>

            </div>

            {/* Line 2 */}
            <div className="h-[40%] flex flex-row">
                {/* Chart */}
                <div className="flex items-center justify-center w-[40%]">
                  {/* <div className="relative w-full h-full">
                    <ChartIndicator
                      currentProfit={selectedCompany?.revenue || 0} 
                      totalProfit={30000}
                      glowOpacity={0.5}
                    />
                    <DonutChart 
                      currentProfit={selectedCompany?.revenue || 0} 
                      totalProfit={30000} 
                      rounded={true}
                      activeColor={primaryColor}
                      glowOpacity={0.5}
                    />
                  </div> */}

                  <div className="relative w-[400px] h-[400px]">
                    <DonutChart 
                      currentProfit={selectedCompany?.datasets?.datasets[0].profit || 0} 
                      totalProfit={selectedCompany?.totalProfit || 0} 
                      scale={0.8} 
                      activeColor={primaryColor}
                      className="absolute inset-0"
                      style={{ zIndex: 1 }}
                      showText={true}
                      strokeWidth={2}
                    />
                    
                    <DonutChart 
                      currentProfit={selectedCompany?.datasets?.datasets[1].profit || 0} 
                      totalProfit={selectedCompany?.totalProfit || 0} 
                      scale={0.6} 
                      activeColor={secondaryColor}
                      className="absolute inset-0"
                      style={{ zIndex: 2 }}
                      strokeWidth={2}
                    />
                    
                    <DonutChart 
                      currentProfit={selectedCompany?.datasets?.datasets[2].profit || 0} 
                      totalProfit={selectedCompany?.totalProfit || 0} 
                      scale={0.4} 
                      activeColor={tertiaryColor}
                      className="absolute inset-0"
                      style={{ zIndex: 3 }}
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Map */}
                <div className="flex items-center justify-center w-[60%]">
                  {/* <button onClick={() => setSelectedCompany(selectedCompany === data[0] ? data[1] : data[0])}>
                    {selectedCompany?.company}
                  </button> */}
                  <div 
                    className="relative aspect-[568/357] w-full group overflow-visible
                    "
                    ref={imageRef}
                    onMouseMove={handleMouseMove}
                    onClick={handleClick}
                  style={{
                    // background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0))`
                  }}>
                    <Image src="/images/globe.png" alt="map" fill className="object-cover opacity-[0.04]" />
                    
                    {/* Map location points */}
                    {data.map((item, index) => (
                      <div 
                        key={index}
                        className={`absolute w-[6px] h-[6px] rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                          selectedCompany?.company === item.company 
                            ? 'bg-primary shadow-[0_0_20px_2px] shadow-primary/50' 
                            : 'bg-gray-400'
                        }
                        hover:bg-primary hover:shadow-[0_0_20px_2px] hover:shadow-primary/50`}
                        style={{ 
                          left: `${item.location.left}%`, 
                          top: `${item.location.top}%` 
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCompany(item);
                        }}
                      >
                        {selectedCompany?.company === item.company && (
                          <div className="absolute bottom-[1rem] left-1/2 transform -translate-x-1/2 bg-[rgba(255,255,255,0.02)] backdrop-blur-xs border-primary/10 border rounded-lg p-4 text-xs z-10
                          min-w-[150px] min-h-[76px] group-hover:opacity-0 transition-all duration-300">
                            <span className="text-primary font-semibold text-md">Location</span>
                            <p className="text-white font-medium text-xl whitespace-nowrap">{item.location.name}</p>
                          </div>
                        )}

                      </div>
                    ))}
                    
                    {/* <div className="absolute bottom-0 left-0 bg-black/70 text-white p-1 text-xs">
                      Position: {mousePosition.x.toFixed(2)}% left, {mousePosition.y.toFixed(2)}% top
                    </div> */}
                  </div>
                </div>
            </div>   

            
            {/* Line 3 */}
            <div className="h-[40%] flex flex-row pt-[4rem] gap-[9rem]">

              <div className="flex flex-col w-[40%]">
                <h2 className="p-2 py-1 rounded-md border hover:border-gray-300/10 w-fit mb-[2rem]
                font-semibold border-transparent transition-all duration-300">Sales</h2>
                <div className="flex items-center justify-center h-full ml-[1rem]">
                  <LineChart
                  height={"100%"}
                  showNeonShadow={true}
                  shadowOpacity={0.7}
                  showGrid={false}
                  showXAxisLine={false}
                  showYAxisLine={false}
                  showLabel={false}
                  lineColor="#ff0000"
                  shadowColor="#ff0000"
                  labelColor="#ffffff"
                  tickColor="rgba(255, 255, 255, 0.3)"
                  chartTitle="Sales"
                  chartSubtitle="4 months"
                  showTooltip={true}
                  lineTension={0.4}
                  lineWidth={2}
                  showTicks={true}
                  showPoints={false}
                  pointRadius={2}
                  pointColor="#ff0000"
                  pointBorderColor="#ffffff"
                  pointBorderWidth={1}
                  showTitle={false}
                  showSubtitle={false}
                  titleColor="#ffffff"
                  subtitleColor="#ffffff"
                  fill={true}
                  fillColor="#ff0000"
                  fillOpacity={0.5}
                  gradientToTransparent={true}
                  gradientStopPercentage={1}
                  showXGrid={false}
                  showYGrid={false}
                  gridColor="rgba(255, 255, 255, 0.01)"
                  tickFontSize={10}
                  titleFontSize={16}
                  subtitleFontSize={14}
                  tooltipBackgroundColor="rgba(0, 0, 0, 0.7)"
                  tooltipPadding={10}
                  tooltipTitleColor="#ffffff"
                  tooltipBodyFont={9}
                  tooltipTitleFont={12}
                  tooltipUseLineColors={true}
                  datasets={
                    selectedCompany?.datasets?.datasets.map((dataset, index) => {
                      const colors = [primaryColor, secondaryColor, tertiaryColor];
                      const color = colors[index % colors.length];
                      
                      return {
                        data: dataset.data,
                        label: dataset.label,
                        lineColor: color,
                        fillColor: color,
                        fill: index === 0, // Only fill the first dataset
                        shadowColor: color,
                        pointColor: color,
                        pointBorderColor: color,
                        pointRadius: 2,
                      };
                    }) || []
                  }
                  labels={selectedCompany?.datasets?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May']}
                  // key={`chart-${primaryColor}-${secondaryColor}-${tertiaryColor}-${selectedCompany?.company}`}
                  />
                </div>   
              </div>
               
              <div className="flex flex-col items-start justify-start w-[60%]">
                <h2 className="p-2 py-1 rounded-md border hover:border-gray-300/10 w-fit
                  font-semibold border-transparent transition-all duration-300">Transactions</h2>

                <div className="flex flex-col h-full w-full">

                  {/* Header */}
                  <div className="grid grid-cols-[3fr_2fr_2fr_1fr] items-center text-primary/70 px-3 py-2
                  font-semibold text-xs">
                    <div className="">Company</div>                      
                    <div className="">Location</div>
                    <div className="">Revenue</div>
                    <div className="">Increase</div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {data.map((item, index) => (
                    <div key={index} className={`group rounded-md grid grid-cols-[3fr_2fr_2fr_1fr] items-center
                    px-3 py-2 transition-all duration-300 hover:bg-[#ffffff0a]
                    cursor-pointer ${selectedCompany?.company === item.company ? 'text-white' : 'text-[#ffffff96] hover:text-white'}`}
                    onClick={() => setSelectedCompany(item)}>

                      <div className="flex flex-row gap-2 items-center ">
                        <div className="h-[30px] w-[30px] bg-primary/10 rounded-md flex items-center justify-center">
                          <Coins className="w-4 h-4 text-primary/40 group-hover:text-primary transition-all duration-300" />
                        </div>
                        <div className="font-medium text-sm">{item.company}</div>                      
                      </div>

                      <div className="font-medium text-sm">{item.location.name}</div>
                      <div className="font-medium text-sm">{item.revenue}</div>
                      <div className="font-medium text-sm">{item.increase}</div>
                    </div>
                    ))}
                  </div>

                </div>
              </div>


            </div>


        </div>
    </div>
  );
}
