"use client";

import { MoonIcon, PaletteIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeButtonProps {
  themeName: string;
  currentTheme: string | undefined;
  onClick: () => void;
  label: string |  React.ReactNode;
}

interface StaticThemeButtonProps {
  label: string | React.ReactNode;
}

const color = {
  light: {
    background: "#241a55",
    primary: "#44e4fa",
    secondary: "#10b981",
    tertiary: "#8b5cf6",
  },
  dark: {
    background: "#0f0f0f",
    primary: "#147265",
    secondary: "#34d399",
    tertiary: "#a78bfa",
  },
  custom: {
    background: "#14144d",
    primary: "#ff0077",
    secondary: "#ff00ff",
    tertiary: "#ffff00",
  },
};
// render a button
const ThemeButton = ({
  themeName,
  currentTheme,
  onClick,
  label,
}: ThemeButtonProps) => {
  return (
      <button onClick={onClick}
      className={`flex items-center justify-center cursor-pointer p-2 rounded-full transition-colors 
        ${currentTheme === themeName ? "bg-blue-500 text-white" 
        :` hover:bg-[${color[themeName as keyof typeof color].secondary}]`}`}
        style={{
          backgroundColor: color[themeName as keyof typeof color].background,
          color: color[themeName as keyof typeof color].primary,
        }}>
      {label}
    </button>
  );
};

// render a static button
const StaticThemeButton = ({ label }: StaticThemeButtonProps) => {
  return (
    <button className="flex items-center cursor-pointer px-4 py-2 rounded-md bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
      {label}
    </button>
  );
};

// page mount action
export const ThemeButtons = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  interface ThemeOption {
    id: string;
    label: string | React.ReactNode;
  }

  const themes: ThemeOption[] = [
    { id: "light", label: <SunIcon className="w-4 h-4" /> },
    { id: "dark", label: <MoonIcon className="w-4 h-4" /> },
    { id: "custom", label: <PaletteIcon className="w-4 h-4" /> },
  ];

  // wait for page mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // set theme to system theme
  useEffect(() => {
    if (mounted && !theme) {
      const systemTheme =
        resolvedTheme ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");

      setTheme(systemTheme);
    }
  }, [mounted, theme, resolvedTheme, setTheme]);

  if (!mounted) {
    return (
      <div className="flex flex-col gap-4">
        {themes.map((themeOption: ThemeOption) => (
          <StaticThemeButton key={themeOption.id} label={themeOption.label} />
        ))}
      </div>
    );
  }

  const effectiveTheme = resolvedTheme || theme;

  return (
    <div className="flex flex-row gap-1 bg-white p-1 rounded-full w-fit fixed bottom-4 right-4 z-50">
      {themes.map((themeOption: ThemeOption) => (
        <ThemeButton
          key={themeOption.id}
          themeName={themeOption.id}
          currentTheme={effectiveTheme}
          onClick={() => setTheme(themeOption.id)}
          label={themeOption.label}
        />
      ))}
    </div>
  );
};