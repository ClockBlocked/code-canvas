import { useNavigate } from "react-router-dom";
import { useState, useCallback, useTransition } from "react";

export const useNavigation = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isPending, startTransition] = useTransition();

  const navigateTo = useCallback((path: string) => {
    setIsNavigating(true);
    startTransition(() => {
      navigate(path);
      setTimeout(() => setIsNavigating(false), 300);
    });
  }, [navigate]);

  return {
    navigateTo,
    isNavigating: isNavigating || isPending,
  };
};
