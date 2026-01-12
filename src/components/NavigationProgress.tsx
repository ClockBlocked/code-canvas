import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

export const NavigationProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsNavigating(true);
    setProgress(30);

    const timer1 = setTimeout(() => setProgress(60), 100);
    const timer2 = setTimeout(() => setProgress(80), 200);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
    }, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  if (!isNavigating) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      <Progress 
        value={progress} 
        className="h-[2px] rounded-none bg-transparent"
      />
    </div>
  );
};
