"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { LoadingScreen } from "../animations/LoadingScreen";

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setIsLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setShowContent(true);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
