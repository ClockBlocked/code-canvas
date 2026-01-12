import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const NavigationProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const location = useLocation();
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setIsNavigating(true);
    setOpacity(1);
    setProgress(0);

    // Fast initial progress (like GitHub/YouTube)
    const t1 = setTimeout(() => setProgress(15), 0);
    const t2 = setTimeout(() => setProgress(35), 50);
    const t3 = setTimeout(() => setProgress(55), 100);
    const t4 = setTimeout(() => setProgress(70), 150);
    const t5 = setTimeout(() => setProgress(85), 200);
    const t6 = setTimeout(() => setProgress(95), 300);
    const t7 = setTimeout(() => {
      setProgress(100);
      // Fade out after reaching 100%
      setTimeout(() => {
        setOpacity(0);
        setTimeout(() => {
          setIsNavigating(false);
          setProgress(0);
        }, 200);
      }, 100);
    }, 400);

    timeoutsRef.current = [t1, t2, t3, t4, t5, t6, t7];

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [location.pathname, location.search]);

  if (!isNavigating) return null;

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none"
      style={{ opacity }}
    >
      <div
        className={cn(
          "h-full bg-primary transition-all duration-150 ease-out",
          "shadow-[0_0_10px_hsl(var(--primary)),0_0_5px_hsl(var(--primary))]"
        )}
        style={{ 
          width: `${progress}%`,
          transition: progress === 0 ? 'none' : 'width 150ms ease-out, opacity 200ms ease-out'
        }}
      />
    </div>
  );
};